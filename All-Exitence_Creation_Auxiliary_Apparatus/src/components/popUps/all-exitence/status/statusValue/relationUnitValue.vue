<template>
    <div>
        <statusValueVue class="unitStatus" v-for="(value,key) in source" 
            :status="unitStatus[key]" :typeStatus="value">
        </statusValueVue>
    </div>
    
</template>

<script setup lang='ts'>
    import { computed,reactive,ref } from 'vue';
    import statusValueVue from './statusValue.vue';
    const {source,unit} = defineProps(["source","unit"])
    //单元的属性列表
    const unitStatus = computed(()=>{
        for(let key in source){
            console.log(`unit当中的${key}值是${unit[key]}`)
            if(!unit[key]){
                unit[key] = reactive({value:source[key].value})
            }
        }
        console.log("unit的内容是:",unit)
        return unit
    })
</script>

<style scoped lang='scss'>
    .unitStatus{
        flex: 1 1 30%;
        min-width: 30%;
        max-width: 100%;
    }
</style>