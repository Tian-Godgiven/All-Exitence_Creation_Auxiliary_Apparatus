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
        @click="showInfo">
        <!-- 引用属性值 -->
        <statusValueVue :disabled="true" class="statusValue"></statusValueVue>
    </div>
    
    <div class="quotePart" v-else-if="part && valueType == 'quotePart'"
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
    import { computed, inject,provide, reactive } from 'vue';
    import statusValueVue from './statusValue.vue';
    import { countExpression, getExpressionText, getQuotePart, getQuoteStatus } from '@/hooks/expression/multiStatusValue';
    import { showQuickInfo } from '@/api/showQuickInfo';
    import { getTypeStatusByKey } from '@/hooks/all-exitence/allExitence';

    const {part} = defineProps(["part","index"])
    const parts = inject<any>("parts")
    const allStatus = inject<any>("allStatus") //该显示对象的所有属性
    const allTypeStatus = inject<any>("allTypeStatus") //该显示对象所在的分类的所有属性
    let status:any//提供给属性值组件的属性目标
    let typeStatus:any//提供给属性值组件属性
    let targetPart:any//提供给引用part组件的part目标
    let expressionValue:any//表达式的值
    const valueType = part.valueType//部分的类型

    //part为属性值时，提供part的值
    if(valueType == "statusValue"){
        status = reactive(part.value)
    }
    //part为引用属性时，提供目标属性和其对应的分类属性
    else if(valueType == "quoteStatus"){
        //获取并提供目标属性
        status = getQuoteStatus(allStatus,part.value)
        typeStatus = getTypeStatusByKey(status.__key,allTypeStatus)
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

    provide("status",status)
    provide("typeStatus",typeStatus)

    //显示引用属性，引用部分，表达式的信息
    function showInfo(event:any){
        //根据类型显示的信息
        let infoText = "无内容"
        if(valueType == "quoteStatus"){
            infoText = "引用属性:"+(status.name??typeStatus.name)
        }
        else if(valueType == "quotePart"){
            infoText = "引用部分:"+targetPart.__key
        }
        else if(valueType == "expression"){
            infoText = getExpressionText(allStatus,allTypeStatus,part.value)
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