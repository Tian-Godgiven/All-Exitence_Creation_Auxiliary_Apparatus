<template>
<div class="dateBonus">
    <div>
        <span v-if="timeRule!=null">当前时间：</span>
        <Button 
            @click="showDateChoose" 
            :name="timeRule==null?'选择时间':
                (timeRule == 'date'?'日期':timeRule.name)">
        </Button>
    </div>
    
    <div v-if="timeRule != null">
        <div>起始单位：
            <ElSelect v-model="unitFrom">
                <ElOption
                    v-for="unit in unitList"
                    :value="unit"
                    :key="unit"
                />
            </ElSelect>
        </div>
        <div>终末单位：
            <ElSelect v-model="unitEnd">
                <ElOption
                    v-for="unit in unitList"
                    :value="unit"
                    :key="unit"
                />
            </ElSelect>
        </div>
        <div>显示单位：
            <input type="checkbox" v-model="showUnit"></div>
        <div>数字类型：
            <ElSelect v-model="numFormat">
                <ElOption
                    v-for="value in numFormatList"
                    :value="value"
                    :key="value"
                />
            </ElSelect>
        </div>
        <div>链接符
            <ElSelect v-model="linker">
                <ElOption
                    v-for="item in linkerList"
                    :value="item.value"
                    :label="item.label"
                />
            </ElSelect>
        </div>
    </div>
    
</div>
</template>

<script setup lang='ts'>
    import { computed, inject, ref, watchEffect } from 'vue';
    import Button from '@/components/global/button.vue';
    import { getTimeRule, showTimeSelector, TimeLinker } from '@/supportAbility/customTime/translateTime';
import { ElOption, ElSelect } from 'element-plus';
import Status from '@/interfaces/exitenceStatus';
import { showQuickInfo } from '@/api/showQuickInfo';
import { TimeRule } from '@/supportAbility/customTime/customTime';
    //时间属性
    const status = inject('status') as Status

    //当前时间规则的名称
    const timeRule = computed<TimeRule>(()=>{
        const ruleKey = status.setting["timeRule"]
        let rule = getTimeRule(ruleKey)
        if(!rule){
            showQuickInfo("未能获取指定的时间表达式，将使用现实时间替代")
            status.setting["timeRule"] = "date"
            rule = "date"
        }
        return rule
    })
    //显示选择列表，选择时间规则
    async function showDateChoose(){
        const tmp = await showTimeSelector()
        if(tmp){
            status.setting["timeRule"] = tmp=="date"?"date":tmp.__key
        }
        //没有做出选择
        else{
            delete status.setting["timeRule"]
        }
    }
//选择首尾单位
    const unitList = computed(()=>{
        if(timeRule.value == "date"){
            return ["年","月","日","时","分","秒"]
        }
        else{
            const timeRuleUnits = timeRule.value?.units
            return timeRuleUnits?.map(unit=>unit.name)
        }
    })
    const unitFrom = ref(status.setting?.unitFrom)
    const unitEnd = ref(status.setting?.unitFrom)
    watchEffect(()=>{
        status.setting["unitFrom"] = unitFrom.value
        status.setting["unitEnd"] = unitEnd.value
    })
//选择使用的数符
    const numFormatList = ["阿拉伯数字","简体中文数字","繁体中文数字"]
    const numFormat = ref()
    watchEffect(()=>{
        status.setting["numFormat"] = numFormat.value
    })
//选择链接符号
    const linker = ref<false|TimeLinker>(false)
    watchEffect(()=>{
        if(linker.value != false){
            status.setting["linker"] = linker.value
        }
        else{
            delete status.setting["linker"]
        }
    })
    const linkerList = [
        {value:false,label:"无"},
        {value:"/",label:"分隔符“/”"},
        {value:"-",label:`分隔符“-”`},
        {value:":",label:"分隔符“:”"}
    ]
//是否显示单位
    const showUnit = ref(true)
    watchEffect(()=>{
        if(showUnit.value == false){
            status.setting["showUnit"] = false
        }
        else{
            delete status.setting["showUnit"]
        }
    })
</script>

<style scoped lang='scss'>

</style>