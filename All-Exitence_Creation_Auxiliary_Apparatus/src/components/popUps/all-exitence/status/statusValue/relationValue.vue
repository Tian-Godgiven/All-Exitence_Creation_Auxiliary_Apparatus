<template>
    <div class="relationValue">
        <relationUnitValueVue class="relationUnit" 
            v-for="unit of status.value" 
            :unit="unit"
            :source="relationSource"/>
    </div>
</template>

<script setup lang='ts'>
    import { computed } from 'vue';
    import relationUnitValueVue from './relationUnitValue.vue';
    const {status,statusSetting} = defineProps(["status","statusSetting"])
    //获取关联体
    const relationSource = computed(()=>{
        return statusSetting.relationSource
    })

</script>

<style scoped lang='scss'>
    .relationUnit{
        width: 100%;
        display: flex;
        flex-wrap: wrap; /* 允许子元素换行 */
    }
</style>