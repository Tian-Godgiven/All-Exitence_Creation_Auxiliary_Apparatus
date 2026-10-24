import { reactive, toRaw } from "vue"
import { nanoid } from "nanoid"
import { addDays, addMonths, addYears } from "date-fns"
import { cloneDeep } from "lodash"
import { addToRightPage } from "@/hooks/pages/rightPage"
import { openMainToolPage } from "@/hooks/pages/mainPage/toolPage"
import type { ProjectFeature } from "@/repository/projectFeature"
import type { SupportAbilitySignUpItem } from "@/static/list/supportAbilityList"
import TimeLinePage from "./TimeLinePage.vue"

export type TimeLineNode = {
    __key: string,
    kind: "article" | "card",
    label: string,
    content?: any,
    start: number,
    end?: number,
    offsetY: number,
    target?: { type: "article", key: string },
}

export type TimeLineSegment = {
    __key: string,
    name: string,
    timeRuleKey: string,
    calendarName?: string,
    axisOrigin?: { year: number, month: number, day: number },
    unit: string,
    axisStart: number,
    length: number,
    unitWidth: number,
    position: { x: number, y: number },
    nodes: TimeLineNode[],
}

export type StoryTimeLine = {
    __key: string,
    name: string,
    segments: TimeLineSegment[],
    connections: TimeLineConnection[],
    viewport: { x: number, y: number, scale: number },
}

export type TimeLineTrashRecord = {
    __key: string,
    deletedAt: number,
    originalIndex: number,
    timeLine: StoryTimeLine,
}

export type TimeLineConnection = {
    __key: string,
    from: string,
    to: string,
    type: "after" | "parallel",
    fromAnchor?: "start" | "end",
    toAnchor?: "start" | "end",
    gap?: { value: number, unit: string, timeRuleKey: string },
}

const defaultData: StoryTimeLine[] = []
export const nowStoryTimeLines = reactive<StoryTimeLine[]>([])
export const nowTimeLineTrash = reactive<TimeLineTrashRecord[]>([])

export const timeLineProjectFeature: ProjectFeature<StoryTimeLine[]> = {
    key: "timeline",
    createDefault: () => cloneDeep(defaultData),
    load: (data) => {
        nowStoryTimeLines.length = 0
        nowStoryTimeLines.push(...cloneDeep(data).map((timeLine) => ({
            ...timeLine,
            connections: timeLine.connections ?? [],
            viewport: timeLine.viewport ?? { x: 0, y: 0, scale: 1 },
            segments: timeLine.segments.map((segment) => ({
                ...segment,
                axisStart: segment.axisStart ?? 0,
                timeRuleKey: "date",
                unit: ["年", "月", "日"].includes(segment.unit) ? segment.unit : "日",
                unitWidth: segment.unitWidth ?? 24,
                nodes: segment.nodes.map((node) => ({
                    ...node,
                    kind: node.kind ?? (node.target?.type === "article" ? "article" : "card"),
                    offsetY: node.offsetY ?? 8,
                })),
            })),
        })))
    },
    snapshot: () => cloneDeep(toRaw(nowStoryTimeLines)),
}

export const timeLineTrashProjectFeature: ProjectFeature<TimeLineTrashRecord[]> = {
    key: "timeline-trash",
    createDefault: () => [],
    load: (data) => {
        nowTimeLineTrash.length = 0
        nowTimeLineTrash.push(...cloneDeep(data ?? []))
    },
    snapshot: () => cloneDeep(toRaw(nowTimeLineTrash)),
}

export const timeLineSignUpItem: SupportAbilitySignUpItem = {
    name: "timeLine",
    init: () => addToRightPage({ name: "时间线", icon: "timeLine", click: showTimeLinePage }, "可视化"),
    recycleBinEntry: { name: "时间线回收站", click: showTimeLineTrashPage },
}

const timeLineHelp = {
    title: "时间线操作提示",
    info: "右键时间线列表项可修改名称或删除时间线。\n\n在右侧片段列表新建时间片段；右键时间片段可创建节点、创建关系、编辑或删除片段。双击片段可在对应位置创建节点。\n\n拖动画布可平移，滚轮可缩放；点击片段列表项可定位片段。节点可拖动调整时间，右键节点可编辑、删除或跳转到文章。",
}

export function showTimeLinePage(){
    openMainToolPage({
        name: "时间线",
        component: TimeLinePage,
        props: { help: timeLineHelp },
        help: timeLineHelp,
    })
}

export async function showTimeLineTrashPage(){
    const { default: TimeLineTrashPage } = await import("./TimeLineTrashPage.vue")
    openMainToolPage({ name: "时间线回收站", component: TimeLineTrashPage })
}

export function createStoryTimeLine(name = "新时间线"){
    const timeLine: StoryTimeLine = { __key: nanoid(), name, segments: [], connections: [], viewport: { x: 0, y: 0, scale: 1 } }
    nowStoryTimeLines.push(timeLine)
    return timeLine
}

export async function moveStoryTimeLineToTrash(timeLine: StoryTimeLine){
    const index = nowStoryTimeLines.indexOf(timeLine)
    if(index < 0) return false
    const record: TimeLineTrashRecord = {
        __key: nanoid(),
        deletedAt: Date.now(),
        originalIndex: index,
        timeLine: cloneDeep(toRaw(timeLine)),
    }
    nowTimeLineTrash.unshift(record)
    nowStoryTimeLines.splice(index, 1)
    const { saveProject } = await import("@/hooks/project/project")
    if(await saveProject()) return true
    const trashIndex = nowTimeLineTrash.indexOf(record)
    if(trashIndex >= 0) nowTimeLineTrash.splice(trashIndex, 1)
    nowStoryTimeLines.splice(index, 0, timeLine)
    return false
}

export async function restoreStoryTimeLineFromTrash(record: TimeLineTrashRecord){
    const trashIndex = nowTimeLineTrash.indexOf(record)
    if(trashIndex < 0) return false
    nowTimeLineTrash.splice(trashIndex, 1)
    const restoredTimeLine = cloneDeep(record.timeLine)
    nowStoryTimeLines.splice(Math.min(record.originalIndex, nowStoryTimeLines.length), 0, restoredTimeLine)
    const { saveProject } = await import("@/hooks/project/project")
    if(await saveProject()) return true
    const restoredIndex = nowStoryTimeLines.indexOf(restoredTimeLine)
    if(restoredIndex >= 0) nowStoryTimeLines.splice(restoredIndex, 1)
    nowTimeLineTrash.splice(trashIndex, 0, record)
    return false
}

export async function permanentlyDeleteStoryTimeLine(record: TimeLineTrashRecord){
    const index = nowTimeLineTrash.indexOf(record)
    if(index < 0) return false
    nowTimeLineTrash.splice(index, 1)
    const { saveProject } = await import("@/hooks/project/project")
    if(await saveProject()) return true
    nowTimeLineTrash.splice(index, 0, record)
    return false
}

export function createTimeLineConnection(timeLine: StoryTimeLine, from: TimeLineSegment, to: TimeLineSegment, setting: Pick<TimeLineConnection, "type" | "fromAnchor" | "toAnchor" | "gap"> = { type: "after", fromAnchor: "end", toAnchor: "start" }){
    const connection: TimeLineConnection = { __key: nanoid(), from: from.__key, to: to.__key, ...setting }
    timeLine.connections.push(connection)
    return connection
}

export function deleteTimeLineSegment(timeLine: StoryTimeLine, segment: TimeLineSegment){
    const index = timeLine.segments.indexOf(segment)
    if(index < 0) return
    timeLine.segments.splice(index, 1)
    timeLine.connections = timeLine.connections.filter((connection) => connection.from !== segment.__key && connection.to !== segment.__key)
}

export function createTimeLineSegment(timeLine: StoryTimeLine, setting?: Pick<TimeLineSegment, "name" | "timeRuleKey" | "unit" | "length" | "unitWidth" | "calendarName" | "axisOrigin">){
    const segment: TimeLineSegment = {
        __key: nanoid(), name: setting?.name || "新时间片段", timeRuleKey: "date", unit: setting?.unit ?? "日", calendarName: setting?.calendarName, axisOrigin: setting?.axisOrigin, axisStart: 0, length: Math.max(1, setting?.length ?? 50), unitWidth: Math.max(8, setting?.unitWidth ?? 24),
        position: { x: timeLine.segments.length * 40, y: timeLine.segments.length * 32 }, nodes: [],
    }
    timeLine.segments.push(segment)
    return segment
}

export function getTimeLineDate(segment: TimeLineSegment, value: number){
    if(!segment.axisOrigin) return null
    const date = new Date(0)
    date.setHours(12, 0, 0, 0)
    date.setFullYear(segment.axisOrigin.year, segment.axisOrigin.month - 1, segment.axisOrigin.day)
    if(segment.unit === "年") return addYears(date, value)
    if(segment.unit === "月") return addMonths(date, value)
    return addDays(date, value)
}

export function formatTimeLineDate(segment: TimeLineSegment, value: number){
    const date = getTimeLineDate(segment, value)
    if(!date) return String(value)
    if(segment.unit === "年") return `${date.getFullYear()}年`
    if(segment.unit === "月") return `${date.getFullYear()}年${date.getMonth() + 1}月`
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}

export function timeLineTickLabel(segment: TimeLineSegment, value: number){
    if(!segment.axisOrigin) return String(value)
    const date = getTimeLineDate(segment, value)
    if(!date) return String(value)
    if(value === 0) return `${segment.calendarName ? `${segment.calendarName} ` : ""}${formatTimeLineDate(segment, value)}`
    if(segment.unit === "年") return value % 5 === 0 ? `${date.getFullYear()}年` : ""
    if(segment.unit === "月"){
        if(date.getMonth() === 0) return `${date.getFullYear()}年`
        return value % 5 === 0 ? `${date.getMonth() + 1}月` : ""
    }
    if(date.getDate() === 1) return date.getMonth() === 0 ? `${date.getFullYear()}年` : `${date.getMonth() + 1}月`
    return value % 5 === 0 ? `${date.getDate()}日` : ""
}

export function isTimeLineLongTick(segment: TimeLineSegment, value: number){
    if(!segment.axisOrigin || value === 0) return false
    const date = getTimeLineDate(segment, value)
    if(!date) return false
    if(segment.unit === "日") return date.getDate() === 1
    if(segment.unit === "月") return date.getMonth() === 0
    return false
}

export function expandSegment(segment: TimeLineSegment, direction: "start" | "end"){
    if(direction === "start"){
        segment.position.x -= 50 * segment.unitWidth
        segment.axisStart -= 50
    }
    segment.length += 50
}

export function createTimeLineNode(segment: TimeLineSegment, setting: Pick<TimeLineNode, "kind" | "label" | "start" | "offsetY"> & Pick<TimeLineNode, "content" | "end" | "target"> = { kind: "card", label: "新卡片", start: 0, offsetY: 8 }){
    const node: TimeLineNode = { __key: nanoid(), ...setting }
    segment.nodes.push(node)
    return node
}
