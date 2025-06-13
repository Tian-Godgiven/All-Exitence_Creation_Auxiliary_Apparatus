<template>
<div class="relationUnitValue">
    <StatusValue class="unitStatus" v-for="(value,key) in source" 
        :target
        :key="value.__key"
        :status="unitStatus[key]" 
        :fullStatus="value"/>
</div>
</template>

<script setup lang='ts'>
    import { computed,reactive, watchEffect} from 'vue';
    import StatusValue from '../../StatusValue.vue';
    import { RelationSource, RelationUnit } from './relationStatus';
import Status from '@/interfaces/Status';
import { Type } from '@/class/Type';
import { Exitence } from '@/class/Exitence';
    const {source,unit,target} = defineProps<{
        source:RelationSource,
        unit:RelationUnit,
        target:Type|Exitence
    }>()
    //单元的属性列表
    const unitStatus = computed(()=>{
        const tmp:Record<string,Status> = {}
        for(let key in source){
            if(!unit[key]){
                //值为空时，使用source中对应属性的默认值
                unit[key] = source[key].value
            }
            const status = reactive({value : unit[key]})
            // 监听 status.value 的变化，并同步更新 unit.name
            watchEffect(() => {
                unit[key] = status.value;  // 自动跟踪 status.value 的变化
            });
            tmp[key] = status as Status
        }
        return tmp
    })
</script>

<style scoped lang='scss'>
.unitStatus{
    flex: 1 1 30%;
}
</style>