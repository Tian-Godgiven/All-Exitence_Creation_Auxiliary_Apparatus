<template>
    
    <br class="trigger" v-if="valueType == 'enterLine'">
        <!-- 换行 -->
    </br>

    <statusValueVue class="statusValue"
        v-else-if="valueType == 'statusValue'">
        <!-- 属性值 -->
    </statusValueVue>
    
    <div class="quoteStatus" 
        v-else-if="valueType == 'quoteStatus'"
        @touchstart="showInfo">
        <!-- 引用属性值 -->
        <statusValueVue disabled="true" class="statusValue"></statusValueVue>
    </div>
    
    <div class="quotePart" v-else-if="part && valueType == 'quotePart'"
        @touchstart="showInfo">
        <!-- 引用部分 -->
        <multiPartValueVue :part="targetPart"></multiPartValueVue>
    </div>
    
    <div class="multiExpression" v-else-if="valueType == 'expression'"
        @touchstart="showInfo">
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
    import { computed, inject,onUnmounted,provide, reactive } from 'vue';
    import statusValueVue from './statusValue.vue';
    import { countExpression, getExpressionText, getQuotePart, getQuoteStatus } from '@/hooks/expression/multiStatusValue';
import { showQuickInfo } from '@/api/showQuickInfo';

    const {part} = defineProps(["part","index"])
    const parts = inject<any>("parts")
    const typeStatus = inject<any>("typeStatus")
    let status:any//提供给属性值组件的属性目标
    let targetPart:any//提供给引用part组件的part目标
    let expressionValue:any//表达式的值
    const valueType = part.valueType//部分的类型
    //part为属性值时，提供part的值
    if(valueType == "statusValue"){
        status = reactive(part.value)
    }
    //part为引用属性时，提供目标属性
    else if(valueType == "quoteStatus"){
        //获取目标属性
        const targetStatus = getQuoteStatus(typeStatus,part.value)
        //提供目标属性
        status = targetStatus
    }
    //part为引用部分时，递归寻找目标对象
    else if(valueType == "quotePart"){
        targetPart = getQuotePart(parts,part.value)
    }
    //part为表达式时，显示表达式的计算值
    else if(valueType == "expression"){
        //获得表达式的结果
        expressionValue = computed(()=>{
            const value = countExpression(typeStatus,parts,part.value)
            return value
        })
    }

    provide("status",status)

    //显示引用属性，引用部分，表达式的信息
    function showInfo(event:any){
        //根据类型显示的信息
        let infoText = "无内容"
        if(valueType == "quoteStatus"){
            infoText = "引用属性:"+status.name
        }
        else if(valueType == "quotePart"){
            infoText = "引用部分:"+targetPart.__key
        }
        else if(valueType == "expression"){
            infoText = getExpressionText(typeStatus,part.value)
        }
        // 获取触发事件的元素的位置信息
        const rect = event.target.getBoundingClientRect();
        const position = {
            top:`calc(${rect.top-4}px - 1rem)`,  // 设置 div 显示在元素上方
            left:`${rect.left + rect.width/2}`
        }
        showQuickInfo(infoText,{
            minWidth:"100px",
            height:"1rem",
            backgroundColor:"white",
            padding:"2px",
            border:"1px solid black",
            color:"rgb(61, 61, 61)"
        },position,true,5000)
    }

    
    

    
</script>

<style scoped lang='scss'>
    .statusValue{
        width: auto !important;
    }
    // 引用属性和引用部分不可交互
    .quoteStatus,.quotePart{
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