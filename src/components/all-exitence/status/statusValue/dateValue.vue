<template>
<div class="dateValue">
    <DateUnitValue 
        v-for="(unit,i) in unitList" 
        :unit="unit" 
        :format="numFormat"
        @change="onChange">
        <template #default>
            <div v-if="showUnit!=false" class="unitName">{{ unit.name }}</div>
            <div v-if="linker != null && i != unitList.length-1">{{ linker }}</div>
        </template>
    </DateUnitValue>
</div>
</template>

<script setup lang='ts'>
import { showQuickInfo } from '@/api/showQuickInfo';

import { getTimeRule,  translateTimeArrToValue,  translateTimeValueToArr } from '@/supportAbility/customTime/translateTime';
    import { computed } from 'vue';
import DateUnitValue from './dateUnitValue.vue';
    const {status,statusSetting} = defineProps(['status','statusSetting'])
    const timeRule = computed(()=>{
        const ruleKey = statusSetting["timeRule"]
        //获取规则目标，失败时将规则修改为date
        let rule = getTimeRule(ruleKey)
        if(!rule){
            showQuickInfo("未能获取指定的时间表达式，将使用现实时间替代")
            status.setting["timeRule"] = "date"
            rule = "date"
        }
        return rule
    })
    //日期所需要显示的单位列表
    const unitList = computed(()=>{
        const unitFrom = statusSetting["unitFrom"]
        const unitEnd = statusSetting["unitEnd"]
        //获取单位列表
        const list = translateTimeValueToArr({
            value:status.value,
            rule:timeRule.value,
            unitFrom,
            unitEnd
        })
        return list
    })
    //是否显示单位
    const showUnit = computed(()=>{
        return statusSetting.showUnit
    })
    //链接符号
    const linker = computed(()=>{
        return statusSetting.linker
    })
    //使用的数符
    const numFormat = computed(()=>{
        return statusSetting.numFormat??"阿拉伯数字"
    })
    //输入框改变值时，修改status的值
    function onChange(){
        const newValue = translateTimeArrToValue(unitList.value,timeRule.value)
        console.log("计算后的新值为",newValue)
        status.value = newValue
    }
    
</script>

<style scoped lang='scss'>
.dateValue{
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    
}
</style>