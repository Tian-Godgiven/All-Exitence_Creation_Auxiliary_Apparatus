<template>
<div class="quoteStatus" 
    ref="selfRef"
    @click="showInfo">
    <!-- 引用属性值 -->
    <StatusValue :status :fullStatus
        :disabled="true" class="statusValue"/>
</div>
</template>

<script setup lang='ts'>
    import StatusValue from '../../../StatusValue.vue';
import { ExitenceStatus } from '@/class/Exitence';
import Status from '@/interfaces/Status';
import { useTemplateRef } from 'vue';
import { showMultiStatusPartInfo } from '../multiStatus';
    const {status,fullStatus} = defineProps<{
        status:Status|ExitenceStatus,
        fullStatus:Status
    }>()
    const selfRef = useTemplateRef("selfRef")
    function showInfo(){
        if(!selfRef.value)return;
        //根据类型显示的信息
        let infoText = "引用属性:"+ fullStatus.name
        // 获取触发事件的元素的位置信息
        const rect = selfRef.value.getBoundingClientRect();
        showMultiStatusPartInfo(rect,infoText)
    }
</script>

<style scoped lang='scss'>

</style>