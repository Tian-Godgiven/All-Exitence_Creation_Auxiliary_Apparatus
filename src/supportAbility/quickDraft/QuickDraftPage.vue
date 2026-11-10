<template>
    <main class="quickDraftPage">
        <header class="toolbar">
            <div class="projectTabs"><button class="projectTab" :class="{ active: showingGlobal }" @click="showGlobalBoard">全部</button><button v-for="project in projectList" :key="project.__key" class="projectTab" :class="{ active: !showingGlobal && project.__key === activeProjectKey }" @click="switchProject(project.__key)">{{ project.name }}</button></div>
        </header>
        <div ref="canvasRef" class="canvas" @pointerdown.capture="startMiddleCanvasPan" @pointerdown="startCanvasPan" @dblclick="createNoteAt" @contextmenu.prevent="openCanvasMenu" @wheel.prevent="zoomCanvas">
            <p v-if="board.notes.length === 0" class="emptyHint">创建第一张便签，开始收集灵感</p>
            <div class="scene" :style="{ transform: `translate(${board.viewport.x}px, ${board.viewport.y}px) scale(${board.viewport.scale})` }">
                <svg class="connections" viewBox="0 0 4000 2400" preserveAspectRatio="none"><line v-for="connection in board.connections" :key="connection.__key" :class="{ cutting: cutConnectionKeys.has(connection.__key) }" :x1="connectionPoint(connection.from).x" :y1="connectionPoint(connection.from).y" :x2="connectionPoint(connection.to).x" :y2="connectionPoint(connection.to).y" @contextmenu.stop.prevent="openConnectionMenu($event, connection)" /><line v-if="relationDrag" class="connectionPreview" :x1="connectionPoint(relationDrag.from.__key).x" :y1="connectionPoint(relationDrag.from.__key).y" :x2="relationDrag.point.x" :y2="relationDrag.point.y" /><line v-if="cutLine" class="cutTrail" :x1="cutLine.from.x" :y1="cutLine.from.y" :x2="cutLine.to.x" :y2="cutLine.to.y" /><rect v-if="selectionBox" class="selectionBox" :x="Math.min(selectionBox.start.x, selectionBox.end.x)" :y="Math.min(selectionBox.start.y, selectionBox.end.y)" :width="Math.abs(selectionBox.end.x - selectionBox.start.x)" :height="Math.abs(selectionBox.end.y - selectionBox.start.y)" /></svg>
                <article v-for="note in board.notes" :key="note.__key" class="note" :class="{ textNode: note.kind === 'text', noteCard: note.kind === 'note', colored: note.kind === 'note' && noteColor(note), connecting: relationDrag?.from === note, cutting: cutNodeKeys.has(note.__key), editing: editingNoteKey === note.__key, selected: selectedNoteKeys.has(note.__key) }" :style="noteStyle(note)" :data-quick-draft-note-key="note.__key" @pointerdown.stop="handleNotePointerDown($event, note)" @dblclick.stop="startEditing(note)" @contextmenu.stop.prevent="openNoteMenu($event, note)">
                    <template v-if="note.kind === 'note'"><span v-if="noteColor(note)" class="noteColorMark" :style="{ background: noteColor(note) }"></span><TextArea v-if="editingNoteKey === note.__key" v-model="note.inner" class="noteContent" mode="all" input-suggestion-list="all" placeholder="记录一个灵感..." @wheel.stop @blur="note.updatedAt = Date.now()" /><TextArea v-else v-model="note.inner" class="noteContent" mode="disabled" placeholder="记录一个灵感..." @wheel.stop /><span class="resizeHandle" @pointerdown.stop="startNoteResize($event, note)"></span></template>
                    <template v-else-if="editingNoteKey === note.__key"><span class="textNodeMeasure" aria-hidden="true">{{ textNodeMeasureText(note.text) }}</span><textarea v-model="note.text" class="textNodeInput" placeholder="..." rows="1" @pointerdown.stop @input="refreshTextNodeSize" @blur="note.updatedAt = Date.now(); editingNoteKey = null"></textarea></template>
                    <span v-else class="textNodeLabel">{{ textNodeMeasureText(note.text) }}</span>
                </article>
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef } from "vue"
import TextArea from "@/components/other/textArea/textArea.vue"
import { showAlert } from "@/hooks/alert"
import { showControlPanel } from "@/hooks/controlPanel"
import { showPopUp } from "@/hooks/pages/popUp"
import { useFreeCanvas } from "@/hooks/inputSupport/useFreeCanvas"
import { nowProjectInfo, nowProjectList } from "@/hooks/project/project"
import { translateToTextContent } from "@/hooks/expression/textAreaContent"
import { createQuickDraftConnection, createQuickDraftNoteOnBoard, createQuickDraftTextOnBoard, loadQuickDraftProjectBoard, moveGlobalQuickDraftNote, nowGlobalQuickDraftBoard, nowQuickDraftBoard, nowQuickDraftColors } from "./quickDraft"
import type { QuickDraftBoard, QuickDraftConnection, QuickDraftNote } from "./quickDraft"
import NoteColorPicker from "./NoteColorPicker.vue"

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
type Point = { x: number, y: number }
const cutLine = ref<{ from: Point, to: Point } | null>(null)
const textNodeSizeVersion = ref(0)
const cutTargets = computed(() => cutLine.value ? getCutTargets(cutLine.value.from, cutLine.value.to) : { nodeKeys: new Set<string>(), connectionKeys: new Set<string>() })
const cutNodeKeys = computed(() => cutTargets.value.nodeKeys)
const cutConnectionKeys = computed(() => cutTargets.value.connectionKeys)
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
function createNoteAt(event: MouseEvent){ freeCanvas.createOnDoubleClick(event, position => { void createTextNodeAt(position) }) }
function openNoteMenu(event: MouseEvent, note: QuickDraftNote){
    if(freeCanvas.consumeContextMenuSuppression() || consumeRelationContextMenuSuppression()) return
    const options: { text: string, danger?: boolean, click: () => void }[] = []
    if(note.kind === "note") options.push({ text: "修改便签颜色", click: () => showNoteColorPicker(note) }, { text: "取消便签标记", click: () => convertToTextNode(note) })
    else options.push({ text: "标记为便签", click: () => convertToNote(note) })
    if(showingGlobal.value) projectList.value.forEach(project => options.push({ text: `移入“${project.name}”`, click: () => moveToProjectBoard(note, project.__key) }))
    options.push({ text: "删除节点", danger: true, click: () => deleteNote(note) })
    showControlPanel({ option: options }, { x: event.clientX, y: event.clientY })
}
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
function startNoteDrag(event: PointerEvent, _note: QuickDraftNote){
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
    relationDrag.value = { from: note, point: initialPoint }
    const onMove = (moveEvent: PointerEvent) => {
        if(moveEvent.pointerId !== event.pointerId) return
        if(relationDrag.value) relationDrag.value.point = canvasPoint(moveEvent)
    }
    const onEnd = (endEvent: PointerEvent) => {
        if(endEvent.pointerId !== event.pointerId) return
        document.removeEventListener("pointermove", onMove)
        document.removeEventListener("pointerup", onEnd)
        document.removeEventListener("pointercancel", onEnd)
        const relation = relationDrag.value
        relationDrag.value = null
        if(!relation || endEvent.type === "pointercancel") return
        const target = (endEvent.target as Element | null)?.closest<HTMLElement>("[data-quick-draft-note-key]")
        const targetKey = target?.dataset.quickDraftNoteKey
        const targetNote = targetKey ? board.value.notes.find(item => item.__key === targetKey) : undefined
        if(targetNote && targetNote !== note) createQuickDraftConnection(board.value, note, targetNote)
        else if(!targetNote){
            const point = canvasPoint(endEvent)
            void createTextNodeAt(point, note)
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
function textNodeMeasureText(text: string){ return text ? (text.endsWith("\n") ? `${text}\u200b` : text) : "..." }
async function createTextNodeAt(point: Point, from?: QuickDraftNote){
    // Use the empty-node estimate first so its initial frame is centered before DOM measurement refines it.
    const created = createQuickDraftTextOnBoard(board.value, { x: point.x - 18, y: point.y - 20 })
    if(from) createQuickDraftConnection(board.value, from, created)
    selectedNoteKeys.value = new Set([created.__key])
    await startEditing(created)
    await refreshTextNodeSize()
    await centerTextNodeAt(created, point)
    await refreshTextNodeSize()
}
async function centerTextNodeAt(note: QuickDraftNote, point: Point){
    await nextTick()
    const size = noteSize(note)
    note.position.x = snap(point.x - size.width / 2)
    note.position.y = snap(point.y - size.height / 2)
}
function startCut(event: PointerEvent){
    event.preventDefault()
    const from = canvasPoint(event)
    cutLine.value = { from, to: from }
    freeCanvas.startPointerDrag(event.pointerId, move => { if(cutLine.value) cutLine.value.to = canvasPoint(move) }, () => {
        const line = cutLine.value
        cutLine.value = null
        if(line) cutByLine(line.from, line.to)
        freeCanvas.markContextMenuSuppressed()
    })
}
function getCutTargets(from: Point, to: Point){
    // Notes are deliberately immune to cutting; only lightweight text nodes are removed this way.
    const nodeKeys = new Set(board.value.notes.filter(note => note.kind === "text" && segmentHitsRect(from, to, note.position, noteSize(note))).map(note => note.__key))
    const connectionKeys = new Set(board.value.connections.filter(connection => {
        if(nodeKeys.has(connection.from) || nodeKeys.has(connection.to)) return true
        const connectionFrom = connectionPoint(connection.from), connectionTo = connectionPoint(connection.to)
        return segmentsIntersect(from, to, connectionFrom, connectionTo)
    }).map(connection => connection.__key))
    return { nodeKeys, connectionKeys }
}
function cutByLine(from: Point, to: Point){
    const { nodeKeys, connectionKeys } = getCutTargets(from, to)
    if(nodeKeys.size) board.value.notes.splice(0, board.value.notes.length, ...board.value.notes.filter(note => !nodeKeys.has(note.__key)))
    if(connectionKeys.size) board.value.connections.splice(0, board.value.connections.length, ...board.value.connections.filter(connection => !connectionKeys.has(connection.__key)))
}
function segmentHitsRect(from: Point, to: Point, position: Point, size: { width: number, height: number }){
    if(pointInRect(from, position, size) || pointInRect(to, position, size)) return true
    const corners = [{ x: position.x, y: position.y }, { x: position.x + size.width, y: position.y }, { x: position.x + size.width, y: position.y + size.height }, { x: position.x, y: position.y + size.height }]
    return corners.some((corner, index) => segmentsIntersect(from, to, corner, corners[(index + 1) % corners.length]))
}
function pointInRect(point: Point, position: Point, size: { width: number, height: number }){ return point.x >= position.x && point.x <= position.x + size.width && point.y >= position.y && point.y <= position.y + size.height }
function segmentsIntersect(firstStart: Point, firstEnd: Point, secondStart: Point, secondEnd: Point){
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
onBeforeUnmount(() => { freeCanvas.dispose(); if(suppressRelationContextMenuTimer) clearTimeout(suppressRelationContextMenuTimer); document.removeEventListener("pointerdown", closeEditingOnOutsidePointerDown, true) })
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
.connections { position: absolute; inset: 0; width: 4000px; height: 2400px; overflow: visible; pointer-events: none; }.connections line { stroke: color-mix(in srgb, $bgColor70 78%, $antiBgColor); stroke-width: 1.5px; pointer-events: stroke; cursor: context-menu; vector-effect: non-scaling-stroke; }.connections line.cutting { stroke: color-mix(in srgb, $dangerColor 68%, transparent); stroke-width: 1.8px; filter: drop-shadow(0 0 3px color-mix(in srgb, $dangerColor 58%, transparent)); }.connections .connectionPreview { stroke: $connectionPreviewColor; stroke-dasharray: 5 4; pointer-events: none; }.connections .cutTrail { fill: none; stroke: $dangerColor; stroke-width: 1.8px; stroke-linecap: round; filter: drop-shadow(0 0 3px color-mix(in srgb, $dangerColor 65%, transparent)); pointer-events: none; vector-effect: non-scaling-stroke; }.connections .selectionBox { fill: $selectionBoxFillColor; stroke: $antiBgColor; stroke-width: 1px; stroke-dasharray: 5 4; pointer-events: none; }
.note { position: absolute; display: flex; flex-direction: column; box-sizing: border-box; border: 1px solid transparent; border-radius: 3px; background: $paperNoteColor; box-shadow: 3px 5px 14px $raisedSurfaceShadow; }.note.noteCard { border-color: transparent; background: $paperNoteColor; }
.note.textNode { display: block; min-height: 40px; padding: 9px 12px; border-color: $bgColor70; border-radius: 8px; background: $bgColor90; box-shadow: 1px 2px 5px $subtleSurfaceShadow; }.textNodeLabel,.textNodeMeasure { display: block; text-align: left; white-space: pre-wrap; }.textNodeMeasure { visibility: hidden; }.textNodeInput { position: absolute; inset: 9px 12px; width: auto; height: auto; padding: 0; border: 0; outline: 0; resize: none; overflow: hidden; background: transparent; color: inherit; font: inherit; text-align: left; }
.noteColorMark { position: absolute; z-index: 3; top: 0; right: 0; left: 0; height: 5px; border-radius: 2px 2px 0 0; pointer-events: none; }
.note.connecting { outline: 2px solid $antiBgColor; outline-offset: -2px; }
.note.selected { outline: 0; border-color: $antiBgColor; }
.note.cutting { outline: 2px solid color-mix(in srgb, $dangerColor 55%, transparent); outline-offset: 2px; }
.note.editing { box-shadow: 0 0 0 2px $antiBgColor, 3px 5px 14px $raisedSurfaceShadow; }
.noteContent { min-height: 0; flex: 1; padding: 8px 10px; box-sizing: border-box; overflow: auto; white-space: pre-wrap; cursor: grab; scrollbar-width: thin; scrollbar-color: $scrollbarColor transparent; }.note.editing .noteContent { cursor: text; }
.noteContent::-webkit-scrollbar, .noteContent :deep(::-webkit-scrollbar) { width: 3px; height: 3px; }.noteContent::-webkit-scrollbar-track, .noteContent :deep(::-webkit-scrollbar-track) { background: transparent; }.noteContent::-webkit-scrollbar-thumb, .noteContent :deep(::-webkit-scrollbar-thumb) { border-radius: 999px; background: $scrollbarColor; }
.noteContent::-webkit-scrollbar-button, .noteContent :deep(::-webkit-scrollbar-button) { display: none; width: 0; height: 0; }
.resizeHandle { position: absolute; z-index: 3; right: 0; bottom: 0; width: 14px; height: 14px; cursor: nwse-resize; touch-action: none; background: linear-gradient(135deg, transparent 39%, $resizeHandleColor 40%, $resizeHandleColor 50%, transparent 51%, transparent 61%, $resizeHandleColor 62%, $resizeHandleColor 72%, transparent 73%); }
.emptyHint { position: absolute; top: 50%; left: 50%; z-index: 1; margin: 0; transform: translate(-50%, -50%); color: $previewText; pointer-events: none; }
@media (max-width: 899px) { .projectTab { padding: 5px 6px; } }
</style>
