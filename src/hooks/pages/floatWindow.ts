import { nanoid } from "nanoid";
import { Component, ref, ShallowReactive, shallowRef } from "vue";

type FloatWindowItem = {
    vue:ShallowReactive<any>,
    __key:string
}
export const floatWindows = ref<FloatWindowItem[]>([])

//添加新的悬浮窗，返回指定的key
export function addFloatWindow(vue:Component){
    const __key = nanoid()
    const item:FloatWindowItem = {
        vue:shallowRef(vue),
        __key
    }
    floatWindows.value.push(item)
    return __key
}
//删除指定key的悬浮窗
export function deleteFloatWindow(__key:string){
    const itemIndex = floatWindows.value.findIndex((item)=>item.__key == __key)
    if(itemIndex>-1){
        floatWindows.value.splice(itemIndex,1)
        return true
    }
    return false
}