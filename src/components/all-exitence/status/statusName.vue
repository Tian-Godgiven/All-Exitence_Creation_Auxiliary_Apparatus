<template>
<div class="statusName">
    <textAreaVue
        v-if="!ifDisabled" 
        mode="string"
        v-model="status.name"
        placeholder="属性名"/>
    <div v-else>{{ name }}</div>
</div>
<div class="separator">：</div>
</template>

<script setup lang='ts'>
import { ExitenceStatus } from '@/class/Exitence';
import textAreaVue from '@/components/other/textArea/textArea.vue';
import Status from '@/interfaces/Status';
import { ref,watch } from 'vue';
    let {status,fullStatus,disabled=false} = defineProps<{
        status:Status|ExitenceStatus,
        fullStatus:Status,
        disabled?:boolean
    }>()
    const ifDisabled = ref(disabled)
    //实际要显示的名称
    const name = ref(fullStatus.name)
    //监听属性设置的变化
    watch(()=>status?.setting,()=>{
        const setting = fullStatus.setting
        //属性设置：代替属性名显示，默认为false
        const tmp1 = setting["insteadOfName"] || false
        if(tmp1 && tmp1.trim() != ""){
            ifDisabled.value = true
            name.value = tmp1
            return;
        }
        //初始化 
        ifDisabled.value = disabled
        
    },{
        immediate:true,
        deep:true
    })
    
</script>

<style scoped lang='scss'>
    .statusName{
        flex-shrink: 0;
        max-width: 4rem;
    }
    .separator{
        min-width: 1rem;
    }
</style>