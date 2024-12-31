<template>
    <div>
        <statusValueVue class="unitStatus" v-for="(value,key) in source" 
            :status="unitStatus[key]" :typeStatus="value">
        </statusValueVue>
    </div>
    
</template>

<script setup lang='ts'>
    import { computed } from 'vue';
    import statusValueVue from './statusValue.vue';
    const {source,unit} = defineProps(["source","unit"])
    //单元的属性列表
    const unitStatus = computed(()=>{
        const tmp:any = {}
        if(JSON.stringify(unit) == "{}"){
            for(let key in source){
                tmp[key] = source[key].value
            }
        }
        return tmp
    })
</script>

<style scoped lang='scss'>
    .unitStatus{
        flex: 1 1 30%;
        min-width: 30%;
        max-width: 100%;
    }
</style>