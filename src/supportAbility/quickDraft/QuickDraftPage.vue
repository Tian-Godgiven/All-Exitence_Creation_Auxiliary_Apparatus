<template>
    <main class="quickDraftPage">
        <header class="toolbar">
            <div class="projectTabs"><button class="projectTab" :class="{ active: showingGlobal }" @click="showGlobalBoard">全部</button><button v-for="project in projectList" :key="project.__key" class="projectTab" :class="{ active: !showingGlobal && project.__key === activeProjectKey }" @click="switchProject(project.__key)">{{ project.name }}</button></div>
            <Button icon="help" name="使用手册" @click="showManual" />
            <Button icon="setting" name="便签颜色管理" @click="showColorManager" />
        </header>
        <div ref="canvasRef" class="canvas" @pointerdown.capture="startMiddleCanvasPan" @pointerdown="startCanvasPan" @dblclick="createNoteAt" @contextmenu.prevent="openCanvasMenu" @wheel.prevent="zoomCanvas">
            <p v-if="board.notes.length === 0" class="emptyHint">创建第一张便签，开始收集灵感</p>
            <div class="scene" :style="{ transform: `translate(${board.viewport.x}px, ${board.viewport.y}px) scale(${board.viewport.scale})` }">
                <svg class="connections" viewBox="0 0 4000 2400" preserveAspectRatio="none"><line v-for="connection in board.connections" :key="connection.__key" :x1="connectionPoint(connection.from).x" :y1="connectionPoint(connection.from).y" :x2="connectionPoint(connection.to).x" :y2="connectionPoint(connection.to).y" @contextmenu.stop.prevent="openConnectionMenu($event, connection)" /><line v-if="relationDrag" class="connectionPreview" :x1="connectionPoint(relationDrag.from.__key).x" :y1="connectionPoint(relationDrag.from.__key).y" :x2="relationDrag.point.x" :y2="relationDrag.point.y" /><polyline v-if="cutTrail" class="cutTrail" :points="cutTrail.map(point => `${point.x},${point.y}`).join(' ')" /><rect v-if="selectionBox" class="selectionBox" :x="Math.min(selectionBox.start.x, selectionBox.end.x)" :y="Math.min(selectionBox.start.y, selectionBox.end.y)" :width="Math.abs(selectionBox.end.x - selectionBox.start.x)" :height="Math.abs(selectionBox.end.y - selectionBox.start.y)" /></svg>
                <article v-for="note in board.notes" :key="note.__key" class="note" :class="{ textNode: note.kind === 'text', colored: note.kind === 'note' && noteColor(note), connecting: relationDrag?.from === note, editing: editingNoteKey === note.__key, selected: selectedNoteKeys.has(note.__key) }" :style="noteStyle(note)" :data-quick-draft-note-key="note.__key" @pointerdown.stop="handleNotePointerDown($event, note)" @dblclick.stop="startEditing(note)" @contextmenu.stop.prevent="openNoteMenu($event, note)">
                    <template v-if="note.kind === 'note'"><span v-if="noteColor(note)" class="noteColorMark" :style="{ background: noteColor(note) }"></span><TextArea v-if="editingNoteKey === note.__key" v-model="note.inner" class="noteContent" mode="all" input-suggestion-list="all" placeholder="记录一个灵感..." @wheel.stop @blur="note.updatedAt = Date.now()" /><TextArea v-else v-model="note.inner" class="noteContent" mode="disabled" placeholder="记录一个灵感..." @wheel.stop /><span class="resizeHandle" @pointerdown.stop="startNoteResize($event, note)"></span></template>
                    <template v-else-if="editingNoteKey === note.__key"><span class="textNodeMeasure" aria-hidden="true"><template v-if="note.text">{{ note.text }}</template><template v-else>&nbsp;</template></span><input v-model="note.text" class="textNodeInput" placeholder="输入节点内容" @pointerdown.stop @input="refreshTextNodeSize" @blur="note.updatedAt = Date.now(); editingNoteKey = null" /></template>
                    <span v-else class="textNodeLabel">{{ note.text || "未命名节点" }}</span>
                </article>
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef } from "vue"
import Button from "@/components/global/button.vue"
import TextArea from "@/components/other/textArea/textArea.vue"
import { showAlert } from "@/hooks/alert"
import { showControlPanel } from "@/hooks/controlPanel"
import { useFreeCanvas } from "@/hooks/inputSupport/useFreeCanvas"
import { showPopUp } from "@/hooks/pages/popUp"
import { nowProjectInfo, nowProjectList } from "@/hooks/project/project"
import { translateToTextContent } from "@/hooks/expression/textAreaContent"
import { createQuickDraftConnection, createQuickDraftNoteOnBoard, createQuickDraftTextOnBoard, loadQuickDraftProjectBoard, moveGlobalQuickDraftNote, nowGlobalQuickDraftBoard, nowQuickDraftBoard, nowQuickDraftColors } from "./quickDraft"
import type { QuickDraftBoard, QuickDraftConnection, QuickDraftNote } from "./quickDraft"
import ColorManager from "./ColorManager.vue"
import NoteColorPicker from "./NoteColorPicker.vue"
import QuickDraftManual from "./QuickDraftManual.vue"

const showingGlobal = ref(!nowProjectInfo.__key)
const activeProjectKey = ref(nowProjectInfo.__key)
const activeProjectBoard = ref<QuickDraftBoard>(nowQuickDraftBoard)
const board = computed<QuickDraftBoard>(() => showingGlobal.value ? nowGlobalQuickDraftBoard : activeProjectBoard.value)
const projectList = nowProjectList
const canvasRef = ref<HTMLElement>()
const freeCanvas = useFreeCanvas(canvasRef, () => board.value.viewport)
const editingNoteKey = ref<string | null>(null)
const selectedNoteKeys = ref(new Set<string>())
const selectionBox = ref<{ start: { x: number, y: number }, end: { x: number, y: number } } | null>(null)
const relationDrag = ref<{ from: QuickDraftNote, point: { x: number, y: number } } | null>(null)
const cutTrail = ref<{ x: number, y: number }[] | null>(null)
const textNodeSizeVersion = ref(0)
let relationTimer: ReturnType<typeof setTimeout> | null = null
let suppressRelationContextMenu = false
let suppressRelationContextMenuTimer: ReturnType<typeof setTimeout> | null = null
function addNote(target: QuickDraftBoard, position: { x: number, y: number }){
    createQuickDraftNoteOnBoard(target, [""], position)
}
function addTextNode(target: QuickDraftBoard, position: { x: number, y: number }){ return createQuickDraftTextOnBoard(target, position) }
function deleteNote(note: QuickDraftNote){ showAlert({ info: "删除这张便签？", confirm: () => deleteNoteFromBoard(note) }) }
function deleteNoteFromBoard(note: QuickDraftNote){
    const target = board.value
    target.notes.splice(target.notes.indexOf(note), 1)
    target.connections = target.connections.filter(connection => connection.from !== note.__key && connection.to !== note.__key)
}
function showGlobalBoard(){ showingGlobal.value = true; relationDrag.value = null }
async function switchProject(key: string){
    activeProjectKey.value = key
    activeProjectBoard.value = await loadQuickDraftProjectBoard(key)
    showingGlobal.value = false
    relationDrag.value = null
}
function openCanvasMenu(event: MouseEvent){
    if(freeCanvas.consumeContextMenuSuppression() || consumeRelationContextMenuSuppression()) return
    const position = freeCanvas.canvasPoint(event)
    showControlPanel({ option: [{ text: "创建普通节点", click: () => { const note = addTextNode(board.value, position); void startEditing(note) } }, { text: "创建便签", click: () => addNote(board.value, position) }] }, { x: event.clientX, y: event.clientY })
}
function createNoteAt(event: MouseEvent){ freeCanvas.createOnDoubleClick(event, position => { const note = addTextNode(board.value, position); void startEditing(note) }) }
function openNoteMenu(event: MouseEvent, note: QuickDraftNote){
    if(freeCanvas.consumeContextMenuSuppression() || consumeRelationContextMenuSuppression()) return
    const options: { text: string, danger?: boolean, click: () => void }[] = []
    if(note.kind === "note") options.push({ text: "修改便签颜色", click: () => showNoteColorPicker(note) }, { text: "取消便签标记", click: () => convertToTextNode(note) })
    else options.push({ text: "标记为便签", click: () => convertToNote(note) })
    if(showingGlobal.value) projectList.value.forEach(project => options.push({ text: `移入“${project.name}”`, click: () => moveToProjectBoard(note, project.__key) }))
    options.push({ text: "删除节点", danger: true, click: () => deleteNote(note) })
    showControlPanel({ option: options }, { x: event.clientX, y: event.clientY })
}
function showColorManager(){ showPopUp({ name: "颜色管理", vue: shallowRef(ColorManager), mask: true }) }
function showManual(){ showPopUp({ name: "便签夹使用手册", vue: shallowRef(QuickDraftManual), mask: true, size: { width: "500px", height: "auto" } }) }
function showNoteColorPicker(note: QuickDraftNote){ showPopUp({ name: "修改便签颜色", vue: shallowRef(NoteColorPicker), mask: true, props: { note } }) }
function noteColor(note: QuickDraftNote){ return nowQuickDraftColors.find(color => color.__key === note.colorKey)?.value }
function openConnectionMenu(event: MouseEvent, connection: QuickDraftConnection){
    if(freeCanvas.consumeContextMenuSuppression() || consumeRelationContextMenuSuppression()) return
    showControlPanel({ option: [{ text: "删除关联", danger: true, click: () => { board.value.connections.splice(board.value.connections.indexOf(connection), 1) } }] }, { x: event.clientX, y: event.clientY })
}
function consumeRelationContextMenuSuppression(){
    if(!suppressRelationContextMenu) return false
    suppressRelationContextMenu = false
    if(suppressRelationContextMenuTimer) clearTimeout(suppressRelationContextMenuTimer)
    suppressRelationContextMenuTimer = null
    return true
}
function moveToProjectBoard(note: QuickDraftNote, projectKey: string){
    const { relatedConnections, move } = moveGlobalQuickDraftNote(note, projectKey)
    if(relatedConnections.length){
        showAlert({ info: "移入项目会移除这张便签在总灵感中的关联，确定继续吗？", confirm: () => { void move() } })
        return
    }
    void move()
}
function connectionPoint(key: string){
    const note = board.value.notes.find(item => item.__key === key)
    const size = note ? noteSize(note) : { width: 0, height: 0 }
    return note ? { x: note.position.x + size.width / 2, y: note.position.y + size.height / 2 } : { x: 0, y: 0 }
}
function handleNotePointerDown(event: PointerEvent, note: QuickDraftNote){
    if(event.altKey && event.button === 2){ startCut(event); return }
    if(event.button === 2){ startNoteRelation(event, note); return }
    if(event.button !== 0) return
    const target = event.target
    if(editingNoteKey.value === note.__key && target instanceof Element && target.closest(".textArea")) return
    if(!selectedNoteKeys.value.has(note.__key)) selectedNoteKeys.value = new Set([note.__key])
    startNoteDrag(event, note)
}
async function startEditing(note: QuickDraftNote){
    editingNoteKey.value = note.__key
    await nextTick()
    document.querySelector<HTMLElement>(`[data-quick-draft-note-key="${note.__key}"] ${note.kind === "note" ? ".textArea" : ".textNodeInput"}`)?.focus()
}
function closeEditingOnOutsidePointerDown(event: PointerEvent){
    if(!editingNoteKey.value || !(event.target instanceof Element)) return
    if(event.target.closest(`[data-quick-draft-note-key="${editingNoteKey.value}"]`)) return
    editingNoteKey.value = null
}
function startNoteDrag(event: PointerEvent, note: QuickDraftNote){
    if(event.button !== 0) return
    const movingNotes = board.value.notes.filter(item => selectedNoteKeys.value.has(item.__key))
    const start = { x: event.clientX, y: event.clientY, positions: new Map(movingNotes.map(item => [item.__key, { ...item.position }])) }
    startDragging(event.pointerId, (moveEvent) => {
        const delta = { x: (moveEvent.clientX - start.x) / board.value.viewport.scale, y: (moveEvent.clientY - start.y) / board.value.viewport.scale }
        movingNotes.forEach(item => {
            const position = start.positions.get(item.__key)!
            item.position.x = snap(position.x + delta.x)
            item.position.y = snap(position.y + delta.y)
        })
    })
}
function startNoteRelation(event: PointerEvent, note: QuickDraftNote){
    if(event.button !== 2 || !canvasRef.value) return
    const initialPoint = canvasPoint(event)
    relationTimer = setTimeout(() => {
        relationTimer = null
        relationDrag.value = { from: note, point: initialPoint }
    }, 250)
    const onMove = (moveEvent: PointerEvent) => {
        if(moveEvent.pointerId !== event.pointerId) return
        if(relationDrag.value) relationDrag.value.point = canvasPoint(moveEvent)
    }
    const onEnd = (endEvent: PointerEvent) => {
        if(endEvent.pointerId !== event.pointerId) return
        document.removeEventListener("pointermove", onMove)
        document.removeEventListener("pointerup", onEnd)
        document.removeEventListener("pointercancel", onEnd)
        if(relationTimer){ clearTimeout(relationTimer); relationTimer = null }
        const relation = relationDrag.value
        relationDrag.value = null
        if(!relation || endEvent.type === "pointercancel") return
        const target = (endEvent.target as Element | null)?.closest<HTMLElement>("[data-quick-draft-note-key]")
        const targetKey = target?.dataset.quickDraftNoteKey
        const targetNote = targetKey ? board.value.notes.find(item => item.__key === targetKey) : undefined
        if(targetNote && targetNote !== note) createQuickDraftConnection(board.value, note, targetNote)
        else if(!targetNote){
            const created = createQuickDraftTextOnBoard(board.value, canvasPoint(endEvent))
            createQuickDraftConnection(board.value, note, created)
        }
        suppressRelationContextMenu = true
        if(suppressRelationContextMenuTimer) clearTimeout(suppressRelationContextMenuTimer)
        suppressRelationContextMenuTimer = setTimeout(() => { suppressRelationContextMenu = false; suppressRelationContextMenuTimer = null }, 700)
    }
    document.addEventListener("pointermove", onMove)
    document.addEventListener("pointerup", onEnd)
    document.addEventListener("pointercancel", onEnd)
}
function canvasPoint(event: PointerEvent){
    return freeCanvas.canvasPoint(event)
}
function startNoteResize(event: PointerEvent, note: QuickDraftNote){
    if(event.button !== 0) return
    const start = { x: event.clientX, y: event.clientY, size: { ...note.size } }
    startDragging(event.pointerId, (moveEvent) => {
        note.size.width = Math.max(120, Math.min(600, snap(start.size.width + (moveEvent.clientX - start.x) / board.value.viewport.scale)))
        note.size.height = Math.max(80, Math.min(600, snap(start.size.height + (moveEvent.clientY - start.y) / board.value.viewport.scale)))
    })
}
function convertToNote(note: QuickDraftNote){
    note.inner = [note.text]
    note.kind = "note"
    note.colorKey = nowQuickDraftColors[0]?.__key ?? null
    note.size = { width: 240, height: 150 }
    note.updatedAt = Date.now()
}
function convertToTextNode(note: QuickDraftNote){
    note.text = translateToTextContent(note.inner, true)
    note.kind = "text"
    note.colorKey = null
    note.updatedAt = Date.now()
    void refreshTextNodeSize()
}
function noteSize(note: QuickDraftNote){
    if(note.kind === "note") return note.size
    void textNodeSizeVersion.value
    const element = document.querySelector<HTMLElement>(`[data-quick-draft-note-key="${note.__key}"]`)
    return element ? { width: element.offsetWidth, height: element.offsetHeight } : { width: 0, height: 0 }
}
function noteStyle(note: QuickDraftNote){ return note.kind === "note" ? { transform: `translate(${note.position.x}px, ${note.position.y}px)`, width: `${note.size.width}px`, height: `${note.size.height}px` } : { transform: `translate(${note.position.x}px, ${note.position.y}px)` } }
async function refreshTextNodeSize(){ await nextTick(); textNodeSizeVersion.value += 1 }
function startCut(event: PointerEvent){
    event.preventDefault()
    cutTrail.value = [canvasPoint(event)]
    freeCanvas.startPointerDrag(event.pointerId, move => cutTrail.value?.push(canvasPoint(move)), () => {
        const trail = cutTrail.value ?? []
        cutTrail.value = null
        if(trail.length > 1) cutByTrail(trail)
        freeCanvas.markContextMenuSuppressed()
    })
}
function cutByTrail(trail: { x: number, y: number }[]){
    const removed = new Set(board.value.notes.filter(note => trailHitsRect(trail, note.position, noteSize(note))).map(note => note.__key))
    const cutConnections = board.value.connections.filter(connection => {
        if(removed.has(connection.from) || removed.has(connection.to)) return true
        const from = connectionPoint(connection.from), to = connectionPoint(connection.to)
        return trail.some((point, index) => index > 0 && segmentsIntersect(trail[index - 1], point, from, to))
    })
    if(removed.size) board.value.notes.splice(0, board.value.notes.length, ...board.value.notes.filter(note => !removed.has(note.__key)))
    if(cutConnections.length) board.value.connections.splice(0, board.value.connections.length, ...board.value.connections.filter(connection => !cutConnections.includes(connection)))
}
function trailHitsRect(trail: { x: number, y: number }[], position: { x: number, y: number }, size: { width: number, height: number }){
    return trail.some((point, index) => index > 0 && segmentHitsRect(trail[index - 1], point, position, size))
}
function segmentHitsRect(from: { x: number, y: number }, to: { x: number, y: number }, position: { x: number, y: number }, size: { width: number, height: number }){
    if(from.x >= position.x && from.x <= position.x + size.width && from.y >= position.y && from.y <= position.y + size.height) return true
    const corners = [{ x: position.x, y: position.y }, { x: position.x + size.width, y: position.y }, { x: position.x + size.width, y: position.y + size.height }, { x: position.x, y: position.y + size.height }]
    return corners.some((corner, index) => segmentsIntersect(from, to, corner, corners[(index + 1) % corners.length]))
}
function segmentsIntersect(firstStart: { x: number, y: number }, firstEnd: { x: number, y: number }, secondStart: { x: number, y: number }, secondEnd: { x: number, y: number }){
    const cross = (origin: typeof firstStart, target: typeof firstStart, point: typeof firstStart) => (target.x - origin.x) * (point.y - origin.y) - (target.y - origin.y) * (point.x - origin.x)
    const first = cross(firstStart, firstEnd, secondStart), second = cross(firstStart, firstEnd, secondEnd), third = cross(secondStart, secondEnd, firstStart), fourth = cross(secondStart, secondEnd, firstEnd)
    return (first === 0 || second === 0 || Math.sign(first) !== Math.sign(second)) && (third === 0 || fourth === 0 || Math.sign(third) !== Math.sign(fourth))
}
function startCanvasPan(event: PointerEvent){
    if(event.altKey && event.button === 2){ startCut(event); return }
    if(event.button === 0){ startLasso(event); return }
    freeCanvas.startCanvasPan(event)
}
function startLasso(event: PointerEvent){
    const firstPoint = canvasPoint(event)
    selectionBox.value = { start: firstPoint, end: firstPoint }
    const onMove = (moveEvent: PointerEvent) => {
        if(moveEvent.pointerId !== event.pointerId) return
        if(selectionBox.value) selectionBox.value.end = canvasPoint(moveEvent)
    }
    const onEnd = (endEvent: PointerEvent) => {
        if(endEvent.pointerId !== event.pointerId) return
        document.removeEventListener("pointermove", onMove)
        document.removeEventListener("pointerup", onEnd)
        document.removeEventListener("pointercancel", onEnd)
        const box = selectionBox.value
        if(endEvent.type !== "pointercancel" && box && Math.abs(box.end.x - box.start.x) > 3 && Math.abs(box.end.y - box.start.y) > 3){
            selectedNoteKeys.value = new Set(board.value.notes.filter(note => pointInBox(connectionPoint(note.__key), box)).map(note => note.__key))
        } else selectedNoteKeys.value = new Set()
        selectionBox.value = null
    }
    document.addEventListener("pointermove", onMove)
    document.addEventListener("pointerup", onEnd)
    document.addEventListener("pointercancel", onEnd)
}
function pointInBox(point: { x: number, y: number }, box: { start: { x: number, y: number }, end: { x: number, y: number } }){
    return point.x >= Math.min(box.start.x, box.end.x) && point.x <= Math.max(box.start.x, box.end.x) && point.y >= Math.min(box.start.y, box.end.y) && point.y <= Math.max(box.start.y, box.end.y)
}
function startMiddleCanvasPan(event: PointerEvent){
    if(event.button !== 1) return
    event.preventDefault()
    event.stopPropagation()
    startCanvasPan(event)
}
function zoomCanvas(event: WheelEvent){
    freeCanvas.zoomCanvas(event)
}
function snap(value: number){ return Math.round(value * 100) / 100 }
function startDragging(pointerId: number, move: (event: PointerEvent) => void, afterDrag?: () => void){
    freeCanvas.startPointerDrag(pointerId, move, afterDrag)
}
onMounted(() => { document.addEventListener("pointerdown", closeEditingOnOutsidePointerDown, true); void refreshTextNodeSize() })
onBeforeUnmount(() => { freeCanvas.dispose(); if(relationTimer) clearTimeout(relationTimer); if(suppressRelationContextMenuTimer) clearTimeout(suppressRelationContextMenuTimer); document.removeEventListener("pointerdown", closeEditingOnOutsidePointerDown, true) })
</script>

<style scoped lang="scss">
.quickDraftPage { display: flex; height: 100%; flex-direction: column; background: $bgColor; }
.toolbar { display: flex; height: 44px; min-height: 44px; align-items: center; gap: 8px; padding: 0 12px; border-bottom: 1px solid $bgColor70; font-weight: 600; }
.projectTabs { display: flex; min-width: 0; flex: 1; gap: 2px; overflow-x: auto; }
.projectTab { flex: 0 0 auto; padding: 5px 9px; border: 0; background: transparent; color: $previewText; font: inherit; font-size: calc(1rem + 2px); line-height: 1; }
.projectTab.active { color: $antiBgColor; font-weight: 600; }
.toolbar .button { width: 32px; height: 32px; padding: 7px; }
.canvas { position: relative; flex: 1; overflow: hidden; background: $paperCanvasColor; touch-action: none; }
.scene { position: absolute; width: 4000px; height: 2400px; transform-origin: 0 0; }
.connections { position: absolute; inset: 0; width: 4000px; height: 2400px; overflow: visible; pointer-events: none; }.connections line { stroke: $canvasConnectionColor; stroke-width: 1.5px; pointer-events: stroke; cursor: context-menu; vector-effect: non-scaling-stroke; }.connections .connectionPreview { stroke: $connectionPreviewColor; stroke-dasharray: 5 4; pointer-events: none; }.connections .cutTrail { fill: none; stroke: $dangerColor; stroke-width: 3px; stroke-linecap: round; stroke-linejoin: round; pointer-events: none; vector-effect: non-scaling-stroke; }.connections .selectionBox { fill: $selectionBoxFillColor; stroke: $antiBgColor; stroke-width: 1px; stroke-dasharray: 4 3; pointer-events: none; }
.note { position: absolute; display: flex; flex-direction: column; box-sizing: border-box; border: 1px solid transparent; border-radius: 3px; background: $paperNoteColor; box-shadow: 3px 5px 14px $raisedSurfaceShadow; }
.note.textNode { display: block; min-height: 40px; padding: 9px 12px; border-color: $bgColor70; border-radius: 8px; background: $bgColor90; box-shadow: 1px 2px 5px $subtleSurfaceShadow; }.textNodeLabel,.textNodeMeasure { display: block; text-align: left; white-space: pre; }.textNodeMeasure { visibility: hidden; }.textNodeInput { position: absolute; inset: 9px 12px; width: auto; padding: 0; border: 0; outline: 0; background: transparent; color: inherit; font: inherit; text-align: left; }
.noteColorMark { position: absolute; z-index: 1; top: 0; right: 0; left: 0; height: 5px; pointer-events: none; }
.note.connecting { outline: 2px solid $antiBgColor; outline-offset: -2px; }
.note.selected { outline: 0; border-color: $antiBgColor; }
.note.editing { box-shadow: 0 0 0 2px $antiBgColor, 3px 5px 14px $raisedSurfaceShadow; }
.noteContent { min-height: 0; flex: 1; padding: 8px 10px; box-sizing: border-box; overflow: auto; white-space: pre-wrap; cursor: grab; scrollbar-width: thin; scrollbar-color: $scrollbarColor transparent; }.note.editing .noteContent { cursor: text; }
.noteContent::-webkit-scrollbar, .noteContent :deep(::-webkit-scrollbar) { width: 3px; height: 3px; }.noteContent::-webkit-scrollbar-track, .noteContent :deep(::-webkit-scrollbar-track) { background: transparent; }.noteContent::-webkit-scrollbar-thumb, .noteContent :deep(::-webkit-scrollbar-thumb) { border-radius: 999px; background: $scrollbarColor; }
.noteContent::-webkit-scrollbar-button, .noteContent :deep(::-webkit-scrollbar-button) { display: none; width: 0; height: 0; }
.resizeHandle { position: absolute; z-index: 3; right: 0; bottom: 0; width: 14px; height: 14px; cursor: nwse-resize; touch-action: none; background: linear-gradient(135deg, transparent 39%, $resizeHandleColor 40%, $resizeHandleColor 50%, transparent 51%, transparent 61%, $resizeHandleColor 62%, $resizeHandleColor 72%, transparent 73%); }
.emptyHint { position: absolute; top: 50%; left: 50%; z-index: 1; margin: 0; transform: translate(-50%, -50%); color: $previewText; pointer-events: none; }
@media (max-width: 899px) { .projectTab { padding: 5px 6px; } }
</style>
