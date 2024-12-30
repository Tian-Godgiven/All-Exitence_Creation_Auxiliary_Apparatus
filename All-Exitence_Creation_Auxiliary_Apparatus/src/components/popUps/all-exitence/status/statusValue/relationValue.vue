<template>
    <div class="relationValue">
        <div v-for="unit of unitList">
            <statusValueVue  class="statusUnit"></statusValueVue>
        </div>
    </div>
</template>

<script setup lang='ts'>
    import statusValueVue from './statusValue.vue';

    const {status,statusSetting} = defineProps(["status","statusSetting"])
    //获取关联体
    const relationSource = statusSetting.relationSource
    //关联体包含的属性
    const relationStatusList = []
    for(let status in relationSource){
        relationStatusList.push({
            name:status,
            ...relationSource
        })
    }
</script>

<style scoped lang='scss'>

</style>