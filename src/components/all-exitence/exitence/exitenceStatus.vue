<template>
<!-- 显示属性 -->
<LongTap :duration="700" :wait-after="500" :long-tap="longTap" :key="key" class="exitenceStatus">
    <StatusName v-if="!ifNoName" :status :fullStatus :disabled="true"></StatusName>
    <!-- 属性值 -->
    <StatusValue :status :fullStatus :disabled class="value"/>
</LongTap> 
</template>

<script setup lang='ts'>
    import { computed, ref} from 'vue';
    import StatusName from '../status/StatusName.vue';
    import StatusValue from '../status/StatusValue.vue';
    import { Exitence, ExitenceStatus } from '@/class/Exitence';
    import LongTap from '@/components/other/LongTap.vue';
import { showEditStatusPopUp } from '@/hooks/all-exitence/status';
import Status from '@/interfaces/Status';

    let {disabled,status,fullStatus,exitence} = defineProps<{
        disabled?:boolean;
        status:ExitenceStatus;
        fullStatus:Status;
        exitence:Exitence
    }>()
    const key = ref(0)

    //属性设置：在事物中不显示属性名
    const ifNoName = computed(()=>{
        const setting = fullStatus.setting
        const tmp2 = setting?.noStatusNameInExitence
        if(tmp2 == true){
            return true
        }
        return false
    })
    //长按更新属性
    function longTap(){
        //禁用状态下无效
        if(disabled)return
        showEditStatusPopUp({
            status,
            fullStatus,
            returnValue:(newStatus:ExitenceStatus)=>{
                Object.assign(status,newStatus)
                //手动更新这个div
                key.value+=1
            }
        })
    }
</script>

<style scoped lang='scss'>
    .exitenceStatus{
		display: flex;
	}
</style>