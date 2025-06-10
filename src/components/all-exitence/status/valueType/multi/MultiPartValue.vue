<template>
     <!-- 换行 -->
    <br class="trigger" v-if="valueType == 'enterLine'"/>

    <MultiValueStatus :status :fullStatus 
        v-else-if="valueType == 'statusValue'"/>
    <MultiValueQuoteStatus :status :fullStatus class="quoteValue" 
        v-else-if="valueType == 'quoteStatus'"/>
    
    <div class="quoteValue" v-else-if="part && valueType == 'quotePart'"
        @click="showInfo">
        <!-- 引用部分 -->
        <multiPartValueVue :part="targetPart"></multiPartValueVue>
    </div>
    
    <div class="multiExpression" v-else-if="valueType == 'expression'"
        @click="showInfo">
        <!-- 表达式 -->
        {{ expressionValue }}
    </div>

    
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
    import { computed, inject, reactive } from 'vue';
    import { countExpression, getExpressionText, getQuotePart, getQuoteStatus } from '@/hooks/expression/multiStatusValue';
    import { getTypeStatusByKey } from '@/hooks/all-exitence/allExitence';
    import MultiValueQuoteStatus from './partValue/MultiValueQuoteStatus.vue';
import MultiValueStatus from './partValue/MultiValueStatus.vue';
import Status from '@/interfaces/Status';
import { ExitenceStatus } from '@/class/Exitence';
import { showMultiStatusPartInfo } from './multiStatus';

    //未完成：需要获取target的属性！ 
    const {part} = defineProps(["part","index"])
    const parts = inject<any>("parts")
    let status:Status|ExitenceStatus//提供给属性值组件的属性目标
    let fullStatus:Status//提供给属性值组件属性
    let targetPart:any//提供给引用part组件的part目标
    let expressionValue:any//表达式的值
    const valueType = part.valueType//部分的类型

    //part为属性值时，提供part的值
    if(valueType == "statusValue"){
        status = reactive(part.value)
    }
    //part为引用属性时，从事物中提供目标属性和其对应的完整属性
    else if(valueType == "quoteStatus"){
        //获取并提供目标属性
        status = getQuoteStatus(allStatus,part.value)
        fullStatus = getTypeStatusByKey(status.__key,allTypeStatus)
    }
    //part为引用部分时，递归寻找目标对象
    else if(valueType == "quotePart"){
        targetPart = getQuotePart(parts,part.value)
    }
    //part为表达式时，显示表达式的计算值
    else if(valueType == "expression"){
        //获得表达式的结果
        expressionValue = computed(()=>{
            const value = countExpression(allStatus,allTypeStatus,parts,part.value)
            return value
        })
    }

    //显示引用属性，引用部分，表达式的信息
    function showInfo(event:any){
        //根据类型显示的信息
        let infoText = "无内容"
        if(valueType == "quotePart"){
            infoText = "引用部分:"+targetPart.__key
        }
        else if(valueType == "expression"){
            infoText = getExpressionText(allStatus,allTypeStatus,part.value)
        }
        // 获取触发事件的元素的位置信息
        const rect = event.target.getBoundingClientRect();
        showMultiStatusPartInfo(rect,infoText)
    }

    
    

    
</script>

<style scoped lang='scss'>
    .statusValue{
        width: auto !important;
    }
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