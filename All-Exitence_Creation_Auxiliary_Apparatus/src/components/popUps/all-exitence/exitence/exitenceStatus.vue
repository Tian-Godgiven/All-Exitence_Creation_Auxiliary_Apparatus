<template>
    <div class="exitenceStatus">
        <!-- 属性名 -->
        <div class="name">
            {{ statusName }}
        </div>
        <div class="separator">：</div>
        <!-- 属性值 -->
        <statusValueVue class="value"></statusValueVue>
    </div>
    
</template>

<script setup lang='ts'>
    import { computed, inject, provide } from 'vue';
    import statusValueVue from '../status/statusValue/statusValue.vue';
    import Status from '@/interfaces/exitenceStatus';

    let {status} = defineProps(["status","typeStatus"])
    provide("status",status)
    const type = inject<any>("type")
    //获取对应的分类属性并提供
	let typeStatus = type.typeStatus.find((typeStatus:Status)=>{
        if(typeStatus.__key == status.__key){
            return status
        }
    })
    const statusName = computed(()=>{
        return status.name || typeStatus.name
    })
    provide("typeStatus",typeStatus)
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
			width: calc(100% - 200px);
		}
	}
</style>