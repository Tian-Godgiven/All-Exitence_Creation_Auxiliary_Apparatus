<template>
<div class="quoteStatus" 
    ref="selfRef"
    @click="onClick">
    <!-- 引用属性值 -->
    <div class="error" v-if="!result">
        错误：无内容
    </div>
    <StatusValue class="statusValue" v-else
        :target
        :status="result.status" :fullStatus="result.fullStatus"
        :disabled="true" />
</div>
</template>

<script setup lang='ts'>
    import StatusValue from '../../../StatusValue.vue';
    import { Exitence } from '@/class/Exitence';
    import { computed } from 'vue';
    import { getQuoteStatus, MultiStatusPart } from '@/hooks/expression/multiStatusValue';
    import { Type } from '@/class/Type';
    const {showInfo,part,target} = defineProps<{
        showInfo:(e:Event,text:string)=>void
        part:MultiStatusPart
        target:Exitence|Type
    }>()
    //获取并提供目标属性 
    const result = computed(()=>{
        const tmp = getQuoteStatus(target,part.value)
        return tmp
    })
    function onClick(e:MouseEvent){
        let text:string
        if(result.value === false){
            text="错误：未能获取引用的目标属性"
        }
        else{
            text = "引用属性:"+ result.value.fullStatus.name
        }
        showInfo(e,text)
    }
</script>

<style scoped lang='scss'>
.quoteStatus{
    .error{
        border-radius: 10px;
        background-color: rgb(209, 69, 69);
        color: black;
    }
    .statusValue{
        width: auto !important;
    }
}

</style>