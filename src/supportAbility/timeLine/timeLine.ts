import { reactive, toRaw } from "vue"
import { nanoid } from "nanoid"
import { addToRightPage } from "@/hooks/pages/rightPage"
import { openMainToolPage } from "@/hooks/pages/mainPage/toolPage"
import type { ProjectFeature } from "@/repository/projectFeature"
import type { SupportAbilitySignUpItem } from "@/static/list/supportAbilityList"
import TimeLinePage from "./TimeLinePage.vue"

export type TimeLineNode = {
    __key: string,
    label: string,
    start: number,
    end?: number,
    offsetY: number,
    target?: { type: "article" | "chapter" | "event", key: string },
}

export type TimeLineSegment = {
    __key: string,
    name: string,
    timeRuleKey: string,
    unit: string,
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

export const timeLineProjectFeature: ProjectFeature<StoryTimeLine[]> = {
    key: "timeline",
    createDefault: () => structuredClone(defaultData),
    load: (data) => {
        nowStoryTimeLines.length = 0
        nowStoryTimeLines.push(...structuredClone(data).map((timeLine) => ({
            ...timeLine,
            connections: timeLine.connections ?? [],
            viewport: timeLine.viewport ?? { x: 0, y: 0, scale: 1 },
            segments: timeLine.segments.map((segment) => ({
                ...segment,
                unitWidth: segment.unitWidth ?? 24,
                nodes: segment.nodes.map((node) => ({ ...node, offsetY: node.offsetY ?? 8 })),
            })),
        })))
    },
    snapshot: () => structuredClone(toRaw(nowStoryTimeLines)),
}

export const timeLineSignUpItem: SupportAbilitySignUpItem = {
    name: "timeLine",
    init: () => addToRightPage({ name: "时间线", icon: "timeLine", click: showTimeLinePage }, "可视化"),
}

export function showTimeLinePage(){
    openMainToolPage({ name: "时间线", component: TimeLinePage })
}

export function createStoryTimeLine(name = "新时间线"){
    const timeLine: StoryTimeLine = { __key: nanoid(), name, segments: [], connections: [], viewport: { x: 0, y: 0, scale: 1 } }
    nowStoryTimeLines.push(timeLine)
    return timeLine
}

export function deleteStoryTimeLine(timeLine: StoryTimeLine){
    const index = nowStoryTimeLines.indexOf(timeLine)
    if(index >= 0) nowStoryTimeLines.splice(index, 1)
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

export function createTimeLineSegment(timeLine: StoryTimeLine, setting?: Pick<TimeLineSegment, "name" | "timeRuleKey" | "unit" | "length" | "unitWidth">){
    const segment: TimeLineSegment = {
        __key: nanoid(), name: setting?.name || "新时间片段", timeRuleKey: setting?.timeRuleKey ?? "date", unit: setting?.unit ?? "日", length: Math.max(1, setting?.length ?? 50), unitWidth: Math.max(8, setting?.unitWidth ?? 24),
        position: { x: timeLine.segments.length * 40, y: timeLine.segments.length * 32 }, nodes: [],
    }
    timeLine.segments.push(segment)
    return segment
}

export function expandSegment(segment: TimeLineSegment, direction: "start" | "end"){
    if(direction === "start"){
        segment.position.x -= 50 * segment.unitWidth
        segment.nodes.forEach((node) => {
            node.start += 50
            if(node.end != null) node.end += 50
        })
    }
    segment.length += 50
}

export function createTimeLineNode(segment: TimeLineSegment, setting: Pick<TimeLineNode, "label" | "start" | "offsetY"> & Pick<TimeLineNode, "end" | "target"> = { label: "新事件", start: 0, offsetY: 8 }){
    const node: TimeLineNode = { __key: nanoid(), ...setting }
    segment.nodes.push(node)
    return node
}
