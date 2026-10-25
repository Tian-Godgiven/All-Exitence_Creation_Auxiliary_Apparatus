<template>
    <div class="timeLinePage">
        <aside class="sideBar" :class="{ collapsed: isSidebarCollapsed }">
            <div class="sideBarTop">
                <span v-if="!isSidebarCollapsed">时间线</span>
                <Button v-if="!isSidebarCollapsed" icon="add" name="新建时间线" @click="createTimeLine" />
            </div>
            <template v-if="!isSidebarCollapsed">
                <button v-for="item in timeLines" :key="item.__key" class="timeLineItem" :class="{ active: item === selected }" @click="selectTimeLine(item)" @contextmenu.stop.prevent="openTimeLineMenu($event, item)">{{ item.name }}</button>
            </template>

        </aside>
        <Button class="sidebarToggle" :icon="isSidebarCollapsed ? 'rightArrow' : 'leftArrow'" :icon-size="14" :name="isSidebarCollapsed ? '展开时间线列表' : '收起时间线列表'" @click="isSidebarCollapsed = !isSidebarCollapsed" />

        <main v-if="selected" class="workspace">
            <div class="workArea">
            <div ref="canvasRef" class="canvas" @pointerdown="startCanvasPan" @contextmenu.capture="handleCanvasContextMenu" @contextmenu.prevent @wheel.prevent="zoomCanvas">
                <div v-if="selected.segments.length === 0" class="emptyTimeline">
                    <p>点击创建时间片段</p>
                    <div class="emptyTimelineActions">
                        <Button icon="addContainer" name="创建时间片段" @click="createSegment" />
                        <Button icon="help" name="操作提示" @click="showMainToolPageHelp(help)" />
                    </div>
                </div>
                <Button class="resetCanvasButton" icon="backMain" name="复位画布" @click="resetCanvas" />
                <div class="scene" :style="{ transform: `translate(${canvasViewport.x}px, ${canvasViewport.y}px) scale(${canvasViewport.scale})` }">
                    <svg class="connections" viewBox="0 0 4000 2400" preserveAspectRatio="none"><g v-for="connection in selected.connections" :key="connection.__key"><path class="connectionLine" :d="connectionPath(connection)" /><path class="connectionHitArea" :d="connectionPath(connection)" @contextmenu.stop.prevent="openConnectionMenu($event, connection)" /><text :x="connectionLabelPoint(connection).x" :y="connectionLabelPoint(connection).y" @click.stop="editConnection(connection)" @contextmenu.stop.prevent="openConnectionMenu($event, connection)">{{ connectionLabel(connection) }}</text></g></svg>
                    <section v-for="segment in selected.segments" :key="segment.__key" class="segment" :class="{ connecting: connectionStart === segment, active: selectedSegment === segment, expanded: isExpandedSegment(segment) }" :style="{ transform: `translate(${segment.position.x}px, ${segment.position.y}px)` }" @pointerdown="startSegmentDrag($event, segment)" @click="selectSegment(segment, true)" @dblclick.stop.prevent="createNodeAt($event, segment)" @contextmenu.stop.prevent="openSegmentMenu($event, segment)">
                        <header v-if="titleSegment === segment"><span>{{ segment.name }} · {{ segment.length }} {{ segment.unit }}</span></header>
                        <div class="track" :class="{ calendar: segment.axisOrigin }" :style="{ width: `${segment.length * segment.unitWidth}px`, '--unit-width': `${segment.unitWidth}px` }">
                            <div class="rulerLine"></div>
                            <template v-for="unit in segment.length + 1" :key="unit - 1">
                                <span class="tick" :class="{ major: (segment.axisStart + unit - 1) % 5 === 0, long: isTimeLineLongTick(segment, segment.axisStart + unit - 1) }" :style="{ left: `${(unit - 1) * segment.unitWidth}px` }"></span>
                                <span v-if="(segment.axisStart + unit - 1) % 5 === 0 || isTimeLineLongTick(segment, segment.axisStart + unit - 1)" class="tickValue" :style="{ left: `${(unit - 1) * segment.unitWidth}px` }">{{ timeLineTickLabel(segment, segment.axisStart + unit - 1) }}</span>
                            </template>
                            <button v-for="node in segment.nodes" :key="node.__key" class="node" :class="{ article: node.kind === 'article', selected: selectedNode?.node === node, range: node.end != null && node.end > node.start }" :style="nodeStyle(segment, node)" :data-timeline-node-key="node.__key" @pointerdown.stop="startNodeDrag($event, segment, node)" @click.stop="handleNodeClick(node, segment)" @dblclick.stop="openNodeArticle(node)" @contextmenu.stop.prevent="openNodeMenu($event, segment, node)"><span v-if="isRange(node)" class="rangeHandle start" @pointerdown.stop="resizeNodeRange($event, segment, node, 'start')" @click.stop></span><span v-if="node.kind === 'article'" class="nodeKind">文章</span><span class="nodeLabel">{{ nodeDisplayLabel(node) }}</span><span v-if="isRange(node)" class="rangeHandle end" @pointerdown.stop="resizeNodeRange($event, segment, node, 'end')" @click.stop></span></button>
                            <template v-for="node in segment.nodes" :key="`${node.__key}-content`">
                                <div v-if="expandedNodeKey === node.__key && node.kind === 'card' && hasNodeContent(node)" class="expandedCard" :style="expandedNodeStyle(segment, node)" :data-timeline-node-key="node.__key" @pointerdown.stop @dblclick.stop>
                                    <strong>{{ nodeDisplayLabel(node) }}</strong>
                                    <TextArea :model-value="node.content ?? []" mode="disabled" />
                                </div>
                            </template>
                            <span v-for="node in segment.nodes" :key="`${node.__key}-anchor`" class="nodeAnchor" :style="nodeAnchorStyle(segment, node)"></span>
                            <Button class="expandButton start" icon="add" name="向前扩张 50 单位" @click="expand(segment, 'start')" @dblclick.stop />
                            <Button class="expandButton end" icon="add" name="向后扩张 50 单位" @click="expand(segment, 'end')" @dblclick.stop />
                        </div>
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
import { onBeforeUnmount, onMounted, reactive, ref, watch } from "vue"
import Button from "@/components/global/button.vue"
import TextArea from "@/components/other/textArea/textArea.vue"
import { focusOnArticle, nowAllArticles } from "@/hooks/all-articles/allArticles"
import { showAlert } from "@/hooks/alert"
import { showPopUp } from "@/hooks/pages/popUp"
import { showControlPanel } from "@/hooks/controlPanel"
import { showMainToolPageHelp } from "@/hooks/pages/mainPage/toolPage"
import type { MainToolPageHelp } from "@/hooks/pages/mainPage/toolPage"
import { shallowRef } from "vue"
import SegmentEditor from "./SegmentEditor.vue"
import TimeLineNameEditor from "./TimeLineNameEditor.vue"
import NodeEditor from "./NodeEditor.vue"
import ConnectionEditor from "./ConnectionEditor.vue"
import { createStoryTimeLine, createTimeLineConnection, createTimeLineNode, createTimeLineSegment, deleteTimeLineSegment, expandSegment, isTimeLineLongTick, moveStoryTimeLineToTrash, nowStoryTimeLines, timeLineTickLabel } from "./timeLine"
import type { StoryTimeLine, TimeLineConnection, TimeLineNode, TimeLineSegment } from "./timeLine"

const timeLines = nowStoryTimeLines
const { help } = defineProps<{ help: MainToolPageHelp }>()
const selected = ref<StoryTimeLine | null>(timeLines[0] ?? null)
const canvasRef = ref<HTMLElement>()
const selectedSegment = ref<TimeLineSegment | null>(null)
const selectedNode = ref<{ segment: TimeLineSegment, node: TimeLineNode } | null>(null)
const titleSegment = ref<TimeLineSegment | null>(null)
const connectionStart = ref<TimeLineSegment | null>(null)
const expandedNodeKey = ref<string | null>(null)
const isSidebarCollapsed = ref(false)
const canvasViewport = reactive({ x: 0, y: 0, scale: 1 })
const touchPointers = new Map<number, { x: number, y: number }>()
let stopDragging: (() => void) | null = null
let suppressNodeClick = false
let suppressNodeClickTimer: ReturnType<typeof setTimeout> | null = null
let suppressCanvasContextMenu = false
let suppressCanvasContextMenuTimer: ReturnType<typeof setTimeout> | null = null
let touchStart: { points: { x: number, y: number }[], viewport: { x: number, y: number, scale: number } } | null = null

watch(selected, (timeLine) => {
    if(timeLine) Object.assign(canvasViewport, timeLine.viewport)
}, { immediate: true })
watch(canvasViewport, (viewport) => {
    if(selected.value) Object.assign(selected.value.viewport, viewport)
})

function createTimeLine(){ selected.value = createStoryTimeLine() }
function openTimeLineMenu(event: MouseEvent, timeLine: StoryTimeLine){
    showControlPanel({ option: [
        { text: "修改名称", click: () => renameTimeLine(timeLine) },
        { text: "删除时间线", danger: true, click: () => confirmDeleteTimeLine(timeLine) },
    ] }, { x: event.clientX, y: event.clientY })
}
function renameTimeLine(timeLine: StoryTimeLine){
    showPopUp({
        name: "修改时间线名称",
        vue: shallowRef(TimeLineNameEditor),
        mask: true,
        props: { name: timeLine.name },
        returnValue: (name: string) => { timeLine.name = name },
    })
}
function selectTimeLine(timeLine: StoryTimeLine){
    selected.value = timeLine
    selectedSegment.value = null
    selectedNode.value = null
    connectionStart.value = null
    titleSegment.value = null
    expandedNodeKey.value = null
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
        returnValue: (setting) => saveSegmentSettings(segment, setting),
    })
}
function saveSegmentSettings(segment: TimeLineSegment, setting: Pick<TimeLineSegment, "name" | "timeRuleKey" | "unit" | "length" | "unitWidth" | "calendarName" | "axisOrigin">){
    const axisStart = segment.axisStart ?? 0
    const newLength = Number.isFinite(setting.length) ? Math.max(1, setting.length) : segment.length
    const newEnd = axisStart + newLength
    const affectedNodes = segment.nodes.filter((node) => node.start > newEnd || (node.end != null && node.end > newEnd))
    const apply = () => {
        affectedNodes.forEach((node) => {
            if(node.start > newEnd) node.start = newEnd
            if(node.end != null) node.end = Math.max(node.start, Math.min(node.end, newEnd))
        })
        Object.assign(segment, setting, { length: newLength })
    }
    if(newLength < segment.length && affectedNodes.length){
        const details = affectedNodes.map((node) => node.start > newEnd
            ? `“${node.label}”将移到片段末尾${node.end != null && node.end > newEnd ? "，范围终点也会移到末尾" : ""}`
            : `“${node.label}”的范围终点将裁剪到 ${newEnd}`)
        showAlert({ info: `缩短时间片段会调整以下节点时间，但不会删除节点：\n${details.join("\n")}\n确定继续吗？`, confirm: apply })
        return
    }
    apply()
}
function openSegmentMenu(event: MouseEvent, segment: TimeLineSegment){
    selectedSegment.value = segment
    selectedNode.value = null
    const options = [
        { text: "创建节点", click: () => createNodeAt(event, segment) },
        { text: "创建关系", click: () => beginConnection(segment) },
        { text: "编辑片段", click: () => editSegment(segment) },
        { text: "删除片段", danger: true, click: () => deleteSegment(segment) },
    ]
    showControlPanel({ option: options }, { x: event.clientX, y: event.clientY })
}
function createNodeAt(event: MouseEvent, segment: TimeLineSegment){
    const segmentElement = (event.target as HTMLElement).closest<HTMLElement>(".segment")
    const track = (event.target as HTMLElement).closest<HTMLElement>(".track") ?? segmentElement?.querySelector<HTMLElement>(".track")
    if(!track) return
    const rect = track.getBoundingClientRect()
    const start = segment.axisStart + Math.max(0, Math.min(segment.length, Math.round((event.clientX - rect.left) / canvasViewport.scale / segment.unitWidth)))
    const offsetY = Math.max(0, Math.min(78, (event.clientY - rect.top) / canvasViewport.scale - 17))
    openNodeEditor(segment, start, offsetY)
}
function openNodeEditor(segment: TimeLineSegment, start: number, offsetY: number){
    showPopUp({
        name: "创建时间线节点",
        vue: shallowRef(NodeEditor),
        mask: true,
        props: { start, offsetY, minTime: segment.axisStart, maxTime: segment.axisStart + segment.length },
        returnValue: (setting) => {
            const node = createTimeLineNode(segment, setting)
            selectNode(segment, node)
        },
    })
}
function editNode(segment: TimeLineSegment, node: TimeLineNode){
    showPopUp({
        name: "编辑时间线节点",
        vue: shallowRef(NodeEditor),
        mask: true,
        props: { start: node.start, offsetY: node.offsetY, minTime: segment.axisStart, maxTime: segment.axisStart + segment.length, node },
        returnValue: (setting) => Object.assign(node, setting),
    })
}
function openNodeMenu(event: MouseEvent, segment: TimeLineSegment, node: TimeLineNode){
    selectNode(segment, node)
    const options = [{ text: "编辑节点", click: () => editNode(segment, node) }]
    const article = node.target?.type === "article" ? findArticle(node.target.key) : undefined
    if(article){
        options.push({ text: "跳转到文章", click: () => openNodeArticle(node) })
    }
    options.push({ text: "删除节点", danger: true, click: () => deleteNode(segment, node) })
    showControlPanel({ option: options }, { x: event.clientX, y: event.clientY })
}
function openNodeArticle(node: TimeLineNode){
    if(node.kind !== "article" || node.target?.type !== "article") return
    const article = findArticle(node.target.key)
    if(article) focusOnArticle(article, false)
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
        { text: "删除关系", danger: true, click: () => deleteConnection(connection) },
    ] }, { x: event.clientX, y: event.clientY })
}
function expand(segment: TimeLineSegment, direction: "start" | "end"){
    expandSegment(segment, direction)
}
function deleteSegment(segment = selectedSegment.value){
    const timeLine = selected.value
    if(!timeLine || !segment) return
    showAlert({ info: `删除时间片段“${segment.name}”？`, confirm: () => {
        deleteTimeLineSegment(timeLine, segment)
        if(selectedSegment.value === segment) selectedSegment.value = null
        if(selectedNode.value?.segment === segment) selectedNode.value = null
        if(connectionStart.value === segment) connectionStart.value = null
        if(titleSegment.value === segment) titleSegment.value = null
    }})
}
function confirmDeleteTimeLine(timeLine: StoryTimeLine){
    showAlert({ info: `删除时间线“${timeLine.name}”？它会移入时间线回收站。`, confirm: async () => {
        const index = timeLines.indexOf(timeLine)
        if(!(await moveStoryTimeLineToTrash(timeLine))) return
        if(selected.value === timeLine){
            selected.value = timeLines[index] ?? timeLines[index - 1] ?? null
            selectedSegment.value = null; selectedNode.value = null; connectionStart.value = null
            titleSegment.value = null; expandedNodeKey.value = null
        }
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
function handleNodeClick(node: TimeLineNode, segment: TimeLineSegment){
    if(suppressNodeClick){
        suppressNodeClick = false
        if(suppressNodeClickTimer) clearTimeout(suppressNodeClickTimer)
        suppressNodeClickTimer = null
        return
    }
    toggleNode(node, segment)
}
function toggleNode(node: TimeLineNode, segment: TimeLineSegment){
    selectNode(segment, node)
    expandedNodeKey.value = node.kind === "card" && hasNodeContent(node) && expandedNodeKey.value !== node.__key ? node.__key : null
}
function isExpandedSegment(segment: TimeLineSegment){
    return segment.nodes.some((node) => node.__key === expandedNodeKey.value)
}
function closeExpandedNodeOnOutsideClick(event: PointerEvent){
    const expandedKey = expandedNodeKey.value
    if(!expandedKey) return
    const target = event.target
    if(target instanceof Element && target.closest("[data-timeline-node-key]")?.getAttribute("data-timeline-node-key") === expandedKey) return
    expandedNodeKey.value = null
}
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
    if(event.button !== 0) return
    selectNode(segment, node)
    const track = (event.currentTarget as HTMLElement).closest(".track")
    if(!track) return
    const start = {
        x: event.clientX,
        y: event.clientY,
        time: node.start,
        offsetY: node.offsetY,
    }
    let moved = false
    startDragging(event.pointerId, (moveEvent) => {
        if(Math.hypot(moveEvent.clientX - start.x, moveEvent.clientY - start.y) > 3) moved = true
        const horizontalDelta = (moveEvent.clientX - start.x) / canvasViewport.scale / segment.unitWidth
        node.start = Math.max(segment.axisStart, Math.min(segment.axisStart + segment.length, Math.round(start.time + horizontalDelta)))
        node.offsetY = start.offsetY + (moveEvent.clientY - start.y) / canvasViewport.scale
        if(node.end != null && node.end < node.start) node.end = node.start
    }, () => {
        if(!moved) return
        suppressNodeClick = true
        if(suppressNodeClickTimer) clearTimeout(suppressNodeClickTimer)
        suppressNodeClickTimer = setTimeout(() => {
            suppressNodeClick = false
            suppressNodeClickTimer = null
        }, 0)
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
    return segment.axisStart + Math.max(0, Math.min(segment.length, Math.round((event.clientX - rect.left) / canvasViewport.scale / segment.unitWidth)))
}
function startDragging(pointerId: number, move: (event: PointerEvent) => void, onEnd?: () => void){
    stopDragging?.()
    const onMove = (event: PointerEvent) => {
        if(event.pointerId === pointerId) move(event)
    }
    const onUp = (event: PointerEvent) => {
        if(event.pointerId === pointerId){ stopDragging?.(); onEnd?.() }
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
    let moved = false
    startDragging(event.pointerId, (moveEvent) => {
        if(Math.hypot(moveEvent.clientX - start.x, moveEvent.clientY - start.y) > 4) moved = true
        canvasViewport.x = start.viewport.x + moveEvent.clientX - start.x
        canvasViewport.y = start.viewport.y + moveEvent.clientY - start.y
    }, () => {
        if(!moved) return
        suppressCanvasContextMenu = true
        if(suppressCanvasContextMenuTimer) clearTimeout(suppressCanvasContextMenuTimer)
        suppressCanvasContextMenuTimer = setTimeout(() => {
            suppressCanvasContextMenu = false
            suppressCanvasContextMenuTimer = null
        }, 700)
    })
}
function handleCanvasContextMenu(event: MouseEvent){
    if(!suppressCanvasContextMenu) return
    event.preventDefault()
    event.stopPropagation()
    suppressCanvasContextMenu = false
    if(suppressCanvasContextMenuTimer) clearTimeout(suppressCanvasContextMenuTimer)
    suppressCanvasContextMenuTimer = null
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

function deleteNode(segment = selectedNode.value?.segment, node = selectedNode.value?.node){
    if(!segment || !node) return
    segment.nodes.splice(segment.nodes.indexOf(node), 1)
    if(selectedNode.value?.node === node) selectedNode.value = null
    if(expandedNodeKey.value === node.__key) expandedNodeKey.value = null
}
function findArticle(key: string){
    const find = (parent: typeof nowAllArticles): (typeof nowAllArticles.articles)[number] | undefined => {
        const match = parent.articles.find((article) => article.__key === key)
        if(match) return match
        for(const chapter of parent.chapters){
            const nested = find(chapter)
            if(nested) return nested
        }
    }
    return find(nowAllArticles)
}
function nodeDisplayLabel(node: TimeLineNode){
    return node.target?.type === "article" ? findArticle(node.target.key)?.title || node.label : node.label
}
function hasNodeContent(node: TimeLineNode){
    return Array.isArray(node.content) ? node.content.length > 0 : Boolean(node.content)
}
function expandedNodeStyle(segment: TimeLineSegment, node: TimeLineNode){
    const base = nodeStyle(segment, node)
    if("display" in base) return base
    const left = `${(node.start - (segment.axisStart ?? 0)) * segment.unitWidth}px`
    if(isNodeAboveRuler(node)) return { ...base, left, top: "auto", bottom: `${116 - node.offsetY}px` }
    return { ...base, left, top: `${node.offsetY + 38}px` }
}
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
function isNodeAboveRuler(node: TimeLineNode){ return node.offsetY < 55 }
function nodeStyle(segment: TimeLineSegment, node: TimeLineNode){
    const axisStart = segment.axisStart ?? 0, axisEnd = axisStart + segment.length
    if(node.start > axisEnd || (node.end != null && node.end < axisStart)) return { display: "none" }
    const visibleStart = Math.max(axisStart, Math.min(axisEnd, node.start))
    const left = (visibleStart - axisStart) * segment.unitWidth
    const width = isRange(node) ? Math.max(1, Math.min(axisEnd, node.end!) - visibleStart) * segment.unitWidth : undefined
    return width
        ? { left: `${left}px`, top: `${node.offsetY}px`, width: `${width}px` }
        : { left: `${left}px`, top: `${node.offsetY}px` }
}
function nodeAnchorStyle(segment: TimeLineSegment, node: TimeLineNode){
    const axisStart = segment.axisStart ?? 0, axisEnd = axisStart + segment.length
    if(node.start > axisEnd || (node.end != null && node.end < axisStart)) return { display: "none" }
    const rulerY = 55
    const nodeBottom = node.offsetY + 34
    const top = node.offsetY < rulerY ? nodeBottom : rulerY
    const height = Math.max(8, node.offsetY < rulerY ? rulerY - nodeBottom : node.offsetY - rulerY)
    return {
        left: `${(Math.max(axisStart, Math.min(axisEnd, node.start)) - axisStart) * segment.unitWidth}px`,
        top: `${top}px`,
        height: `${height}px`,
    }
}
onMounted(() => document.addEventListener("pointerdown", closeExpandedNodeOnOutsideClick, true))
onBeforeUnmount(() => {
    stopDragging?.()
    document.removeEventListener("pointerdown", closeExpandedNodeOnOutsideClick, true)
    if(suppressNodeClickTimer) clearTimeout(suppressNodeClickTimer)
    if(suppressCanvasContextMenuTimer) clearTimeout(suppressCanvasContextMenuTimer)
    document.removeEventListener("pointermove", moveTouchGesture)
    document.removeEventListener("pointerup", stopTouchGesture)
    document.removeEventListener("pointercancel", stopTouchGesture)
})
</script>

<style scoped lang="scss">
.timeLinePage {
    --timeline-sidebar-width: 220px;
    position: relative;
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

.sideBar.collapsed {
    width: 0;
    padding: 0;
    overflow: hidden;
    border-right: 0;
}

.sidebarToggle {
    position: absolute;
    z-index: 4;
    top: 50%;
    left: var(--timeline-sidebar-width);
    display: flex;
    width: 20px;
    height: 64px;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    transform: translateY(-50%);
    border: 1px solid $bgColor70;
    border-left: 0;
    border-radius: 0 5px 5px 0;
    background: $bgColor;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.12);
}

.sideBar.collapsed + .sidebarToggle {
    left: 0;
}

.sideBarTop,
header {
    display: flex;
    align-items: center;
    gap: 8px;
}

.sideBarTop span {
    flex: 1;
}

.sideBarTop .button,
header .button {
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

.canvas {
    position: relative;
    flex: 1;
    overflow: hidden;
    cursor: grab;
    touch-action: none;
}

.emptyTimeline {
    position: absolute;
    z-index: 2;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 8px;
    pointer-events: none;
}

.emptyTimeline p {
    margin: 0;
    color: $previewText;
}

.emptyTimelineActions {
    display: flex;
    gap: 8px;
    pointer-events: auto;
}

.resetCanvasButton {
    position: absolute;
    z-index: 2;
    top: 8px;
    right: 8px;
    width: 36px;
    height: 36px;
    padding: 8px;
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
    z-index: 0;
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

.segment.expanded {
    z-index: 3;
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
    top: 39px;
    height: 16px;
}

.tick.long {
    top: 39px;
    height: 16px;
    width: 2px;
}

.track.calendar .tick.major {
    top: 44px;
    height: 11px;
}

.track.calendar .tick.long {
    top: 39px;
    height: 16px;
    width: 2px;
}

.tickValue {
    position: absolute;
    top: 59px;
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

.node.article {
    overflow: visible;
    border-radius: 5px;
    background: transparent;
    font-weight: 600;
}

.nodeLabel {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
}

.nodeKind {
    position: absolute;
    top: -10px;
    left: 3px;
    padding: 0 3px;
    background: $bgColor;
    color: $previewText;
    font-size: 0.72em;
    font-weight: 400;
    line-height: 1.2;
}

.expandedCard {
    position: absolute;
    z-index: 5;
    display: flex;
    width: 280px;
    max-height: 260px;
    flex-direction: column;
    gap: 8px;
    padding: 10px;
    overflow: auto;
    transform: translateX(-50%);
    border: 1px solid $bgColor70;
    background: $bgColor;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.16);
}

.expandedCard :deep(.textArea) {
    min-height: 40px;
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

.expandButton:hover,
.expandButton:focus-visible {
    pointer-events: auto;
    opacity: 1;
}

.expandButton.start {
    left: -34px;
}

.expandButton.end {
    right: -34px;
}

.empty {
    display: grid;
    flex: 1;
    place-items: center;
}

@media (max-width: 899px) {
    .timeLinePage {
        --timeline-sidebar-width: 170px;
    }

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
