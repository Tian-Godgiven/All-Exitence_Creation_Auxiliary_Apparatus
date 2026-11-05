import { reactive, shallowRef, toRaw, watch } from "vue"
import { cloneDeep } from "lodash"
import { nanoid } from "nanoid"
import { addToRightPage } from "@/hooks/pages/rightPage"
import { addFloatWindow } from "@/hooks/pages/floatWindow"
import { openMainToolPage } from "@/hooks/pages/mainPage/toolPage"
import type { TextAreaContent } from "@/hooks/expression/textAreaContent"
import type { ProjectFeature } from "@/repository/projectFeature"
import type { SupportAbilitySignUpItem } from "@/static/list/supportAbilityList"
import { tauriFeatureRepository } from "@/repository/tauriFeatureRepository"
import { nowProjectPath } from "@/hooks/project/project"
import QuickDraftPage from "./QuickDraftPage.vue"
import QuickDraftFloat from "./QuickDraftFloat.vue"
import QuickDraftSettings from "./QuickDraftSettings.vue"
import QuickDraftManual from "./QuickDraftManual.vue"

export type QuickDraftNote = {
    __key: string,
    kind: "text" | "note",
    text: string,
    inner: TextAreaContent[],
    colorKey: string | null,
    position: { x: number, y: number },
    size: { width: number, height: number },
    updatedAt: number,
}

export type QuickDraftColor = { __key: string, name: string, value: string }

export type QuickDraftConnection = { __key: string, from: string, to: string }

export type QuickDraftBoard = {
    showInLeft: boolean,
    notes: QuickDraftNote[],
    connections: QuickDraftConnection[],
    viewport: { x: number, y: number, scale: number },
}

const defaultBoard: QuickDraftBoard = { showInLeft: true, notes: [], connections: [], viewport: { x: 0, y: 0, scale: 1 } }
const defaultColors: QuickDraftColor[] = [
    { __key: "yellow", name: "黄色", value: "#d5a928" },
    { __key: "blue", name: "蓝色", value: "#5289b9" },
    { __key: "green", name: "绿色", value: "#67a875" },
    { __key: "pink", name: "粉色", value: "#c77194" },
]
export const nowQuickDraftBoard = reactive<QuickDraftBoard>(cloneDeep(defaultBoard))
export const nowGlobalQuickDraftBoard = reactive<QuickDraftBoard>(cloneDeep(defaultBoard))
export const nowQuickDraftColors = reactive<QuickDraftColor[]>(cloneDeep(defaultColors))
const globalFeatureKey = "quick-draft-inbox"
let canSaveGlobalBoard = false
let globalSaveTimer: ReturnType<typeof setTimeout> | null = null
const remoteProjectBoards = new Map<string, QuickDraftBoard>()
const remoteProjectSaveTimers = new Map<string, ReturnType<typeof setTimeout>>()
let quickDraftFloatWindowKey: string | null = null
type GlobalQuickDraftData = { board: QuickDraftBoard, colors: QuickDraftColor[] }

export const quickDraftProjectFeature: ProjectFeature<QuickDraftBoard> = {
    key: "quick-draft",
    createDefault: () => cloneDeep(defaultBoard),
    load: (data) => {
        // The former linear quick-draft format is intentionally not migrated.
        Object.assign(nowQuickDraftBoard, cloneDeep(normalizeBoard(data)))
    },
    snapshot: () => cloneDeep(toRaw(nowQuickDraftBoard)),
}

export const quickDraftItem: SupportAbilitySignUpItem = {
    name: "quickDraft",
    init: async () => {
        const data = normalizeGlobalData(await tauriFeatureRepository.loadGlobal<GlobalQuickDraftData | QuickDraftBoard>(globalFeatureKey))
        Object.assign(nowGlobalQuickDraftBoard, cloneDeep(data.board))
        nowQuickDraftColors.splice(0, nowQuickDraftColors.length, ...cloneDeep(data.colors))
        canSaveGlobalBoard = true
        addToRightPage({ key: "quick-draft", name: "便签夹", icon: "quickDraft", click: showQuickDraftPage })
        if(!quickDraftFloatWindowKey) quickDraftFloatWindowKey = addFloatWindow(QuickDraftFloat)
    },
    projectEntry: { name: "项目便签", icon: "quickDraft", click: showQuickDraftPage, isVisible: () => nowQuickDraftBoard.showInLeft, setVisible: visible => { nowQuickDraftBoard.showInLeft = visible } },
}

export function showQuickDraftPage(){ openMainToolPage({ name: "便签夹", component: QuickDraftPage, actions: [{ name: "操作提示", icon: "help", click: showQuickDraftManual }, { name: "设置", icon: "setting", click: showQuickDraftSettings }] }) }
export async function showQuickDraftSettings(){
    const { showPopUp } = await import("@/hooks/pages/popUp")
    showPopUp({ name: "项目便签设置", vue: shallowRef(QuickDraftSettings), mask: true, size: { height: "auto" } })
}
export async function showQuickDraftManual(){
    const { showPopUp } = await import("@/hooks/pages/popUp")
    showPopUp({ name: "便签夹使用手册", vue: shallowRef(QuickDraftManual), mask: true, size: { width: "500px", height: "auto" } })
}

export function createQuickDraftNote(position = { x: 80, y: 80 }){
    return createQuickDraftNoteOnBoard(nowQuickDraftBoard, [""], position)
}

export function createQuickDraftNoteOnBoard(board: QuickDraftBoard, inner: TextAreaContent[], position = { x: 80, y: 80 }, colorKey = nowQuickDraftColors[0]?.__key ?? null){
    const note: QuickDraftNote = {
        __key: nanoid(), kind: "note", text: "", inner: cloneDeep(toRaw(inner)), colorKey, position, size: { width: 240, height: 150 }, updatedAt: Date.now(),
    }
    board.notes.push(note)
    return note
}
export function createQuickDraftTextOnBoard(board: QuickDraftBoard, position = { x: 80, y: 80 }){
    const note: QuickDraftNote = {
        __key: nanoid(), kind: "text", text: "", inner: [""], colorKey: null, position, size: { width: 0, height: 0 }, updatedAt: Date.now(),
    }
    board.notes.push(note)
    return note
}

export function deleteQuickDraftNote(note: QuickDraftNote){
    const index = nowQuickDraftBoard.notes.indexOf(note)
    if(index >= 0) nowQuickDraftBoard.notes.splice(index, 1)
    nowQuickDraftBoard.connections = nowQuickDraftBoard.connections.filter(connection => connection.from !== note.__key && connection.to !== note.__key)
}

export function createQuickDraftConnection(board: QuickDraftBoard, from: QuickDraftNote, to: QuickDraftNote){
    const exists = board.connections.some(connection =>
        (connection.from === from.__key && connection.to === to.__key) ||
        (connection.from === to.__key && connection.to === from.__key))
    if(!exists) board.connections.push({ __key: nanoid(), from: from.__key, to: to.__key })
}

export function moveGlobalQuickDraftNote(note: QuickDraftNote, targetProjectKey: string){
    const relatedConnections = nowGlobalQuickDraftBoard.connections.filter(connection => connection.from === note.__key || connection.to === note.__key)
    return { relatedConnections, move: async () => {
        const target = normalizeBoard(await tauriFeatureRepository.load<QuickDraftBoard>(targetProjectKey, "quick-draft"))
        const copiedNote = cloneDeep(toRaw(note))
        if(!target.notes.some(item => item.__key === copiedNote.__key)) target.notes.push(copiedNote)
        await tauriFeatureRepository.save(targetProjectKey, "quick-draft", target)
        if(nowProjectPath.value === targetProjectKey && !nowQuickDraftBoard.notes.some(item => item.__key === copiedNote.__key)) nowQuickDraftBoard.notes.push(copiedNote)
        const cachedTarget = remoteProjectBoards.get(targetProjectKey)
        if(cachedTarget && !cachedTarget.notes.some(item => item.__key === copiedNote.__key)) cachedTarget.notes.push(copiedNote)
        nowGlobalQuickDraftBoard.notes.splice(nowGlobalQuickDraftBoard.notes.indexOf(note), 1)
        nowGlobalQuickDraftBoard.connections = nowGlobalQuickDraftBoard.connections.filter(connection => !relatedConnections.includes(connection))
        await saveGlobalBoard()
    } }
}

export async function loadQuickDraftProjectBoard(projectKey: string){
    if(nowProjectPath.value === projectKey) return nowQuickDraftBoard
    const cached = remoteProjectBoards.get(projectKey)
    if(cached) return cached
    const board = reactive<QuickDraftBoard>(cloneDeep(normalizeBoard(await tauriFeatureRepository.load<QuickDraftBoard>(projectKey, "quick-draft"))))
    remoteProjectBoards.set(projectKey, board)
    watch(board, () => {
        const timer = remoteProjectSaveTimers.get(projectKey)
        if(timer) clearTimeout(timer)
        remoteProjectSaveTimers.set(projectKey, setTimeout(() => {
            remoteProjectSaveTimers.delete(projectKey)
            void tauriFeatureRepository.save(projectKey, "quick-draft", cloneDeep(toRaw(board)))
        }, 400))
    }, { deep: true })
    return board
}

function normalizeBoard(board: QuickDraftBoard | null | undefined): QuickDraftBoard{
    const raw = board as any
    return {
        showInLeft: raw?.showInLeft !== false,
        notes: (raw?.notes ?? []).map((note: any) => {
            const { tags: _tags, color: oldColor, ...rest } = note
            return {
                ...rest,
                kind: note.kind === "text" ? "text" : "note",
                text: typeof note.text === "string" ? note.text : "",
                inner: Array.isArray(note.inner) ? note.inner : [""],
                colorKey: typeof note.colorKey === "string" ? note.colorKey : typeof oldColor === "string" ? oldColor : null,
                size: note.size ?? { width: 240, height: 150 },
            }
        }),
        connections: raw?.connections ?? [],
        viewport: raw?.viewport ?? cloneDeep(defaultBoard.viewport),
    }
}
function normalizeGlobalData(data: GlobalQuickDraftData | QuickDraftBoard | null): GlobalQuickDraftData{
    const raw = data as any
    if(raw?.board) return { board: normalizeBoard(raw.board), colors: Array.isArray(raw.colors) ? raw.colors : cloneDeep(defaultColors) }
    return { board: normalizeBoard(raw), colors: cloneDeep(defaultColors) }
}
async function saveGlobalBoard(){ await tauriFeatureRepository.saveGlobal(globalFeatureKey, { board: cloneDeep(toRaw(nowGlobalQuickDraftBoard)), colors: cloneDeep(toRaw(nowQuickDraftColors)) }) }

watch([nowGlobalQuickDraftBoard, nowQuickDraftColors], () => {
    if(!canSaveGlobalBoard) return
    if(globalSaveTimer) clearTimeout(globalSaveTimer)
    globalSaveTimer = setTimeout(() => { globalSaveTimer = null; void saveGlobalBoard() }, 400)
}, { deep: true })
