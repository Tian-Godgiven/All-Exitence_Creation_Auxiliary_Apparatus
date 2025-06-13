<template>
<div class="relationUnitStatus">
    <StatusValue 
        :target
        :key="sourceStatus.__key"
        :status
        :fullStatus="sourceStatus"/>
</div>
</template>

<script setup lang='ts'>
import StatusValue from '../../StatusValue.vue';
    import { Exitence, ExitenceStatus } from '@/class/Exitence';
import { Type } from '@/class/Type';
import Status from '@/interfaces/Status';
import { reactive } from 'vue';
import { RelationUnit } from './relationStatus';
    const {sourceStatus,unit,target} = defineProps<{
        sourceStatus:Status
        unit:RelationUnit
        target:Exitence|Type
    }>()
    //对单元值的引用
    const unitValue = unit[sourceStatus.name]
    //初始化
    if(!unitValue){
        unit[sourceStatus.name] = sourceStatus.value
    }
    //关联单元属性的值与unit的对应值绑定，仅在该值无效时使用sourceStatus中的值
    const status = reactive<ExitenceStatus>({
        get value() {
            return unit[sourceStatus.name];
        },
        set value(newValue) {
            unit[sourceStatus.name] = newValue
        },
        __key: sourceStatus.__key
    });

</script>

<style scoped lang='scss'>
.relationUnitStatus{
    flex: 1 1 30%;
}
</style>