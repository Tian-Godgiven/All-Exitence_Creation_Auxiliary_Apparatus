import { Component, shallowRef } from "vue"
import type { Icon } from "@/static/list/iconList"

export type MainToolPageAction = {
    name: string,
    click: () => void,
    icon?: Icon,
}

export type MainToolPage = {
    name: string,
    component: Component,
    props?: Record<string, unknown>,
    actions?: MainToolPageAction[],
    onClose?: () => void,
}

// 工具层覆盖主内容区，底层页面保持挂载以保留编辑和滚动状态。
export const activeMainToolPage = shallowRef<MainToolPage | null>(null)

export function openMainToolPage(toolPage: MainToolPage){
    activeMainToolPage.value = toolPage
}

export function closeMainToolPage(){
    const toolPage = activeMainToolPage.value
    activeMainToolPage.value = null
    toolPage?.onClose?.()
}
