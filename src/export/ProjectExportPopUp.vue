<template>
    <section class="projectExport">
        <div class="bookInfo">
            <label>书名<input v-model.trim="book.title" placeholder="书名"></label>
            <label>作者<input v-model.trim="book.author" placeholder="作者名"></label>
            <label>简介<textarea v-model="book.description" placeholder="作品简介"></textarea></label>
            <label v-if="format === 'epub'">封面路径<input v-model.trim="book.cover" placeholder="暂不支持封面导出"></label>
            <p v-if="format === 'epub'" class="requiredHint">EPUB 需要填写书名与作者。EPUB 文件生成将在后续接入。</p>
        </div>

        <div class="selectionHead"><strong>导出文章</strong><button @click="selectAll">{{ allSelected ? '取消全选' : '全选' }}</button></div>
        <div class="articleList">
            <label v-for="item in treeItems" :key="`${item.kind}-${item.key}`" class="articleItem" :class="item.kind" :style="{ paddingLeft: `${12 + item.depth * 20}px` }">
                <input :ref="element => setCheckboxElement(element, item)" type="checkbox" :checked="isItemSelected(item)" @change="toggleTreeItem(item, $event)">
                <span>{{ item.label }}</span>
            </label>
        </div>

        <label class="chapterToggle"><input v-model="includeChapterTitles" type="checkbox">保留章节标题</label>
        <div v-if="format === 'text'" class="textMode"><label><input v-model="textMode" type="radio" value="single">合并为单个文件</label><label><input v-model="textMode" type="radio" value="folder">按章节创建文件夹</label></div>

        <FinalButtons :buttons="actions" />
    </section>
</template>

<script setup lang="ts">
import { computed, reactive, ref, shallowRef } from "vue"
import { closePopUp, showPopUp } from "@/hooks/pages/popUp"
import { nowProjectInfo } from "@/hooks/project/project"
import { nowAllArticles } from "@/hooks/all-articles/allArticles"
import { showQuickInfo } from "@/api/showQuickInfo"
import FinalButtons from "@/app/stacks/popUp/FinalButtons.vue"
import { ao3Css, createAo3Export, createTextExport, downloadTextFile, exportEpub, exportTextFolder, listExportTree, listProjectArticles, textExportName, type ExportBookInfo, type ExportFormat, type ExportTreeItem } from "./projectExport"
import ProjectAo3PreviewPopUp from "./ProjectAo3PreviewPopUp.vue"

const { popUp, props } = defineProps<{ popUp: any, props: { state: { format: ExportFormat } } }>()
const format = computed({ get: () => props.state.format, set: (value: ExportFormat) => { props.state.format = value } })
const textMode = ref<"single" | "folder">("single")
const includeChapterTitles = ref(true)
const articles = computed(() => listProjectArticles(nowAllArticles.chapters, nowAllArticles.articles))
const treeItems = computed(() => listExportTree(nowAllArticles.chapters, nowAllArticles.articles))
const selectedKeys = ref<string[]>(articles.value.map(item => item.article.__key))
const book = reactive<ExportBookInfo>({ title: nowProjectInfo.name || "", author: "", description: nowProjectInfo.info || "", cover: "" })
const selectedArticles = computed(() => articles.value.filter(item => selectedKeys.value.includes(item.article.__key)))
const allSelected = computed(() => selectedKeys.value.length === articles.value.length && articles.value.length > 0)
const ao3Export = computed(() => createAo3Export(selectedArticles.value, includeChapterTitles.value))
const ao3Code = computed(() => `<!-- 正文 HTML -->\n${ao3Export.value.html}\n\n/* Work Skin CSS */\n${ao3Export.value.css}`)
const ao3PreviewDocument = computed(() => `<!doctype html><html><head><meta charset="utf-8"><style>body{margin:16px;color:#222;font:16px/1.75 sans-serif}h2{margin-top:1.8em}h3{margin-top:1.4em}${ao3Export.value.css}</style></head><body>${ao3Export.value.html}</body></html>`)
const actions = computed(() => [{ name: format.value === "ao3" ? "下一步" : format.value === "epub" ? "导出 EPUB" : "导出纯文本", click: submit }, { name: "取消", click: () => closePopUp(popUp) }])

function selectAll(){ selectedKeys.value = allSelected.value ? [] : articles.value.map(item => item.article.__key) }
function isItemSelected(item: ExportTreeItem){ return item.articleKeys.length > 0 && item.articleKeys.every(key => selectedKeys.value.includes(key)) }
function setCheckboxElement(element: Element | null, item: ExportTreeItem){
    if(!(element instanceof HTMLInputElement)) return
    const count = item.articleKeys.filter(key => selectedKeys.value.includes(key)).length
    element.indeterminate = count > 0 && count < item.articleKeys.length
}
function toggleTreeItem(item: ExportTreeItem, event: Event){
    const checked = (event.target as HTMLInputElement).checked
    const selected = new Set(selectedKeys.value)
    item.articleKeys.forEach(key => checked ? selected.add(key) : selected.delete(key))
    selectedKeys.value = [...selected]
}
function ensureSelection(): boolean { if(selectedArticles.value.length) return true; showQuickInfo("请至少选择一篇文章"); return false }
async function submit(){
    if(!ensureSelection()) return
    if(format.value === "ao3"){
        showPopUp({ name: "AO3 发布代码", vue: shallowRef(ProjectAo3PreviewPopUp), props: { code: ao3Code.value, document: ao3PreviewDocument.value }, mask: true, buttons: [], size: { width: "760px", height: "auto" } })
        return
    }
    if(format.value === "epub"){
        if(!book.title || !book.author){ showQuickInfo("EPUB 需要填写书名和作者"); return }
        try{
            const exported = await exportEpub(book, selectedArticles.value)
            if(exported) showQuickInfo("EPUB 已导出")
        }
        catch(error){
            console.error(error)
            showQuickInfo("EPUB 导出失败")
        }
        return
    }
    if(textMode.value === "single"){
        downloadTextFile(textExportName(book), createTextExport(selectedArticles.value, includeChapterTitles.value, book))
        showQuickInfo("已开始下载纯文本")
        return
    }
    try{
        const path = await exportTextFolder(book, nowAllArticles.chapters, nowAllArticles.articles, selectedKeys.value)
        if(path) showQuickInfo("纯文本文件夹已导出")
    }
    catch(error){
        console.error(error)
        showQuickInfo("纯文本文件夹导出失败")
    }
}
</script>

<style scoped lang="scss">
.projectExport { width: min(720px, calc(100vw - 64px)); display: flex; flex-direction: column; gap: 14px; }
.bookInfo { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 16px; }
.bookInfo label { display: flex; flex-direction: column; gap: 4px; color: $previewText; font-size: .9rem; }
.bookInfo label:nth-child(3), .bookInfo label:nth-child(4), .requiredHint { grid-column: 1 / -1; }
.bookInfo input, .bookInfo textarea, .ao3Preview textarea { box-sizing: border-box; width: 100%; border: 1px solid $inputBorderColor; border-radius: 4px; padding: 7px; background: $bgColor; color: $textColor; font: inherit; }
.bookInfo textarea { min-height: 58px; resize: vertical; }
.requiredHint { margin: 0; color: $previewText; font-size: .85rem; }
.selectionHead { display: flex; align-items: center; justify-content: space-between; }
.selectionHead button { border: 0; background: transparent; color: $previewText; cursor: pointer; font: inherit; }
.selectionHead button:hover { color: $textColor; text-decoration: underline; }
.articleList { max-height: 220px; overflow: auto; border: 1px solid $bgColor85; border-radius: 5px; }
.articleItem { display: flex; gap: 8px; align-items: center; padding-top: 8px; padding-right: 10px; padding-bottom: 8px; cursor: pointer; }
.articleItem + .articleItem { border-top: 1px solid $bgColor90; }
.articleItem.chapter { font-weight: 600; background: $subtleBackgroundColor; }
.chapterToggle, .textMode { display: flex; align-items: center; gap: 12px; color: $previewText; }
.textMode label { display: inline-flex; gap: 5px; align-items: center; }
@media (max-width: 600px) { .projectExport { width: min(100%, calc(100vw - 32px)); } .bookInfo { grid-template-columns: 1fr; } .bookInfo label { grid-column: 1 / -1; } }
</style>
