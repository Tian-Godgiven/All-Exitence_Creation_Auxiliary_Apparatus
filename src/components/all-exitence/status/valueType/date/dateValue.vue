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
import { setStatus } from '@/hooks/all-exitence/status';
import Status from '@/interfaces/Status';
    const {status,typeStatus,statusSetting} = defineProps(['status','typeStatus','statusSetting'])
    //是否不具备时间属性或时间属性无效
    const timeRule = computed(()=>{
        const ruleKey = statusSetting["timeRule"]
        //获取规则目标，失败时将规则修改为date
        let rule = getTimeRule(ruleKey)
        if(!rule){
            //未完成：关联属性的属性修改无效
            showQuickInfo("未能获取指定的时间表达式，将使用现实时间替代")
            //判断是分类属性无效还是额外属性无效
            if(typeStatus && !getTimeRule(typeStatus.setting["timeRule"])){
                //设置分类属性
                setIdleStatus(typeStatus)
            }
            //是额外属性
            else{
                setIdleStatus(status)
            }
            rule = "date"
        }
        return rule
    })
    //日期所需要显示的单位列表
    const unitList = computed(()=>{
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

    //设置为默认属性
    function setIdleStatus(status:Status){
        setStatus(status,"timeRule","date")
        setStatus(status,"unitFrom","年")
        setStatus(status,"unitEnd","日")
        //并且还会修改属性的值为当前时间
        status.value = Date.now()
    }
    
</script>

<style scoped lang='scss'>
.dateValue{
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
}
</style>