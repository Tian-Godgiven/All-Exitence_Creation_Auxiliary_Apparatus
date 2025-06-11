<template>
<div class="multiExpression" 
    @click="onClick">
    <!-- 表达式 -->
    {{ expressionValue }}
</div>
</template>

<script setup lang='ts'>
    import { Exitence } from '@/class/Exitence';
import { Type } from '@/class/Type';
import { countExpression, getExpressionText, MultiStatusPart } from '@/hooks/expression/multiStatusValue';
import { computed } from 'vue';
    const {showInfo,part,parts,target} = defineProps<{
        showInfo:(e:Event,text:string)=>void
        part:MultiStatusPart
        parts:MultiStatusPart[]
        target:Type|Exitence
    }>()
    
    //获得表达式的结果
    const expressionValue = computed(()=>{
        const value = countExpression(target,parts,part.value)
        return value
    })
    function onClick(event:MouseEvent){
        const infoText = getExpressionText(target,part.value)
        showInfo(event,infoText)
    }
    
</script>

<style scoped lang='scss'>

</style>