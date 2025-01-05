<template>
    <div>
        <!-- 显示属性 -->
        <div :key="key" class="exitenceStatus" v-touch:longtap="showUpdateStatus">
            <div class="name">
                {{ statusName }}
            </div>
            <div class="separator">：</div>
            <!-- 属性值 -->
            <statusValueVue :status="status" :typeStatus="typeStatus" :disabled="disabled" class="value"></statusValueVue>
        </div>
    </div>
</template>

<script setup lang='ts'>
    import { computed,onMounted, inject, ref} from 'vue';
    import statusValueVue from '../status/statusValue/statusValue.vue';
    import { getTypeStatusByKey } from '@/hooks/all-exitence/allExitence';
    import Status from '@/interfaces/exitenceStatus';
    import { showPopUp } from '@/hooks/pages/popUp';

    let {disabled,status} = defineProps(["disabled","status"])
    const key = ref(0)

    const type = inject<any>("type")
    //获取事物所在的分类的属性
	let typeStatus = getTypeStatusByKey(status.__key,type.typeStatus)
    const statusName = computed(()=>{
        return status.name || typeStatus?.name
    })

    //长按弹出更新属性
    const allStatus = inject("allStatus")
    const allTypeStatus = inject("allTypeStatus")
    function showUpdateStatus(){
        //禁用状态下无效
        if(disabled){
            return false
        }
        showPopUp({
            mask:false,
            vueName:"updateStatus",
            buttons:[],
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
		.name{
			width:calc(150px - 1rem);
			box-sizing: border-box;
		}
		.separator{
			min-width: 1rem;
		}
		.value{
			width: calc(100% - 150px);
		}
	}
</style>