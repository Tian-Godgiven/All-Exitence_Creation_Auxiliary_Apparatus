<template>
    <div class="unit" :class="unit.target?'':'noEqual'">
        <DownLineInput 
            class="unitName"
            v-model="unit.name" 
            placeholder="单位名称(必需)"/>
        <div class="equal">=</div>
        <DownLineInput 
            v-if="unit.target"
            class="unitEqual"
            v-model="unit.equal" 
            placeholder="相等值"/>
        <Selector v-model="unit.target" :list="unitTargetList"></Selector>
    </div>
</template>

<script setup lang='ts'>
    import DownLineInput from '@/components/other/input/downLineInput.vue';
    import { computed } from 'vue';
    import { CustomTimeRuleUnit } from '../customTime';
import Selector from '@/components/global/Selector.vue';
    const {unit,allUnit} = defineProps<{unit:CustomTimeRuleUnit,allUnit:CustomTimeRuleUnit[]}>()
    //获取单位目标选项：不包括自身
    const unitTargetList = computed(()=>{
        const tmp:{label:string,value:string|false}[] = 
            [{label:"最小单位",value:false}]
        for(const target of allUnit){
            if(target.name != "" && target.name != unit.name){
                tmp.push({
                    value:target.name,
                    label:target.name
                })
            }
        }
        return tmp
    })
</script>

<style scoped lang='scss'>
    .unit{
        display: grid;
        grid-template-columns: 2fr 0.5fr 0.7fr 2fr;
        gap: 5px;
        .equal{
            display: flex;
            align-items: center;
            justify-content: center;
        }
        &.noEqual{
            grid-template-columns: 2fr 0.5fr 2fr 0.7fr;
            gap: 5px;
        }
    }
</style>