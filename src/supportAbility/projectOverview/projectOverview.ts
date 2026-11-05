import { computed, reactive, shallowRef, toRaw, watch } from "vue"
import { cloneDeep } from "lodash"
import { nanoid } from "nanoid"
import { addToRightPage } from "@/hooks/pages/rightPage"
import { openMainToolPage } from "@/hooks/pages/mainPage/toolPage"
import { appSetting } from "@/hooks/app/appSetting"
import { addArticle, addChapter, createChapter, nowAllArticles } from "@/hooks/all-articles/allArticles"
import type { Article } from "@/class/Article"
import type { Chapter } from "@/class/Chapter"
import type { ProjectFeature } from "@/repository/projectFeature"
import type { SupportAbilitySignUpItem } from "@/static/list/supportAbilityList"
import ProjectOverviewPage from "./ProjectOverviewPage.vue"
import ProjectOverviewSettings from "./ProjectOverviewSettings.vue"

export type OverviewTask = { __key: string, text: string, done: boolean }
export type OverviewChapterNode = { __key: string, title: string, description: string, tasks: OverviewTask[], position: { x: number, y: number }, size: { width: number, height: number }, innerViewport: { x: number, y: number, scale: number }, targetKey: string | null, expanded: boolean }
export type OverviewArticleNode = { __key: string, chapterNodeKey: string | null, title: string, description: string, tasks: OverviewTask[], position: { x: number, y: number }, targetKey: string | null }
export type OverviewConnection = { __key: string, from: string, to: string }
export type ProjectOverview = { showInLeft: boolean, viewport: { x: number, y: number, scale: number }, chapters: OverviewChapterNode[], articles: OverviewArticleNode[], connections: OverviewConnection[] }

const makeDefault = (): ProjectOverview => ({ showInLeft: appSetting.projectOverviewAutoShow !== false, viewport: { x: 0, y: 0, scale: 1 }, chapters: [], articles: [], connections: [] })
export const nowProjectOverview = reactive<ProjectOverview>(makeDefault())

export const projectOverviewProjectFeature: ProjectFeature<ProjectOverview> = {
    key: "project-overview",
    createDefault: makeDefault,
    load: (data) => Object.assign(nowProjectOverview, normalize(data)),
    snapshot: () => cloneDeep(toRaw(nowProjectOverview)),
}

export const projectOverviewSignUpItem: SupportAbilitySignUpItem = {
    name: "projectOverview",
    init: () => addToRightPage({ key: "project-overview", name: "项目总览", icon: "article", click: showProjectOverviewPage }),
}

export function showProjectOverviewPage(){ openMainToolPage({ name: "项目总览", component: ProjectOverviewPage, actions: [{ name: "设置", icon: "setting", click: showProjectOverviewSettings }] }) }
export async function showProjectOverviewSettings(){
    const { showPopUp } = await import("@/hooks/pages/popUp")
    showPopUp({ name: "项目总览设置", vue: shallowRef(ProjectOverviewSettings), mask: true, size: { height: "auto" } })
}
export function showProjectOverviewInLeft(){ nowProjectOverview.showInLeft = true }
export function hideProjectOverviewInLeft(){ nowProjectOverview.showInLeft = false }

export function createOverviewChapter(position = { x: 80, y: 80 }){
    const node: OverviewChapterNode = { __key: nanoid(), title: "", description: "", tasks: [], position, size: { width: 680, height: 500 }, innerViewport: { x: 0, y: 0, scale: 1 }, targetKey: null, expanded: false }
    nowProjectOverview.chapters.push(node)
    return node
}
export function createOverviewArticle(chapterNodeKey: string | null, position = { x: 120, y: 120 }){
    const node: OverviewArticleNode = { __key: nanoid(), chapterNodeKey, title: "", description: "", tasks: [], position, targetKey: null }
    nowProjectOverview.articles.push(node)
    return node
}
export function createOverviewTask(node: OverviewChapterNode | OverviewArticleNode){
    const task = { __key: nanoid(), text: "", done: false }
    node.tasks.push(task)
    return task
}
export function createOverviewConnection(from: OverviewChapterNode | OverviewArticleNode, to: OverviewChapterNode | OverviewArticleNode){
    if(from.__key === to.__key || nowProjectOverview.connections.some(connection =>
        (connection.from === from.__key && connection.to === to.__key) || (connection.from === to.__key && connection.to === from.__key))) return
    nowProjectOverview.connections.push({ __key: nanoid(), from: from.__key, to: to.__key })
}

export function getOverviewChapterTarget(node: OverviewChapterNode): Chapter | null {
    if(!node.targetKey) return null
    return findChapter(node.targetKey)
}
export function getOverviewArticleTarget(node: OverviewArticleNode): Article | null {
    if(!node.targetKey) return null
    return findArticle(node.targetKey)
}
export function createTargetChapter(node: OverviewChapterNode){
    const chapter = createChapter(node.title)
    addChapter(chapter)
    node.targetKey = chapter.__key
    return chapter
}
export function createTargetArticle(node: OverviewArticleNode){
    const chapterNode = nowProjectOverview.chapters.find(candidate => candidate.__key === node.chapterNodeKey)
    const parent = chapterNode ? getOverviewChapterTarget(chapterNode) ?? createTargetChapter(chapterNode) : null
    const article = addArticle(parent ?? nowAllArticles)
    article.title = node.title
    article.inner = node.description
    node.targetKey = article.__key
    return article
}
export function syncOverviewNodeTitle(node: OverviewChapterNode | OverviewArticleNode){
    if(isOverviewArticleNode(node)){ const article = getOverviewArticleTarget(node); if(article) article.title = node.title }
    else { const chapter = getOverviewChapterTarget(node); if(chapter) chapter.name = node.title }
}

export function isOverviewArticleNode(node: OverviewChapterNode | OverviewArticleNode): node is OverviewArticleNode { return "chapterNodeKey" in node }

export const overviewTasksForArticle = (article: Article) => computed(() => nowProjectOverview.articles.filter(node => node.targetKey === article.__key))

function findChapter(key: string): Chapter | null {
    const visit = (items: Chapter[]): Chapter | null => {
        for(const chapter of items){ if(chapter.__key === key) return chapter; const found = visit(chapter.chapters); if(found) return found }
        return null
    }
    return visit(nowAllArticles.chapters)
}
function findArticle(key: string): Article | null {
    const visit = (chapters: Chapter[]): Article | null => {
        for(const chapter of chapters){ const direct = chapter.articles.find(article => article.__key === key); if(direct) return direct; const found = visit(chapter.chapters); if(found) return found }
        return null
    }
    return nowAllArticles.articles.find(article => article.__key === key) ?? visit(nowAllArticles.chapters)
}
function normalize(data: Partial<ProjectOverview> | null | undefined): ProjectOverview {
    const articles = (data?.articles ?? []).map(node => ({ ...node, description: node.description ?? "", tasks: node.tasks ?? [], targetKey: node.targetKey ?? null }))
    return {
        showInLeft: data?.showInLeft !== false,
        viewport: data?.viewport ?? { x: 0, y: 0, scale: 1 },
        chapters: (data?.chapters ?? []).map(node => ({ ...node, tasks: node.tasks ?? [], size: { width: Math.max(680, node.size?.width ?? 680), height: Math.max(500, node.size?.height ?? 500) }, innerViewport: node.innerViewport ?? { x: 0, y: 0, scale: 1 }, expanded: node.expanded ?? false })),
        articles,
        connections: (data?.connections ?? []).map((raw: any) => {
            const { boardKey: _boardKey, ...connection } = raw
            return connection
        }),
    }
}

// A removed article or chapter leaves its planning node intact and available for recreation.
watch(nowAllArticles, () => {
    nowProjectOverview.chapters.forEach(node => { if(node.targetKey && !findChapter(node.targetKey)) node.targetKey = null })
    nowProjectOverview.articles.forEach(node => { if(node.targetKey && !findArticle(node.targetKey)) node.targetKey = null })
    nowProjectOverview.chapters.forEach(node => { const chapter = getOverviewChapterTarget(node); if(chapter && chapter.name !== node.title) node.title = chapter.name })
    nowProjectOverview.articles.forEach(node => { const article = getOverviewArticleTarget(node); if(article && article.title !== node.title) node.title = article.title })
}, { deep: true })
