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
    import { getTypeStatus } from '@/hooks/all-exitence/allExitence';

    let {status} = defineProps(["status","typeStatus"])
    
    const type = inject<any>("type")
    //获取事物所在的分类的属性
	let typeStatus = getTypeStatus(status,type.typeStatus)
    const statusName = computed(()=>{
        return status.name || typeStatus?.name
    })
    //提供所需的属性/分类属性
    provide("status",status)
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
			width: calc(100% - 150px);
		}
	}
</style>