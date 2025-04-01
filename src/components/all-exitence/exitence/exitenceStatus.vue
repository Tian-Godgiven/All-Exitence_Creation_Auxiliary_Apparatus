<template>
    <div>
        <!-- 显示属性 -->
        <div :key="key" class="exitenceStatus" v-touch:longtap="showUpdateStatus">
            <statusNameVue v-if="!ifNoName" :status="status" :typeStatus="typeStatus" :disabled="true"></statusNameVue>
            <!-- 属性值 -->
            <statusValueVue :status="status" :typeStatus="typeStatus" :disabled="disabled" class="value"></statusValueVue>
        </div>
    </div>
</template>

<script setup lang='ts'>
    import { computed, inject, ref} from 'vue';
    import statusNameVue from '../status/statusName.vue';
    import statusValueVue from '../status/statusValue/statusValue.vue';
    import { getTypeStatusByKey } from '@/hooks/all-exitence/allExitence';
    import Status from '@/interfaces/Status';
    import { showPopUp } from '@/hooks/pages/popUp';

    let {disabled,status} = defineProps(["disabled","status"])
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