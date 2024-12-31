import { isReactive, isRef } from "vue";

export function getVueValue(target:any){
    if (isRef(target)) {
        return target.value;  // 对于 ref 类型，使用 .value 获取值
    } else if ('get' in target) {
        return target.value;  // 对于 computed 类型，直接使用 .value
    } else if (isReactive(target)) {
        return target;  // 对于 reactive 对象，直接返回对象本身
    } else {
        return target;  // 普通对象直接返回
    }
}