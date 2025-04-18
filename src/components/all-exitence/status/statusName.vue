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
import textAreaVue from '@/components/other/textArea/textArea.vue';
import { ref,watch } from 'vue';
    let {status,typeStatus={setting:{}},disabled=false} = defineProps(["status","typeStatus","disabled"])
    const ifDisabled = ref(disabled)
    //实际要显示的名称
    const name = ref(status.name || typeStatus?.name)
    //监听属性设置的变化
    watch(()=>status?.setting,()=>{
        const setting = {...typeStatus.setting, ...status?.setting}
        //属性设置：代替属性名显示，默认为false
        const tmp1 = setting.value?.insteadOfName || false
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
        width: 4rem;
        box-sizing: border-box;
    }
    .separator{
        min-width: 1rem;
    }
</style>