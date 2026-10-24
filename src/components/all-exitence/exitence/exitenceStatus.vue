<template>
<!-- 显示属性 -->
<LongTap :duration="700" :wait-after="500" :long-tap="longTap" :key="key" class="exitenceStatus" :class="{noLabel:ifNoName}">
    <StatusName v-if="!ifNoName" :status :fullStatus :disabled="true" class="label"></StatusName>
    <!-- 属性值 -->
    <StatusValue :target="exitence" :status :fullStatus :disabled class="value"/>
</LongTap> 
</template>

<script setup lang='ts'>
    import { computed, ref} from 'vue';
    import StatusName from '../status/statusName.vue';
    import StatusValue from '../status/StatusValue.vue';
    import { Exitence, ExitenceStatus } from '@/class/Exitence';
    import LongTap from '@/components/other/LongTap.vue';
    import { showEditStatusPopUp } from '@/hooks/all-exitence/status';
    import Status from '@/interfaces/Status';
    import { showControlPanel } from '@/hooks/controlPanel';

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
    function longTap(position?:{x:number,y:number}){
        //禁用状态下无效
        if(disabled)return
        showControlPanel({
            title:`属性：${fullStatus.name}`,
            option:[{
                text:'编辑属性',
                click:()=>showEditStatusPopUp({
                    target:exitence,
                    status,
                    fullStatus,
                    returnValue:(newStatus:ExitenceStatus)=>{
                        Object.assign(status,newStatus)
                        key.value+=1
                    }
                })
            }]
        },position)
    }
</script>

<style scoped lang='scss'>
    .exitenceStatus{
		display: grid;
		grid-template-columns: max-content minmax(0, 1fr);
		align-items: center;
		gap: 12px;
		.label{ min-width: 0; }
		.value{ min-width: 0; }
		&.noLabel{ grid-template-columns: minmax(0, 1fr); }
	}
	@media (max-width: 899px){
		.exitenceStatus{
			grid-template-columns: minmax(0, 1fr);
			gap: 4px;
		}
	}
</style>
