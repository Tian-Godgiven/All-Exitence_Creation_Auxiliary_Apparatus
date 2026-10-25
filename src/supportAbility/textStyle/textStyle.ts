import { reactive, toRaw } from "vue"
import { cloneDeep } from "lodash"
import { addToRightPage } from "@/hooks/pages/rightPage"
import { openMainToolPage } from "@/hooks/pages/mainPage/toolPage"
import { tauriFeatureRepository } from "@/repository/tauriFeatureRepository"
import type { SupportAbilitySignUpItem } from "@/static/list/supportAbilityList"
import type { TextAreaContent, TextStyleBlurValue, TextStyleData, TextStyleDirection, TextStyleShakeDirection, TextStyleSnapshot, TextStyleShakeValue } from "@/hooks/expression/textAreaContent"
import { isTextStyleData, textStyleDirections } from "@/hooks/expression/textAreaContent"
import { mapArticle, nowAllArticles } from "@/hooks/all-articles/allArticles"
import TextStyleLibrary from "./TextStyleLibrary.vue"

type TextStyleMaterialBase = {
    __key: string,
    name: string,
}
export type TextStyleMaterial =
    | (TextStyleMaterialBase & { effect: "fontWeight", snapshot: Extract<TextStyleSnapshot,{ effect: "fontWeight" }> })
    | (TextStyleMaterialBase & { effect: "italic", snapshot: Extract<TextStyleSnapshot,{ effect: "italic" }> })
    | (TextStyleMaterialBase & { effect: "color", snapshot: Extract<TextStyleSnapshot,{ effect: "color" }> })
    | (TextStyleMaterialBase & { effect: "shake", snapshot: Extract<TextStyleSnapshot,{ effect: "shake" }> })
    | (TextStyleMaterialBase & { effect: "blur", snapshot: Extract<TextStyleSnapshot,{ effect: "blur" }> })
    | (TextStyleMaterialBase & { effect: "offset", snapshot: Extract<TextStyleSnapshot,{ effect: "offset" }> })

const globalFeatureKey = "text-style-materials"
const defaultMaterials: TextStyleMaterial[] = [
    { __key: "bold", name: "加粗", effect: "fontWeight", snapshot: { effect: "fontWeight", name: "加粗", value: 700 } },
    { __key: "italic", name: "斜体", effect: "italic", snapshot: { effect: "italic", name: "斜体", value: true } },
    { __key: "color", name: "颜色", effect: "color", snapshot: { effect: "color", name: "颜色", value: "#b44b4b" } },
    { __key: "shake", name: "抖动", effect: "shake", snapshot: { effect: "shake", name: "抖动", value: { strength: 3.5, frequency: 5.5, regularity: 70, synchronized: true, directions: textStyleDirections.map(item=>item.value) } } },
    { __key: "blur", name: "模糊", effect: "blur", snapshot: { effect: "blur", name: "模糊", value: { amount: 1, startAmount: 0, progressive: false, direction: "right", center: 50 } } },
    { __key: "offset", name: "错位", effect: "offset", snapshot: { effect: "offset", name: "错位", value: 3 } },
]

export const nowTextStyleMaterials = reactive<TextStyleMaterial[]>(cloneDeep(defaultMaterials))
let canSaveMaterials = false

export const textStyleSignUpItem: SupportAbilitySignUpItem = {
    name: "textStyle",
    init: async () => {
        const data = await tauriFeatureRepository.loadGlobal<TextStyleMaterial[]>(globalFeatureKey)
        nowTextStyleMaterials.splice(0,nowTextStyleMaterials.length,...cloneDeep(normalizeMaterials(data)))
        if(data === null) await tauriFeatureRepository.saveGlobal(globalFeatureKey,cloneDeep(defaultMaterials))
        canSaveMaterials = true
        addToRightPage({ key: "text-style-library", name: "文字素材库", icon: "manage", click: showTextStyleLibrary })
    },
}

export function showTextStyleLibrary(){ openMainToolPage({ name: "文字素材库", component: TextStyleLibrary }) }

export async function saveTextStyleMaterials(){
    if(!canSaveMaterials)return
    await tauriFeatureRepository.saveGlobal(globalFeatureKey,cloneDeep(toRaw(nowTextStyleMaterials)))
}

export function snapshotFromMaterial(material: TextStyleMaterial): TextStyleSnapshot{
    const snapshot = cloneDeep(material.snapshot)
    if(snapshot.effect === "shake")snapshot.value = normalizeShakeValue(snapshot.value)
    if(snapshot.effect === "blur")snapshot.value = normalizeBlurValue(snapshot.value)
    return snapshot
}

export function countMaterialUsage(materialKey: string): number{
    let count = 0
    mapArticle(nowAllArticles,(article)=>{
        count += countMaterialInContent(article.inner,materialKey)
    })
    return count
}

export function syncMaterialInCurrentProject(material: TextStyleMaterial): number{
    let count = 0
    mapArticle(nowAllArticles,(article)=>{
        const replaced = replaceMaterialInContent(article.inner,material)
        if(replaced){
            count += replaced
            article.updateTime = Date.now()
        }
    })
    return count
}

function countMaterialInContent(content: unknown,materialKey: string): number{
    if(!Array.isArray(content))return 0
    return content.reduce((count,part)=>{
        if(!isTextStyleData(part))return count
        return count + (part.materialKey === materialKey ? 1 : 0) + countMaterialInContent(part.content,materialKey)
    },0)
}

function replaceMaterialInContent(content: unknown,material: TextStyleMaterial): number{
    if(!Array.isArray(content))return 0
    let count = 0
    for(const part of content as TextAreaContent[]){
        if(!isTextStyleData(part))continue
        if(part.materialKey === material.__key){
            part.snapshot = snapshotFromMaterial(material)
            count += 1
        }
        count += replaceMaterialInContent(part.content,material)
    }
    return count
}

function normalizeMaterials(data: TextStyleMaterial[] | null): TextStyleMaterial[]{
    if(!Array.isArray(data) || data.length === 0)return cloneDeep(defaultMaterials)
    const byKey = new Map(data.filter(item=>item && typeof item.__key === "string" && item.snapshot?.effect && item.snapshot?.name).map(item=>[item.__key,item]))
    return defaultMaterials.map(defaultMaterial=>{
        const material = byKey.get(defaultMaterial.__key)
        if(!material || material.snapshot.effect !== defaultMaterial.effect)return cloneDeep(defaultMaterial)
        const snapshot = { ...material.snapshot, effect: defaultMaterial.effect, name: defaultMaterial.name } as TextStyleSnapshot
        if(snapshot.effect === "blur")snapshot.value = normalizeBlurValue(snapshot.value)
        if(snapshot.effect === "shake")snapshot.value = normalizeShakeValue(snapshot.value)
        return { ...defaultMaterial, snapshot } as TextStyleMaterial
    }) as TextStyleMaterial[]
}

export function makeTextStyleData(material: TextStyleMaterial,content: TextAreaContent[]): TextStyleData{
    return { type: "textStyle", materialKey: material.__key, snapshot: snapshotFromMaterial(material), content }
}

export function normalizeTextStyleSnapshot(snapshot: TextStyleSnapshot): TextStyleSnapshot{
    const next = cloneDeep(snapshot)
    if(next.effect === "shake")next.value = normalizeShakeValue(next.value)
    if(next.effect === "blur")next.value = normalizeBlurValue(next.value)
    return next
}

function normalizeShakeValue(value: TextStyleShakeValue): TextStyleShakeValue{
    const next = { ...value, strength: Math.max(0,Number(value.strength) || 0), frequency: Math.min(15,Math.max(0.5,Number(value.frequency) || 5.5)), regularity: Math.min(100,Math.max(0,Number(value.regularity) || 0)) }
    const directions = Array.isArray(next.directions) ? next.directions.filter(direction=>textStyleDirections.some(item=>item.value === direction)) : []
    const enabledDirections = directions.length ? directions : textStyleDirections.map(item=>item.value)
    const path = createShakePath(next.regularity,next.synchronized,enabledDirections)
    if(next.synchronized)return { ...next, directions:enabledDirections, phase: 0, path }
    return {
        ...next,
        directions:enabledDirections,
        phase: -(Math.random() * 0.32),
        path,
    }
}

function createShakePath(regularity:number,synchronized:boolean,directions:TextStyleDirection[]): TextStyleShakeDirection[]{
    const irregularity = 1 - regularity / 100
    const allowed = textStyleDirections.filter(item=>directions.includes(item.value))
    return Array.from({ length:8 },(_,index)=>{
        const direction = allowed[index % allowed.length]
        const roll = synchronized ? ((index * 37 + 17) % 100) / 100 : Math.random()
        const selected = roll >= irregularity ? direction : allowed[synchronized ? (index * 5 + 3) % allowed.length : Math.floor(Math.random() * allowed.length)]
        return { x:selected.x, y:selected.y }
    })
}

function normalizeBlurValue(value: TextStyleBlurValue | number): TextStyleBlurValue{
    const raw = typeof value === "number" ? { amount:value } : value ?? { amount:0 }
    const candidate = raw as Partial<TextStyleBlurValue>
    const direction = textStyleDirections.some(item=>item.value === candidate.direction) ? candidate.direction as TextStyleDirection : "right"
    return { amount:Math.min(6,Math.max(0,Number(candidate.amount) || 0)), startAmount:Math.min(6,Math.max(0,Number(candidate.startAmount) || 0)), progressive:!!candidate.progressive, direction, center:Math.min(100,Math.max(0,Number(candidate.center ?? 50))) }
}
