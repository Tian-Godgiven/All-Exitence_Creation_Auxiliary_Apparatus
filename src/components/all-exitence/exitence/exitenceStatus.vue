<template>
<!-- 显示属性 -->
<LongTap :duration="700" :wait-after="500" :long-tap="longTap" :key="key" class="exitenceStatus">
    <StatusName v-if="!ifNoName" :status="status" :typeStatus="typeStatus" :disabled="true"></StatusName>
    <!-- 属性值 -->
    <StatusValue :status="status" :typeStatus="typeStatus" :disabled="disabled" class="value"/>
</LongTap>
</template>

<script setup lang='ts'>
    import { computed, inject, ref} from 'vue';
    import StatusName from '../status/StatusName.vue';
    import StatusValue from '../status/StatusValue.vue';
    import { getTypeStatusByKey } from '@/hooks/all-exitence/allExitence';
    import Status from '@/interfaces/Status';
    import { showPopUp } from '@/hooks/pages/popUp';
import { ExitenceStatus } from '@/class/Exitence';
import LongTap from '@/components/other/LongTap.vue';

    let {disabled,status} = defineProps<{
        disabled?:boolean;
        status:ExitenceStatus
    }>()
    const key = ref(0)

    const type = inject<any>("type")
    //获取事物所在的分类的属性,若为额外属性则为空
	let typeStatus = getTypeStatusByKey(status.__key,type.typeStatus)

    //属性设置：在事物中不显示属性名
    const ifNoName = computed(()=>{
        const setting = {...typeStatus?.setting,...status?.setting}
        const tmp2 = setting?.noStatusNameInExitence
        if(tmp2 == true){
            return true
        }
        return false
    })


    
    const allStatus = inject("allStatus")
    const allTypeStatus = inject("allTypeStatus")
    //长按更新属性
    function longTap(){
        //禁用状态下无效
        if(disabled){
            return false
        }
        showPopUp({
            mask:false,
            vueName:"updateStatus",
            buttons:[],
            size:{
                height:"60%"
            },
            props:{
                status,
                typeStatus,
                allStatus,
                allTypeStatus
            },
            returnValue:(newStatus:Status)=>{
                Object.assign(status,newStatus)
                //更新这个div:有必要的！
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