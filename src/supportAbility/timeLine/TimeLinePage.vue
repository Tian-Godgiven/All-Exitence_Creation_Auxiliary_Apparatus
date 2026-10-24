<template>
    <div class="timeLinePage">
        <aside class="sideBar">
            <div class="sideBarTop"><span>时间线</span><Button icon="add" name="新建时间线" @click="createTimeLine" /></div>
            <button v-for="item in timeLines" :key="item.__key" class="timeLineItem" :class="{ active: item === selected }" @click="selectTimeLine(item)">{{ item.name }}</button>

            <div v-if="selectedNode" class="editor">
                <label>事件名称<input v-model="selectedNode.node.label"></label>
                <label>关联对象<select :value="selectedNode.node.target?.type ?? 'event'" @change="changeTargetType($event)"><option value="event">自由事件</option><option value="chapter">章节</option><option value="article">文章</option></select></label>
                <label v-if="selectedNode.node.target">选择对象<select :value="selectedNode.node.target.key" @change="changeTarget($event)"><option value="">请选择</option><option v-for="target in selectableTargets" :key="target.key" :value="target.key">{{ target.label }}</option></select></label>
                <label>开始时间<input v-model.number="selectedNode.node.start" type="number" min="0"></label>
                <label>结束时间<input v-model.number="selectedNode.node.end" type="number" :min="selectedNode.node.start"></label>
                <Button icon="delete" name="删除事件" @click="deleteNode" />
            </div>
        </aside>

        <main v-if="selected" class="workspace">
            <div class="toolBar"><input v-model="selected.name" aria-label="时间线名称"><Button icon="addContainer" name="新建时间片段" @click="createSegment" /><Button icon="add" :disabled="!selectedSegment" :name="connectionStart ? '取消连接' : '连接片段'" @click="startConnection" /><Button icon="backMain" name="复位画布" @click="resetCanvas" /><Button icon="delete" name="删除片段" :disabled="!selectedSegment" @click="deleteSegment" /><Button icon="delete" name="删除时间线" @click="deleteTimeLine" /></div>
            <div class="workArea">
            <div ref="canvasRef" class="canvas" @pointerdown="startCanvasPan" @contextmenu.prevent @wheel.prevent="zoomCanvas">
                <div class="scene" :style="{ transform: `translate(${canvasViewport.x}px, ${canvasViewport.y}px) scale(${canvasViewport.scale})` }">
                    <svg class="connections" viewBox="0 0 4000 2400" preserveAspectRatio="none"><g v-for="connection in selected.connections" :key="connection.__key"><path class="connectionLine" :d="connectionPath(connection)" /><path class="connectionHitArea" :d="connectionPath(connection)" @contextmenu.stop.prevent="openConnectionMenu($event, connection)" /><text :x="connectionLabelPoint(connection).x" :y="connectionLabelPoint(connection).y" @click.stop="editConnection(connection)" @contextmenu.stop.prevent="openConnectionMenu($event, connection)">{{ connectionLabel(connection) }}</text></g></svg>
                    <section v-for="segment in selected.segments" :key="segment.__key" class="segment" :class="{ connecting: connectionStart === segment, active: selectedSegment === segment }" :style="{ transform: `translate(${segment.position.x}px, ${segment.position.y}px)` }" @pointerdown="startSegmentDrag($event, segment)" @click="selectSegment(segment, true)" @contextmenu.stop.prevent="openSegmentMenu($event, segment)">
                        <header v-if="titleSegment === segment"><span>{{ segment.name }} · {{ segment.length }} {{ segment.unit }}</span></header>
                        <div class="track" :style="{ width: `${segment.length * segment.unitWidth}px`, '--unit-width': `${segment.unitWidth}px` }">
                            <div class="rulerLine"></div>
                            <span v-for="unit in segment.length + 1" :key="unit - 1" class="tick" :class="{ major: (unit - 1) % 5 === 0 }" :style="{ left: `${(unit - 1) * segment.unitWidth}px` }"><span v-if="(unit - 1) % 5 === 0" class="tickValue">{{ unit - 1 }}</span></span>
                            <button v-for="node in segment.nodes" :key="node.__key" class="node" :class="{ selected: selectedNode?.node === node, range: node.end != null && node.end > node.start }" :style="nodeStyle(segment, node)" @pointerdown.stop="startNodeDrag($event, segment, node)" @click.stop="selectNode(segment, node)"><span v-if="isRange(node)" class="rangeHandle start" @pointerdown.stop="resizeNodeRange($event, segment, node, 'start')"></span>{{ node.label }}<span v-if="isRange(node)" class="rangeHandle end" @pointerdown.stop="resizeNodeRange($event, segment, node, 'end')"></span></button>
                            <span v-for="node in segment.nodes" :key="`${node.__key}-anchor`" class="nodeAnchor" :style="nodeAnchorStyle(segment, node)"></span>
                            <Button class="expandButton start" icon="add" name="向前扩张 50 单位" @click="expand(segment, 'start')" />
                            <Button class="expandButton end" icon="add" name="向后扩张 50 单位" @click="expand(segment, 'end')" />
                        </div>
                        <Button class="addNode" icon="add" name="新建事件" @click="createNode(segment)" />
                    </section>
                </div>
            </div>
            <aside class="segmentList">
                <div class="segmentListHeader">时间片段 <Button icon="add" name="新建片段" @click="createSegment" /></div>
                <div v-for="segment in selected.segments" :key="segment.__key" class="segmentListItem" :class="{ active: selectedSegment === segment }">
                    <button class="segmentSelect" @click="focusSegment(segment)">
                        <span>{{ segment.name }}</span>
                        <small>{{ segment.length }} {{ segment.unit }}</small>
                    </button>
                    <Button icon="edit" name="编辑片段" @click="editSegment(segment)" />
                </div>
            </aside>
            </div>
        </main>
        <main v-else class="empty"><Button icon="add" name="新建时间线" @click="createTimeLine" /></main>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, ref, watch } from "vue"
import Button from "@/components/global/button.vue"
import { nowAllArticles } from "@/hooks/all-articles/allArticles"
import { showAlert } from "@/hooks/alert"
import { showPopUp } from "@/hooks/pages/popUp"
import { showControlPanel } from "@/hooks/controlPanel"
import { shallowRef } from "vue"
import SegmentEditor from "./SegmentEditor.vue"
import NodeEditor from "./NodeEditor.vue"
import ConnectionEditor from "./ConnectionEditor.vue"
import { createStoryTimeLine, createTimeLineConnection, createTimeLineNode, createTimeLineSegment, deleteStoryTimeLine, deleteTimeLineSegment, expandSegment, nowStoryTimeLines } from "./timeLine"
import type { StoryTimeLine, TimeLineConnection, TimeLineNode, TimeLineSegment } from "./timeLine"

const timeLines = nowStoryTimeLines
const selected = ref<StoryTimeLine | null>(timeLines[0] ?? null)
const canvasRef = ref<HTMLElement>()
const selectedSegment = ref<TimeLineSegment | null>(null)
const selectedNode = ref<{ segment: TimeLineSegment, node: TimeLineNode } | null>(null)
const titleSegment = ref<TimeLineSegment | null>(null)
const connectionStart = ref<TimeLineSegment | null>(null)
const canvasViewport = reactive({ x: 0, y: 0, scale: 1 })
const touchPointers = new Map<number, { x: number, y: number }>()
let stopDragging: (() => void) | null = null
let touchStart: { points: { x: number, y: number }[], viewport: { x: number, y: number, scale: number } } | null = null

type TargetOption = { type: "chapter" | "article", key: string, label: string }
const articleTargets = computed<TargetOption[]>(() => {
    const targets: TargetOption[] = []
    const collect = (parent: typeof nowAllArticles, path: string[]) => {
        parent.chapters.forEach((chapter) => {
            const label = [...path, chapter.name || "未命名章节"].join(" / ")
            targets.push({ type: "chapter", key: chapter.__key, label })
            collect(chapter, [...path, chapter.name || "未命名章节"])
        })
        parent.articles.forEach((article) => targets.push({ type: "article", key: article.__key, label: [...path, article.title || "未命名文章"].join(" / ") }))
    }
    collect(nowAllArticles, [])
    return targets
})
const selectableTargets = computed(() => articleTargets.value.filter((target) => target.type === selectedNode.value?.node.target?.type))
watch(selected, (timeLine) => {
    if(timeLine) Object.assign(canvasViewport, timeLine.viewport)
}, { immediate: true })
watch(canvasViewport, (viewport) => {
    if(selected.value) Object.assign(selected.value.viewport, viewport)
})

function createTimeLine(){ selected.value = createStoryTimeLine() }
function selectTimeLine(timeLine: StoryTimeLine){
    selected.value = timeLine
    selectedSegment.value = null
    selectedNode.value = null
    connectionStart.value = null
    titleSegment.value = null
}
function createSegment(){
    if(!selected.value) return
    showPopUp({
        name: "新建时间片段",
        vue: shallowRef(SegmentEditor),
        mask: true,
        props: { segment: {} },
        returnValue: (setting) => {
            if(!selected.value) return
            selectedSegment.value = createTimeLineSegment(selected.value, setting)
        },
    })
}
function editSegment(segment: TimeLineSegment){
    showPopUp({
        name: "编辑时间片段",
        vue: shallowRef(SegmentEditor),
        mask: true,
        props: { segment: { ...segment } },
        returnValue: (setting) => Object.assign(segment, setting),
    })
}
function createNode(segment: TimeLineSegment){ selectSegment(segment); createTimeLineNode(segment) }
function openSegmentMenu(event: MouseEvent, segment: TimeLineSegment){
    selectedSegment.value = segment
    selectedNode.value = null
    const options = [
        { text: "创建事件", click: () => createNodeAt(event, segment) },
        { text: "创建关系", click: () => beginConnection(segment) },
    ]
    showControlPanel({ option: options }, { x: event.clientX, y: event.clientY })
}
function createNodeAt(event: MouseEvent, segment: TimeLineSegment){
    const segmentElement = (event.target as HTMLElement).closest<HTMLElement>(".segment")
    const track = (event.target as HTMLElement).closest<HTMLElement>(".track") ?? segmentElement?.querySelector<HTMLElement>(".track")
    if(!track) return
    const rect = track.getBoundingClientRect()
    const start = Math.max(0, Math.min(segment.length, Math.round((event.clientX - rect.left) / canvasViewport.scale / segment.unitWidth)))
    const offsetY = Math.max(0, Math.min(78, (event.clientY - rect.top) / canvasViewport.scale - 17))
    showPopUp({
        name: "创建时间线事件",
        vue: shallowRef(NodeEditor),
        mask: true,
        props: { start, offsetY },
        returnValue: (setting) => {
            const node = createTimeLineNode(segment, setting)
            selectNode(segment, node)
        },
    })
}
function beginConnection(segment: TimeLineSegment){
    connectionStart.value = connectionStart.value === segment ? null : segment
    selectedSegment.value = segment
    selectedNode.value = null
}
function createConnection(from: TimeLineSegment, to: TimeLineSegment){
    const timeLine = selected.value
    if(!timeLine) return
    showPopUp({
        name: "创建片段关系",
        vue: shallowRef(ConnectionEditor),
        mask: true,
        returnValue: (setting) => {
            createTimeLineConnection(timeLine, from, to, setting)
        },
    })
}
function editConnection(connection: TimeLineConnection){
    showPopUp({
        name: "编辑片段关系",
        vue: shallowRef(ConnectionEditor),
        mask: true,
        props: { connection },
        returnValue: (setting) => Object.assign(connection, setting),
    })
}
function openConnectionMenu(event: MouseEvent, connection: TimeLineConnection){
    showControlPanel({ option: [
        { text: "编辑关系", click: () => editConnection(connection) },
        { text: "删除关系", click: () => deleteConnection(connection) },
    ] }, { x: event.clientX, y: event.clientY })
}
function expand(segment: TimeLineSegment, direction: "start" | "end"){
    expandSegment(segment, direction)
}
function deleteSegment(){
    if(!selected.value || !selectedSegment.value) return
    showAlert({ info: `删除时间片段“${selectedSegment.value.name}”？`, confirm: () => {
        deleteTimeLineSegment(selected.value!, selectedSegment.value!)
        selectedSegment.value = null; selectedNode.value = null; connectionStart.value = null
        titleSegment.value = null
    }})
}
function deleteTimeLine(){
    if(!selected.value) return
    showAlert({ info: `删除时间线“${selected.value.name}”？`, confirm: () => {
        const index = timeLines.indexOf(selected.value!)
        deleteStoryTimeLine(selected.value!)
        selected.value = timeLines[index] ?? timeLines[index - 1] ?? null
        selectedSegment.value = null; selectedNode.value = null; connectionStart.value = null
        titleSegment.value = null
    }})
}
function selectSegment(segment: TimeLineSegment, showTitle = false){
    if(connectionStart.value && connectionStart.value !== segment && selected.value){
        const from = connectionStart.value
        connectionStart.value = null
        createConnection(from, segment)
    }
    selectedSegment.value = segment
    selectedNode.value = null
    if(showTitle) titleSegment.value = segment
}
function focusSegment(segment: TimeLineSegment){
    selectedSegment.value = segment
    selectedNode.value = null
    titleSegment.value = segment
    if(!canvasRef.value) return
    const rect = canvasRef.value.getBoundingClientRect()
    canvasViewport.x = rect.width * 0.25 - (segment.position.x + 16) * canvasViewport.scale
    canvasViewport.y = rect.height / 2 - (segment.position.y + 56) * canvasViewport.scale
}
function selectNode(segment: TimeLineSegment, node: TimeLineNode){
    selectedSegment.value = segment
    selectedNode.value = { segment, node }
}
function startConnection(){ if(selectedSegment.value) beginConnection(selectedSegment.value) }
function startSegmentDrag(event: PointerEvent, segment: TimeLineSegment){
    if(event.button !== 0 || (event.target as HTMLElement).closest("input, .button, .node, .rangeHandle")) return
    event.stopPropagation()
    const start = { x: event.clientX, y: event.clientY, position: { ...segment.position } }
    startDragging(event.pointerId, (moveEvent) => {
        segment.position.x = start.position.x + (moveEvent.clientX - start.x) / canvasViewport.scale
        segment.position.y = start.position.y + (moveEvent.clientY - start.y) / canvasViewport.scale
    })
}
function startNodeDrag(event: PointerEvent, segment: TimeLineSegment, node: TimeLineNode){
    selectNode(segment, node)
    const track = (event.currentTarget as HTMLElement).closest(".track")
    if(!track) return
    const start = {
        x: event.clientX,
        y: event.clientY,
        time: node.start,
        offsetY: node.offsetY,
    }
    startDragging(event.pointerId, (moveEvent) => {
        const horizontalDelta = (moveEvent.clientX - start.x) / canvasViewport.scale / segment.unitWidth
        node.start = Math.max(0, Math.min(segment.length, Math.round(start.time + horizontalDelta)))
        node.offsetY = start.offsetY + (moveEvent.clientY - start.y) / canvasViewport.scale
        if(node.end != null && node.end < node.start) node.end = node.start
    })
}
function resizeNodeRange(event: PointerEvent, segment: TimeLineSegment, node: TimeLineNode, edge: "start" | "end"){
    const track = (event.currentTarget as HTMLElement).closest(".track")
    if(!track || node.end == null) return
    startDragging(event.pointerId, (moveEvent) => {
        const value = getTrackValue(moveEvent, track, segment)
        if(edge === "start") node.start = Math.min(value, node.end!)
        else node.end = Math.max(value, node.start)
    })
}
function getTrackValue(event: PointerEvent, track: Element, segment: TimeLineSegment){
    const rect = track.getBoundingClientRect()
    return Math.max(0, Math.min(segment.length, Math.round((event.clientX - rect.left) / canvasViewport.scale / segment.unitWidth)))
}
function startDragging(pointerId: number, move: (event: PointerEvent) => void){
    stopDragging?.()
    const onMove = (event: PointerEvent) => {
        if(event.pointerId === pointerId) move(event)
    }
    const onUp = (event: PointerEvent) => {
        if(event.pointerId === pointerId) stopDragging?.()
    }
    document.addEventListener("pointermove", onMove)
    document.addEventListener("pointerup", onUp)
    document.addEventListener("pointercancel", onUp)
    stopDragging = () => {
        document.removeEventListener("pointermove", onMove)
        document.removeEventListener("pointerup", onUp)
        document.removeEventListener("pointercancel", onUp)
        stopDragging = null
    }
}

function startCanvasPan(event: PointerEvent){
    if(event.pointerType === "touch"){ startTouchGesture(event); return }
    if(event.button !== 2) return
    const start = { x: event.clientX, y: event.clientY, viewport: { ...canvasViewport } }
    startDragging(event.pointerId, (moveEvent) => { canvasViewport.x = start.viewport.x + moveEvent.clientX - start.x; canvasViewport.y = start.viewport.y + moveEvent.clientY - start.y })
}
function zoomCanvas(event: WheelEvent){
    if(!canvasRef.value) return
    const oldScale = canvasViewport.scale
    const scale = Math.max(0.4, Math.min(2.5, oldScale * (event.deltaY > 0 ? 0.9 : 1.1)))
    const rect = canvasRef.value.getBoundingClientRect(), pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top }
    const world = { x: (pointer.x - canvasViewport.x) / oldScale, y: (pointer.y - canvasViewport.y) / oldScale }
    canvasViewport.scale = scale; canvasViewport.x = pointer.x - world.x * scale; canvasViewport.y = pointer.y - world.y * scale
}
function resetCanvas(){ Object.assign(canvasViewport, { x: 0, y: 0, scale: 1 }) }
function startTouchGesture(event: PointerEvent){
    touchPointers.set(event.pointerId, { x: event.clientX, y: event.clientY }); resetTouchStart()
    document.addEventListener("pointermove", moveTouchGesture); document.addEventListener("pointerup", stopTouchGesture); document.addEventListener("pointercancel", stopTouchGesture)
}
function moveTouchGesture(event: PointerEvent){
    if(!touchPointers.has(event.pointerId) || !touchStart || !canvasRef.value) return
    touchPointers.set(event.pointerId, { x: event.clientX, y: event.clientY })
    const points = [...touchPointers.values()]
    if(points.length === 1){ canvasViewport.x = touchStart.viewport.x + points[0].x - touchStart.points[0].x; canvasViewport.y = touchStart.viewport.y + points[0].y - touchStart.points[0].y; return }
    const [first, second] = points, startDistance = distance(touchStart.points[0], touchStart.points[1])
    const scale = Math.max(0.4, Math.min(2.5, touchStart.viewport.scale * distance(first, second) / startDistance)), rect = canvasRef.value.getBoundingClientRect()
    const startMidpoint = midpoint(touchStart.points[0], touchStart.points[1]), midpointNow = midpoint(first, second)
    const localStart = { x: startMidpoint.x - rect.left, y: startMidpoint.y - rect.top }, localNow = { x: midpointNow.x - rect.left, y: midpointNow.y - rect.top }
    const world = { x: (localStart.x - touchStart.viewport.x) / touchStart.viewport.scale, y: (localStart.y - touchStart.viewport.y) / touchStart.viewport.scale }
    canvasViewport.scale = scale; canvasViewport.x = localNow.x - world.x * scale; canvasViewport.y = localNow.y - world.y * scale
}
function stopTouchGesture(event: PointerEvent){
    if(!touchPointers.delete(event.pointerId)) return
    if(touchPointers.size === 0){ touchStart = null; document.removeEventListener("pointermove", moveTouchGesture); document.removeEventListener("pointerup", stopTouchGesture); document.removeEventListener("pointercancel", stopTouchGesture); return }
    resetTouchStart()
}
function resetTouchStart(){ touchStart = { points: [...touchPointers.values()].map((point) => ({ ...point })), viewport: { ...canvasViewport } } }
function distance(first: { x: number, y: number }, second: { x: number, y: number }){ return Math.hypot(first.x - second.x, first.y - second.y) }
function midpoint(first: { x: number, y: number }, second: { x: number, y: number }){ return { x: (first.x + second.x) / 2, y: (first.y + second.y) / 2 } }

function changeTargetType(event: Event){ const node = selectedNode.value?.node; if(node){ const type = (event.target as HTMLSelectElement).value; node.target = type === "event" ? undefined : { type: type as "chapter" | "article", key: "" } } }
function changeTarget(event: Event){ const node = selectedNode.value?.node; if(!node?.target) return; const key = (event.target as HTMLSelectElement).value; node.target.key = key; const target = selectableTargets.value.find((item) => item.key === key); if(target) node.label = target.label }
function deleteNode(){ if(selectedNode.value){ const { segment, node } = selectedNode.value; segment.nodes.splice(segment.nodes.indexOf(node), 1); selectedNode.value = null } }
function deleteConnection(connection: TimeLineConnection){
    const timeLine = timeLines.find((item) => item.connections.includes(connection))
    if(!timeLine) return
    const index = timeLine.connections.indexOf(connection)
    if(index >= 0) timeLine.connections.splice(index, 1)
}
function getSegment(key: string){ return selected.value?.segments.find((segment) => segment.__key === key) }
function connectionStartPoint(connection: TimeLineConnection){ const segment = getSegment(connection.from); return { x: (segment?.position.x ?? 0) + 16 + (segment && (connection.fromAnchor ?? "end") === "end" ? segment.length * segment.unitWidth : 0), y: (segment?.position.y ?? 0) + 71 } }
function connectionEndPoint(connection: TimeLineConnection){ const segment = getSegment(connection.to); return { x: (segment?.position.x ?? 0) + 16 + (segment && (connection.toAnchor ?? "start") === "end" ? segment.length * segment.unitWidth : 0), y: (segment?.position.y ?? 0) + 71 } }
function connectionPath(connection: TimeLineConnection){
    const from = connectionStartPoint(connection), to = connectionEndPoint(connection)
    const dx = to.x - from.x, dy = to.y - from.y, length = Math.hypot(dx, dy)
    if(length === 0) return `M ${from.x} ${from.y}`
    const waves = Math.max(2, Math.round(length / 48)), steps = waves * 8
    const normal = { x: -dy / length, y: dx / length }
    let path = `M ${from.x} ${from.y}`
    for(let index = 1; index <= steps; index++){
        const progress = index / steps
        const offset = Math.sin(progress * waves * Math.PI * 2) * 3
        const x = from.x + dx * progress + normal.x * offset
        const y = from.y + dy * progress + normal.y * offset
        path += ` L ${x} ${y}`
    }
    return path
}
function connectionLabelPoint(connection: TimeLineConnection){ const from = connectionStartPoint(connection), to = connectionEndPoint(connection); return { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 - 8 } }
function connectionLabel(connection: TimeLineConnection){ return connection.type === "parallel" ? "同时" : connection.gap ? `${connection.gap.value}${connection.gap.unit}后` : "之后" }
function isRange(node: TimeLineNode){ return node.end != null && node.end > node.start }
function nodeStyle(segment: TimeLineSegment, node: TimeLineNode){
    const left = Math.max(0, Math.min(segment.length, node.start)) * segment.unitWidth
    const width = isRange(node) ? Math.max(1, Math.min(segment.length, node.end!) - node.start) * segment.unitWidth : undefined
    return width
        ? { left: `${left}px`, top: `${node.offsetY}px`, width: `${width}px` }
        : { left: `${left}px`, top: `${node.offsetY}px` }
}
function nodeAnchorStyle(segment: TimeLineSegment, node: TimeLineNode){
    const rulerY = 55
    const nodeBottom = node.offsetY + 34
    const top = node.offsetY < rulerY ? nodeBottom : rulerY
    const height = Math.max(8, node.offsetY < rulerY ? rulerY - nodeBottom : node.offsetY - rulerY)
    return {
        left: `${node.start * segment.unitWidth}px`,
        top: `${top}px`,
        height: `${height}px`,
    }
}
onBeforeUnmount(() => { stopDragging?.(); document.removeEventListener("pointermove", moveTouchGesture); document.removeEventListener("pointerup", stopTouchGesture); document.removeEventListener("pointercancel", stopTouchGesture) })
</script>

<style scoped lang="scss">
.timeLinePage {
    display: flex;
    height: 100%;
    background: $bgColor;
}

.sideBar {
    box-sizing: border-box;
    width: 220px;
    flex: 0 0 auto;
    padding: 12px;
    overflow: auto;
    border-right: 1px solid $bgColor70;
}

.sideBarTop,
.toolBar,
header {
    display: flex;
    align-items: center;
    gap: 8px;
}

.sideBarTop span {
    flex: 1;
}

.sideBarTop .button,
.toolBar .button,
header .button,
.addNode {
    width: 32px;
    height: 32px;
    padding: 7px;
}

.timeLineItem {
    display: block;
    width: 100%;
    padding: 10px 8px;
    text-align: left;
    border: 0;
    background: transparent;
}

.timeLineItem.active,
.node.selected {
    background: $bgColor90;
}

.editor {
    margin-top: 20px;
    padding-top: 12px;
    border-top: 1px solid $bgColor70;
}

.editor label {
    display: block;
    margin: 10px 0;
    font-size: 0.85rem;
}

.editor input,
.editor select {
    box-sizing: border-box;
    width: 100%;
    margin-top: 4px;
}

.editor input[type="checkbox"] {
    width: auto;
}

.editor .button {
    width: 32px;
    height: 32px;
    padding: 7px;
}

.workspace {
    display: flex;
    min-width: 0;
    flex: 1;
    flex-direction: column;
}

.workArea {
    display: flex;
    min-height: 0;
    flex: 1;
}

.segmentList {
    box-sizing: border-box;
    width: 240px;
    flex: 0 0 auto;
    overflow: auto;
    border-left: 1px solid $bgColor70;
}

.segmentListHeader,
.segmentListItem {
    display: flex;
    min-height: 48px;
    align-items: center;
    gap: 4px;
    padding: 6px 8px;
    box-sizing: border-box;
    border-bottom: 1px solid $bgColor70;
}

.segmentListHeader {
    justify-content: space-between;
    font-weight: 600;
}

.segmentListHeader .button,
.segmentListItem > .button {
    width: 32px;
    height: 32px;
    padding: 7px;
}

.segmentListItem.active {
    background: $bgColor90;
}

.segmentSelect {
    display: flex;
    min-width: 0;
    flex: 1;
    flex-direction: column;
    align-items: flex-start;
    gap: 3px;
    padding: 4px;
    overflow: hidden;
    border: 0;
    background: transparent;
    text-align: left;
}

.segmentSelect span {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.segmentSelect small {
    color: $previewText;
}

.toolBar {
    padding: 12px;
    border-bottom: 1px solid $bgColor70;
}

.toolBar input,
header input {
    min-width: 0;
    flex: 1;
    border: 0;
    background: transparent;
    font: inherit;
}

.canvas {
    position: relative;
    flex: 1;
    overflow: hidden;
    cursor: grab;
    touch-action: none;
}

.canvas:has(:active) {
    cursor: grabbing;
}

.scene {
    position: absolute;
    top: 0;
    left: 0;
    width: 4000px;
    height: 2400px;
    transform-origin: 0 0;
}

.connections {
    position: absolute;
    z-index: 2;
    top: 0;
    left: 0;
    display: block;
    width: 4000px;
    height: 2400px;
    overflow: visible;
    pointer-events: none;
}

.connections .connectionLine {
    fill: none;
    stroke: rgba($previewText, 0.62);
    stroke-width: 1.5px;
    vector-effect: non-scaling-stroke;
    pointer-events: none;
}

.connections .connectionHitArea {
    fill: none;
    stroke: rgba($antiBgColor, 0);
    stroke-width: 16px;
    pointer-events: stroke;
    cursor: context-menu;
}

.connections text {
    pointer-events: auto;
    cursor: pointer;
    fill: $antiBgColor;
    font-size: 16px;
    font-weight: 700;
    text-anchor: middle;
}

.segment {
    position: absolute;
    z-index: 1;
    top: 16px;
    left: 16px;
}

.segment.connecting .track {
    outline: 2px solid $antiBgColor;
}

.segment header {
    position: absolute;
    z-index: 1;
    top: 70px;
    left: 0;
    height: 24px;
    padding: 0 2px;
    box-sizing: border-box;
    cursor: grab;
}

.segment header span {
    white-space: nowrap;
    font-size: 0.8rem;
}

.track {
    position: relative;
    height: 112px;
    box-sizing: border-box;
}

.rulerLine {
    position: absolute;
    top: 55px;
    right: 0;
    left: 0;
    border-top: 1px solid $antiBgColor;
}

.tick {
    position: absolute;
    top: 44px;
    width: 1px;
    height: 11px;
    background: $antiBgColor;
}

.tick.major {
    top: 35px;
    height: 20px;
}

.tickValue {
    position: absolute;
    top: 25px;
    left: 50%;
    transform: translateX(-50%);
    color: $previewText;
    font-size: 10px;
    white-space: nowrap;
}

.node {
    position: absolute;
    z-index: 2;
    max-width: 180px;
    height: 34px;
    padding: 5px 9px;
    box-sizing: border-box;
    overflow: hidden;
    cursor: grab;
    transform: translateX(-50%);
    border: 1px solid $antiBgColor;
    background: $bgColor;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.node.range {
    min-width: 18px;
    max-width: none;
    transform: none;
    text-align: left;
}

.nodeAnchor {
    position: absolute;
    z-index: 1;
    width: 1px;
    transform: translateX(-50%);
    background: $antiBgColor;
}

.rangeHandle {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 8px;
    cursor: ew-resize;
}

.rangeHandle.start {
    left: 0;
}

.rangeHandle.end {
    right: 0;
}

.expandButton {
    position: absolute;
    z-index: 4;
    top: 39px;
    width: 28px !important;
    height: 28px !important;
    padding: 6px !important;
    pointer-events: auto;
    opacity: 0;
    transition: opacity 0.15s;
}

.segment:hover .expandButton {
    pointer-events: auto;
    opacity: 1;
}

.expandButton.start {
    left: -34px;
}

.expandButton.end {
    right: -34px;
}

.addNode {
    position: absolute;
    top: 0;
    right: 0;
    transform: translateX(100%);
}

.empty {
    display: grid;
    flex: 1;
    place-items: center;
}

@media (max-width: 899px) {
    .sideBar {
        width: 170px;
    }

    .segment header {
        height: 32px;
    }

    .segmentList {
        width: 160px;
    }
}
</style>
