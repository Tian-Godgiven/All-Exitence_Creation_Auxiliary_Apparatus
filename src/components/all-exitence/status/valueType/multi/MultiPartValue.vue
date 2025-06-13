<template>
     <!-- 换行 -->
    <br class="trigger" v-if="valueType == 'enterLine'"/>

    <MultiValueStatus 
        :showInfo
        :part
        :target
        v-else-if="valueType == 'statusValue'"/>
    <MultiValueQuoteStatus class="quoteValue" 
        :showInfo
        :part
        :target
        v-else-if="valueType == 'quoteStatus'"/>
    <MultiValueQuotePart  class="quoteValue"
        :showInfo
        :part
        :parts
        :target
        v-else-if="part && valueType == 'quotePart'"/>
    <MultiValueMultiExpression 
        :showInfo
        :part
        :parts
        :target
        v-else-if="valueType == 'expression'"/>
    <div v-else-if="valueType == 'text'" :class="valueType" >
        <!-- 文本 -->
        {{ part.value }}
    </div>
</template>

<!-- 给组件命名用于递归调用 -->
<script lang="ts">
    export default {
        name: 'multiPartValueVue' 
    }
</script>

<script setup lang='ts'>
    import { MultiStatusPart } from '@/hooks/expression/multiStatusValue';
    import MultiValueQuoteStatus from './partValue/MultiValueQuoteStatus.vue';
    import MultiValueStatus from './partValue/MultiValueStatus.vue';
    import { showMultiStatusPartInfo } from './multiStatus';
    import MultiValueQuotePart from './partValue/MultiValueQuotePart.vue';
    import MultiValueMultiExpression from './partValue/MultiValueMultiExpression.vue';
    import { Type } from '@/class/Type';
    import { Exitence } from '@/class/Exitence';
import { computed } from 'vue';

    const {part,parts,target} = defineProps<{
        part:MultiStatusPart,
        parts:MultiStatusPart[],
        target:Exitence|Type
    }>()

    const valueType = computed(()=>{
       return part.valueType
    })//部分的类型

    //显示引用属性，引用部分，表达式的信息
    function showInfo(event:any,text:string="无内容"){
        // 获取触发事件的元素的位置信息
        const rect = event.target.getBoundingClientRect();
        showMultiStatusPartInfo(rect,text)
    }
    
</script>

<style scoped lang='scss'>
// 引用属性不可交互
.quoteValue{
    position: relative;
    overflow: visible;
    >*{
        color: rgb(61, 61, 61) !important;
        pointer-events: none !important;
    }
}
.multiExpression{
    color: rgb(61, 61, 61) !important;
}
</style>