<template>
<div class="dateValue">
    <DateUnitValue 
        v-for="(unit,i) in unitList" 
        :unit="unit" 
        :format="numFormat"
        @change="onChange">
        <template #default>
            <div v-if="showUnit" class="unitName">{{ unit.name }}</div>
            <div v-if="linker && i != unitList.length-1">{{ linker }}</div>
        </template>
    </DateUnitValue>
</div>
</template>

<script setup lang='ts'>
import { showQuickInfo } from '@/api/showQuickInfo';
import { getTimeRule,  translateTimeArrToValue,  translateTimeValueToArr } from '@/supportAbility/customTime/translateTime';
import { computed } from 'vue';
import DateUnitValue from './dateUnitValue.vue';
import { getStatusSettingValue, setStatus } from '@/hooks/all-exitence/status';
import Status from '@/interfaces/Status';
import { ExitenceStatus } from '@/class/Exitence';

    const {status,fullStatus} = defineProps<{
        status:Status|ExitenceStatus,
        fullStatus:Status
    }>()
    //是否不具备时间属性或时间属性无效
    const timeRule = computed(()=>{
        const ruleKey = getStatusSettingValue(fullStatus.setting,"timeRule","string")
        //检查时间规则是否存在，如果不存在则使用Date替代
        if(ruleKey){
            let rule = getTimeRule(ruleKey)
            if(rule){
                return rule
            }
            else{
                showQuickInfo("未能获取指定的时间表达式，将使用现实时间替代")
                setIdleStatus(status)   
                return "date"
            }
        }
        //未完成：关联属性的属性修改无效
        return "date" //默认返回date
    })
    //日期所需要显示的单位列表
    const unitList = computed(()=>{
        const unitFrom = getStatusSettingValue(fullStatus.setting,"unitFrom","string")??undefined
        const unitEnd = getStatusSettingValue(fullStatus.setting,"unitEnd","string")??undefined
        //获取单位列表
        const list = translateTimeValueToArr({
            value:status.value,
            rule:timeRule.value,
            unitFrom,
            unitEnd
        })
        return list
    })
    //是否显示单位，默认显示
    const showUnit = computed(()=>{
        return getStatusSettingValue(fullStatus.setting,"showUnit","bool")
            ??true
    })
    //链接符号
    const linker = computed(()=>{
        return getStatusSettingValue(fullStatus.setting,"linker","string")
            ??false
    })
    //使用的数符
    type NumFormat = "阿拉伯数字"|"简体中文数字"|"繁体中文数字"
    const numFormat = computed<NumFormat>(()=>{
        let value = getStatusSettingValue(fullStatus.setting,"numFormat","string")??"阿拉伯数字"
        if(!["阿拉伯数字","简体中文数字","繁体中文数字"].includes(value)){
            value = "阿拉伯数字"
        }
        return value as NumFormat
    })
    //输入框改变值时，修改status的值
    function onChange(){
        const newValue = translateTimeArrToValue(unitList.value,timeRule.value)
        status.value = newValue
    }

    //设置为默认属性
    function setIdleStatus(status:Status|ExitenceStatus){
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