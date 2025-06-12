<template>
<div class="statusName">
    <textAreaVue
        v-if="!ifDisabled" 
        mode="string"
        v-model="name"
        placeholder="属性名"/>
    <div v-else>{{ name }}</div>
</div>
<div class="separator">：</div>
</template>

<script setup lang='ts'>
import { ExitenceStatus } from '@/class/Exitence';
import textAreaVue from '@/components/other/textArea/textArea.vue';
import { getStatusSettingValue } from '@/hooks/all-exitence/status';
import Status from '@/interfaces/Status';
import { computed, ref } from 'vue';
    let {status,fullStatus,disabled=false} = defineProps<{
        status:Status|ExitenceStatus,
        fullStatus:Status,
        disabled?:boolean
    }>()
    //不允许编辑
    const ifDisabled = ref(disabled)
    //实际要显示的名称
    const name = computed({
        get:()=>{
            //属性设置：代替属性名显示，默认为false
            const insteadName = getStatusSettingValue(fullStatus.setting,"insteadOfName","string") ?? false
            if(insteadName){
                //禁止修改属性名
                ifDisabled.value = true
                name.value = insteadName
                return insteadName
            }
            return fullStatus.name
        },
        set:(newValue)=>{
            status.name = newValue
        }
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