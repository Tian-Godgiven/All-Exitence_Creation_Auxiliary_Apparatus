import type { Article } from "@/class/Article"
import type { Chapter } from "@/class/Chapter"
import { isTextStyleData, translateToTextContent, type TextAreaContent, type TextStyleData, type TextStyleDirection, type TextStyleShakeDirection } from "@/hooks/expression/textAreaContent"
import { open } from "@tauri-apps/plugin-dialog"
import { exists, mkdir, writeTextFile } from "@tauri-apps/plugin-fs"
import { join } from "@tauri-apps/api/path"
import { invoke } from "@tauri-apps/api/core"
import { save } from "@tauri-apps/plugin-dialog"

export type ExportArticle = { article: Article, chapterPath: string[] }
export type ExportBookInfo = { title: string, author: string, description: string, cover: string }
export type ExportFormat = "text" | "ao3" | "epub"
export type ExportTreeItem = { key: string, label: string, kind: "chapter" | "article", depth: number, articleKeys: string[] }
type EpubFile = { path: string, content: string }
type ExportStyleContext = { rules: string[], effectIndex: number, shakeNames: Map<string, string> }
type CharacterEffect = { render: (character: string) => string }

export function listProjectArticles(chapters: Chapter[], articles: Article[], path: string[] = []): ExportArticle[]{
    // 与左侧目录一致：每个章节和其子内容在前，同级未分类文章在后。
    const result: ExportArticle[] = []
    chapters.forEach(chapter => result.push(...listProjectArticles(chapter.chapters, chapter.articles, [...path, chapter.name || "未命名章节"])))
    result.push(...articles.map(article => ({ article, chapterPath: path })))
    return result
}

export function listExportTree(chapters: Chapter[], articles: Article[], depth = 0): ExportTreeItem[]{
    const result: ExportTreeItem[] = []
    chapters.forEach(chapter => {
        const children = listExportTree(chapter.chapters, chapter.articles, depth + 1)
        result.push({
            key: chapter.__key,
            label: chapter.name || "未命名章节",
            kind: "chapter",
            depth,
            articleKeys: children.flatMap(item => item.kind === "article" ? item.articleKeys : []),
        }, ...children)
    })
    articles.forEach(article => result.push({ key: article.__key, label: article.title || "未命名文章", kind: "article", depth, articleKeys: [article.__key] }))
    return result
}

export function createTextExport(items: ExportArticle[], includeChapterTitles: boolean, book?: Partial<ExportBookInfo>): string{
    const parts: string[] = []
    let previousPath = ""
    items.forEach(({ article, chapterPath }) => {
        const chapter = chapterPath.join(" / ")
        if(includeChapterTitles && chapter && chapter !== previousPath) parts.push(`<${chapter}>`)
        previousPath = chapter
        if(article.title) parts.push(`[${article.title}]`)
        const content = translateToTextContent(article.inner)
        if(content) parts.push(content)
    })
    const description = book?.description?.trim()
    return [description, ...parts].filter((part): part is string => Boolean(part)).join("\n\n")
}

export function textExportName(book: Pick<ExportBookInfo, "title" | "author">): string{
    const title = book.title.trim() || "未命名作品"
    const author = book.author.trim() || "未署名"
    return `${title} - ${author}`
}

export async function exportTextFolder(book: ExportBookInfo, chapters: Chapter[], articles: Article[], selectedKeys: string[]): Promise<string | null>{
    const destination = await open({ title: "选择纯文本导出位置", directory: true, multiple: false, recursive: true })
    if(!destination || Array.isArray(destination)) return null
    const folder = await uniqueDirectory(destination, safeFileName(textExportName(book)))
    await mkdir(folder)
    await writeTextFile(await join(folder, "README.md"), createReadme(book))
    const selected = new Set(selectedKeys)
    const folderNames = new Set<string>()
    for(const chapter of chapters) await writeChapter(chapter, folder, selected, folderNames)
    await writeArticles(articles, folder, selected)
    return folder
}

async function uniqueDirectory(parent: string, baseName: string): Promise<string>{
    let index = 1
    let name = baseName
    let candidate = await join(parent, name)
    while(await exists(candidate)){
        index += 1
        name = `${baseName} (${index})`
        candidate = await join(parent, name)
    }
    return candidate
}

function chapterContainsSelected(chapter: Chapter, selected: Set<string>): boolean{
    return chapter.articles.some(article => selected.has(article.__key)) || chapter.chapters.some(child => chapterContainsSelected(child, selected))
}

async function writeChapter(chapter: Chapter, parent: string, selected: Set<string>, siblingNames: Set<string>): Promise<void>{
    if(!chapterContainsSelected(chapter, selected)) return
    const name = uniqueLocalName(safeFileName(chapter.name || "未命名章节"), siblingNames)
    const folder = await join(parent, name)
    await mkdir(folder)
    const childNames = new Set<string>()
    for(const child of chapter.chapters) await writeChapter(child, folder, selected, childNames)
    await writeArticles(chapter.articles, folder, selected)
}

async function writeArticles(articles: Article[], parent: string, selected: Set<string>): Promise<void>{
    const names = new Set<string>()
    for(const article of articles){
        if(!selected.has(article.__key)) continue
        const name = uniqueLocalName(safeFileName(article.title || "未命名文章"), names)
        await writeTextFile(await join(parent, `${name}.txt`), translateToTextContent(article.inner))
    }
}

function uniqueLocalName(baseName: string, used: Set<string>): string{
    let index = 1
    let name = baseName
    while(used.has(name)) name = `${baseName} (${++index})`
    used.add(name)
    return name
}

function createReadme(book: ExportBookInfo): string{
    return [
        `# ${book.title.trim() || "未命名作品"}`,
        `作者：${book.author.trim() || "未署名"}`,
        "",
        "## 简介",
        book.description.trim() || "暂无简介。",
        "",
        "## 封面",
        book.cover.trim() ? `封面：${book.cover.trim()}（封面复制将在后续导出格式中支持）` : "封面：暂未设置。",
    ].join("\n")
}

export function createAo3Export(items: ExportArticle[], includeChapterTitles: boolean): { html: string, css: string }{
    const context = createStyleContext()
    const parts: string[] = []
    let previousPath = ""
    items.forEach(({ article, chapterPath }) => {
        const chapter = chapterPath.join(" / ")
        if(includeChapterTitles && chapter && chapter !== previousPath) parts.push(`<h2>${escapeHtml(chapter)}</h2>`)
        previousPath = chapter
        if(article.title) parts.push(`<h3>${escapeHtml(article.title)}</h3>`)
        parts.push(contentToHtml(article.inner, context))
    })
    return { html: parts.join("\n"), css: [ao3Css, ...context.rules].join("\n") }
}

export async function exportEpub(book: ExportBookInfo, items: ExportArticle[]): Promise<boolean>{
    const output = await save({
        title: "保存 EPUB",
        defaultPath: `${safeFileName(textExportName(book))}.epub`,
        filters: [{ name: "EPUB 电子书", extensions: ["epub"] }],
    })
    if(!output) return false
    const path = output.toLowerCase().endsWith(".epub") ? output : `${output}.epub`
    await invoke("write_epub", { path, files: createEpubFiles(book, items) })
    return true
}

function createEpubFiles(book: ExportBookInfo, items: ExportArticle[]): EpubFile[]{
    const context = createStyleContext()
    const chapters = items.map((item, index) => ({ ...item, id: `chapter-${index + 1}`, path: `OEBPS/text/chapter-${String(index + 1).padStart(3, "0")}.xhtml` }))
    const identifier = `urn:all-exitence:${safeFileName(textExportName(book)).replace(/\s+/g, "-")}`
    const manifest = [
        '<item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>',
        '<item id="css" href="styles/book.css" media-type="text/css"/>',
        ...chapters.map(chapter => `<item id="${chapter.id}" href="text/${chapter.path.split("/").at(-1)}" media-type="application/xhtml+xml"/>`),
    ].join("\n    ")
    const spine = chapters.map(chapter => `<itemref idref="${chapter.id}"/>`).join("\n    ")
    const nav = chapters.map(chapter => `<li><a href="text/${chapter.path.split("/").at(-1)}">${escapeXml(chapter.article.title || "未命名文章")}</a></li>`).join("\n        ")
    const packageDocument = `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="book-id" xml:lang="zh-CN">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="book-id">${escapeXml(identifier)}</dc:identifier>
    <dc:title>${escapeXml(book.title)}</dc:title>
    <dc:creator>${escapeXml(book.author)}</dc:creator>
    <dc:language>zh-CN</dc:language>
    <dc:description>${escapeXml(book.description)}</dc:description>
    <meta property="dcterms:modified">${new Date().toISOString().replace(/\.\d{3}Z$/, "Z")}</meta>
  </metadata>
  <manifest>
    ${manifest}
  </manifest>
  <spine>
    ${spine}
  </spine>
</package>`
    const chapterFiles = chapters.map(chapter => ({
        path: chapter.path,
        content: xhtmlDocument(chapter.article.title || "未命名文章", `<h1>${escapeHtml(chapter.article.title || "未命名文章")}</h1>\n${contentToHtml(chapter.article.inner, context)}`, "../styles/book.css"),
    }))
    return [
        { path: "META-INF/container.xml", content: `<?xml version="1.0" encoding="UTF-8"?>\n<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/package.opf" media-type="application/oebps-package+xml"/></rootfiles></container>` },
        { path: "OEBPS/package.opf", content: packageDocument },
        { path: "OEBPS/nav.xhtml", content: xhtmlDocument(book.title, `<nav epub:type="toc" id="toc"><h1>目录</h1><ol>\n        ${nav}\n      </ol></nav>`, "styles/book.css") },
        { path: "OEBPS/styles/book.css", content: [epubCss, ...context.rules].join("\n") },
        ...chapterFiles,
    ]
}

function xhtmlDocument(title: string, body: string, cssPath: string): string{
    return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="zh-CN" lang="zh-CN">
<head><meta charset="UTF-8"/><title>${escapeXml(title)}</title><link rel="stylesheet" type="text/css" href="${cssPath}"/></head>
<body>${body}</body>
</html>`
}

function contentToHtml(content: TextAreaContent[] | string, context: ExportStyleContext, characterEffect?: CharacterEffect): string{
    const source = Array.isArray(content) ? content : [content]
    const blocks: string[] = []
    let parts: TextAreaContent[] = []
    const flush = (empty = false) => {
        if(parts.length) blocks.push(`<p>${renderInlineContents(parts, context, characterEffect)}</p>`)
        else if(empty) blocks.push("<p><br/></p>")
        parts = []
    }
    source.forEach(part => {
        if(part === "\n") { flush(true); return }
        if(isTextStyleData(part) && part.scope === "paragraph") {
            flush()
            blocks.push(styleToHtml(part, context, characterEffect, true))
            return
        }
        parts.push(part)
    })
    flush(blocks.length === 0)
    return blocks.join("\n")
}

function renderInlineContents(content: TextAreaContent[], context: ExportStyleContext, characterEffect?: CharacterEffect): string{
    return content.map(part => partToHtml(part, context, characterEffect)).join("")
}

function partToHtml(part: TextAreaContent, context: ExportStyleContext, characterEffect?: CharacterEffect): string{
    if(typeof part === "string"){
        if(part === "\n") return "<br/>"
        return characterEffect ? Array.from(part).map(character => characterEffect.render(character)).join("") : escapeHtml(part)
    }
    if(!isTextStyleData(part)) return escapeHtml(String((part as any).text ?? ""))
    return styleToHtml(part, context, characterEffect)
}

function styleToHtml(data: TextStyleData, context: ExportStyleContext, inheritedEffect?: CharacterEffect, block = false): string{
    const snapshot = data.snapshot
    if(snapshot.effect === "opacity" && snapshot.value.progressive){
        const inner = block ? contentToHtml(data.content, context, createProgressiveOpacityEffect(snapshot.value, data.content)) : renderInlineContents(data.content, context, createProgressiveOpacityEffect(snapshot.value, data.content))
        return block ? `<div>${inner}</div>` : inner
    }
    if(snapshot.effect === "blur" && snapshot.value.progressive){
        const inner = block ? contentToHtml(data.content, context, createProgressiveBlurEffect(snapshot.value, data.content)) : renderInlineContents(data.content, context, createProgressiveBlurEffect(snapshot.value, data.content))
        return block ? `<div>${inner}</div>` : inner
    }
    if(snapshot.effect === "shake") return renderShake(data, context, inheritedEffect)
    if(snapshot.effect === "offset") return renderOffset(data, context, inheritedEffect)
    const inner = block ? contentToHtml(data.content, context, inheritedEffect) : renderInlineContents(data.content, context, inheritedEffect)
    return wrapStyle(data, inner, block)
}

function createStyleContext(): ExportStyleContext{ return { rules: [], effectIndex: 0, shakeNames: new Map() } }

function renderShake(data: TextStyleData, context: ExportStyleContext, inheritedEffect?: CharacterEffect): string{
    const value: any = data.snapshot.value
    const duration = 1 / Math.max(0.5, Number(value.frequency) || 5.5)
    const strength = Math.max(0, Number(value.strength) || 0)
    if(value.synchronized){
        const name = registerShakeKeyframes(context, shakePath(value.path, value.directions), strength)
        return `<span style="display:inline-block;animation:${name} ${duration}s steps(1,end) infinite">${renderInlineContents(data.content, context, inheritedEffect)}</span>`
    }
    let index = 0
    return data.content.map(part => {
        if(typeof part !== "string"){
            const name = registerShakeKeyframes(context, characterShakePath(value, index), strength)
            const delay = randomValue(index++ * 13) * duration
            return `<span style="display:inline-block;animation:${name} ${duration}s steps(1,end) infinite;animation-delay:-${delay.toFixed(3)}s">${partToHtml(part, context, inheritedEffect)}</span>`
        }
        return Array.from(part).map(character => {
            const name = registerShakeKeyframes(context, characterShakePath(value, index), strength)
            const delay = randomValue(index++ * 13) * duration
            return `<span style="display:inline-block;animation:${name} ${duration}s steps(1,end) infinite;animation-delay:-${delay.toFixed(3)}s">${inheritedEffect ? inheritedEffect.render(character) : escapeHtml(character)}</span>`
        }).join("")
    }).join("")
}

function shakePath(path: TextStyleShakeDirection[] | undefined, directions: TextStyleDirection[]): TextStyleShakeDirection[]{
    if(path?.length) return path
    const fallback = directions?.length ? directions : ["up", "right", "down", "left"] as TextStyleDirection[]
    return fallback.map(direction => directionVector(direction))
}

function characterShakePath(value: { directions?: TextStyleDirection[], regularity?: number }, index: number): TextStyleShakeDirection[]{
    const enabled = (value.directions ?? []).map(directionVector)
    const directions = enabled.length ? enabled : [directionVector("up"), directionVector("right"), directionVector("down"), directionVector("left")]
    const irregularity = 1 - Math.min(100, Math.max(0, Number(value.regularity) || 0)) / 100
    return Array.from({ length: 8 }, (_, step) => {
        const roll = randomValue(index * 19 + step * 7)
        return roll >= irregularity
            ? directions[(index + step) % directions.length]
            : directions[Math.floor(randomValue(index * 31 + step * 11) * directions.length)]
    })
}

function registerShakeKeyframes(context: ExportStyleContext, path: TextStyleShakeDirection[], strength: number): string{
    const signature = `${strength}:${path.map(point => `${point.x},${point.y}`).join(";")}`
    const existing = context.shakeNames.get(signature)
    if(existing) return existing
    const name = `ae-export-shake-${++context.effectIndex}`
    context.shakeNames.set(signature, name)
    // 与编辑器一致：首尾静止，中间使用独立随机路径的八个采样点。
    const frames = path.map((point,index) => `${index === 7 ? 94 : (index + 1) * 12.5}% { transform: translate(${point.x * strength}px, ${point.y * strength}px); }`)
    context.rules.push(`@keyframes ${name} { 0%, 100% { transform: translate(0, 0); } ${frames.join(" ")} }`)
    return name
}

function renderOffset(data: TextStyleData, context: ExportStyleContext, inheritedEffect?: CharacterEffect): string{
    const value: any = data.snapshot.value
    let index = 0
    return data.content.map(part => {
        if(typeof part !== "string") return partToHtml(part, context, inheritedEffect)
        return Array.from(part).map(character => {
            const x = (offsetRandom(value.seed + index * 2) * 2 - 1) * value.amount
            const y = (offsetRandom(value.seed + index * 2 + 1) * 2 - 1) * value.amount
            index += 1
            return `<span style="display:inline-block;transform:translate(${x.toFixed(2)}px,${y.toFixed(2)}px)">${inheritedEffect ? inheritedEffect.render(character) : escapeHtml(character)}</span>`
        }).join("")
    }).join("")
}

function offsetRandom(seed: number): number{
    const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453
    return value - Math.floor(value)
}

function randomValue(seed: number): number{ return offsetRandom(seed) }

function createProgressiveOpacityEffect(value: { opacity: number, startOpacity: number, direction: TextStyleDirection, center: number }, content: TextAreaContent[]): CharacterEffect{
    return createProgressiveEffect(content, value.direction, value.center, progress => `<span style="opacity:${normalizeOpacity(value.startOpacity + (value.opacity - value.startOpacity) * progress)}">`)
}

function createProgressiveBlurEffect(value: { amount: number, startAmount: number, direction: TextStyleDirection, center: number }, content: TextAreaContent[]): CharacterEffect{
    return createProgressiveEffect(content, value.direction, value.center, progress => `<span style="display:inline-block;filter:blur(${(value.startAmount + (value.amount - value.startAmount) * progress).toFixed(2)}px)">`)
}

function createProgressiveEffect(content: TextAreaContent[], direction: TextStyleDirection, center: number, open: (progress: number) => string): CharacterEffect{
    const total = Math.max(1, countCharacters(content))
    let index = 0
    const reverse = ["left", "up", "upLeft", "upRight"].includes(direction)
    const start = Math.min(100, Math.max(0, Number(center) || 0))
    return { render(character){
        const position = total === 1 ? 100 : index++ / (total - 1) * 100
        const oriented = reverse ? 100 - position : position
        const progress = oriented <= start || start >= 100 ? 0 : (oriented - start) / (100 - start)
        return `${open(Math.min(1, Math.max(0, progress)))}${escapeHtml(character)}</span>`
    } }
}

function countCharacters(content: TextAreaContent[]): number{
    return content.reduce((count, part) => count + (typeof part === "string" ? (part === "\n" ? 0 : Array.from(part).length) : isTextStyleData(part) ? countCharacters(part.content) : String((part as any).text ?? "").length), 0)
}

function directionVector(direction: TextStyleDirection): TextStyleShakeDirection{
    const directions: Record<TextStyleDirection, TextStyleShakeDirection> = { up:{ x:0, y:-1 }, upRight:{ x:1, y:-1 }, right:{ x:1, y:0 }, downRight:{ x:1, y:1 }, down:{ x:0, y:1 }, downLeft:{ x:-1, y:1 }, left:{ x:-1, y:0 }, upLeft:{ x:-1, y:-1 } }
    return directions[direction]
}

function wrapStyle(data: TextStyleData, inner: string, block = false): string{
    const snapshot = data.snapshot
    const value: any = snapshot.value
    const tag = block ? "div" : "span"
    if(snapshot.effect === "fontWeight") return `<${tag} style="font-weight:${Number(value) || 700}">${inner}</${tag}>`
    if(snapshot.effect === "italic") return `<${tag} style="font-style:italic">${inner}</${tag}>`
    if(snapshot.effect === "color") return `<${tag} style="color:${escapeAttribute(String(value ?? "inherit"))}">${inner}</${tag}>`
    if(snapshot.effect === "blur") return `<${tag} style="filter:blur(${Math.max(0, Number(value?.amount ?? value) || 0)}px)">${inner}</${tag}>`
    if(snapshot.effect === "opacity") return `<${tag} style="opacity:${normalizeOpacity(value?.opacity ?? value)}">${inner}</${tag}>`
    if(snapshot.effect === "shake") return `<${tag} class="ae-export-shake">${inner}</${tag}>`
    if(snapshot.effect === "offset") return `<${tag} class="ae-export-offset">${inner}</${tag}>`
    if(snapshot.effect === "spoiler") return `<${tag} class="ae-export-spoiler">${inner}</${tag}>`
    return inner
}

export function downloadTextFile(name: string, content: string): void{
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = `${safeFileName(name)}.txt`
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    URL.revokeObjectURL(url)
}

export function safeFileName(value: string): string{
    return (value.trim() || "未命名作品").replace(/[\\/:*?"<>|]/g, "_").slice(0, 100)
}

function escapeHtml(value: string): string{
    return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;")
}

function escapeAttribute(value: string): string{ return escapeHtml(value) }

function escapeXml(value: string): string{ return escapeHtml(value) }

function normalizeOpacity(value: unknown): number{
    // 工程数据以 0-100 的百分比保存；CSS opacity 使用 0-1。
    return Math.min(1, Math.max(0, Number(value) / 100 || 0))
}

export const ao3Css = `.ae-export-spoiler { background: #000; color: #000; transition: color .15s; }
.ae-export-spoiler:hover { color: inherit; }`

const epubCss = `body { margin: 0 5%; font-family: serif; line-height: 1.75; color: #1a1a1a; background: transparent; }
h1 { margin: 1.5em 0 1em; font-size: 1.5em; text-align: center; } p { margin: 0 0 1em; }
.ae-export-spoiler { display: inline; background-color: #000; color: #000; animation: ae-export-spoiler-pulse 8s ease-in-out infinite alternate; }
@keyframes ae-export-spoiler-pulse { from { background-color: #000; color: #000; } to { background-color: transparent; color: inherit; } }
@media (prefers-reduced-motion: reduce) { .ae-export-spoiler { animation: none; } }`
