<template>
<div class="quotePart" 
    @click="onClick">
    <!-- 引用部分 -->
    <multiPartValueVue :part="targetPart"></multiPartValueVue>
</div>
</template>

<script setup lang='ts'>
import { showAlert } from '@/hooks/alert';
import { getQuotePart, MultiStatusPart } from '@/hooks/expression/multiStatusValue';
import { nanoid } from 'nanoid';
import { computed } from 'vue';
    const {showInfo,part,parts} = defineProps<{
        showInfo:(e:Event,text:string)=>void
        part:MultiStatusPart
        parts:MultiStatusPart[]
    }>()
    const targetPart = computed<MultiStatusPart>(()=>{
        const tmp = getQuotePart(parts,part)
        if(!tmp){
            showAlert({
                info:"发生了一个错误：所引用的目标部分不存在。",
                confirm:()=>{}
            })
            return {
                value:"错误：引用目标不存在",
                valueType:"string",
                __key:nanoid()
            }
        }
        return tmp
    })
    function onClick(event:MouseEvent){
        const infoText = "引用部分:"+targetPart.value.__key
        showInfo(event,infoText)
    }
</script>

<style scoped lang='scss'>

</style>