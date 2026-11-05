<template>
<div class="statusLabel">
    <div class="statusName">
        <textAreaVue
            v-if="!ifDisabled"
            mode="string"
            v-model="name"
            placeholder="属性名"/>
        <div v-else>{{ name }}</div>
    </div>
    <span class="separator">：</span>
</div>
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
    .statusLabel{
        display: flex;
        align-items: flex-start;
        align-self: start;
		min-height: 40px;
        flex: 0 1 auto;
        width: fit-content;
        max-width: 100%;
        min-width: 0;
        .statusName{
		align-self: center;
            min-width: 0;
            flex: 0 1 auto;
            width: fit-content;
            max-width: calc(100% - 1rem);
            overflow-wrap: anywhere;
            :deep(.textArea){
                width: auto;
                min-width: 4em;
            }
        }
        .separator{
		align-self: center;
            flex: 0 0 auto;
        }
    }
</style>
