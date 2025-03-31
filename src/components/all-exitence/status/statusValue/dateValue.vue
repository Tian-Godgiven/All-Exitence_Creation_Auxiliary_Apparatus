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
    import { computed, ref } from 'vue';
import DateUnitValue from './dateUnitValue.vue';
import { setStatus } from '@/hooks/all-exitence/status';
    const {status,statusSetting} = defineProps(['status','statusSetting'])
    //是否不具备时间属性或时间属性无效
    const noTimeRule = ref(false)
    const timeRule = computed(()=>{
        console.log(status,statusSetting)
        const ruleKey = statusSetting["timeRule"]
        //获取规则目标，失败时将规则修改为date
        let rule = getTimeRule(ruleKey)
        if(!rule){
            showQuickInfo("未能获取指定的时间表达式，将使用现实时间替代")
            noTimeRule.value = true
            setStatus(status,"timeRule","date")
            setStatus(status,"uniFrom","年")
            setStatus(status,"unitEnd","日")
            //并且还会修改属性的值为当前时间
            status.value = Date.now()
            rule = "date"
        }
        return rule
    })
    //日期所需要显示的单位列表
    const unitList = computed(()=>{
        if(noTimeRule.value){
            return translateTimeValueToArr({
                value:status.value,
                rule:timeRule.value,
            })
        }
        const unitFrom = statusSetting["unitFrom"]
        const unitEnd = statusSetting["unitEnd"]
        //获取单位列表
        return translateTimeValueToArr({
            value:status.value,
            rule:timeRule.value,
            unitFrom,
            unitEnd
        })
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