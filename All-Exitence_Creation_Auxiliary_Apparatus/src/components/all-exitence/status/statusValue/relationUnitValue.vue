<template>
    <div>
        <statusValueVue class="unitStatus" v-for="(value,key) in source" 
            :key="Symbol()"
            :status="unitStatus[key]" :typeStatus="value">
        </statusValueVue>
    </div>
    
</template>

<script setup lang='ts'>
    import { computed,reactive, watchEffect} from 'vue';
    import statusValueVue from './statusValue.vue';
    const {source,unit} = defineProps(["source","unit"])
    //单元的属性列表
    const unitStatus = computed(()=>{
        const tmp:any = {}
        for(let key in source){
            if(!unit[key]){
                unit[key] = source[key].value
            }
            const status = reactive({value : unit[key]})
            // 监听 status.value 的变化，并同步更新 unit.name
            watchEffect(() => {
                unit[key] = status.value;  // 自动跟踪 status.value 的变化
            });
            tmp[key] = status
        }
        return tmp
    })
</script>

<style scoped lang='scss'>
    .unitStatus{
        flex: 1 1 30%;
    }
</style>