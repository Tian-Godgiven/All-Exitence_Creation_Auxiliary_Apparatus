<template>
<div class="dateBonus">
    <div class="chooseTimeRule flex">
        <span>选择时间：</span>
        <Button 
            @click="showDateChoose" 
            :name="timeRule==null?'选择时间':
                (timeRule == 'date'?'日期':timeRule.name)">
        </Button>
    </div>
    <div v-if="timeRule != null">
        <div class="option">显示单位：
            <input type="checkbox" v-model="showUnit">
        </div>
        <div class="option">起始单位：
            <ElSelect v-model="unitFrom">
                <ElOption
                    v-for="unit in unitList"
                    :value="unit"
                    :key="unit"
                />
            </ElSelect>
        </div>
        <div class="option">终末单位：
            <ElSelect v-model="unitEnd">
                <ElOption
                    v-for="unit in unitList"
                    :value="unit"
                    :key="unit"
                />
            </ElSelect>
        </div>
        <div class="option">数字类型：
            <ElSelect v-model="numFormat">
                <ElOption
                    v-for="value in numFormatList"
                    :value="value"
                    :key="value"
                />
            </ElSelect>
        </div>
        <div class="option">链接符：
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
import Status from '@/interfaces/Status';
import { showQuickInfo } from '@/api/showQuickInfo';
import { TimeRule } from '@/supportAbility/customTime/customTime';
    //时间属性
    const status = inject('status') as Status

//当前时间规则，默认为date
    const timeRule = computed<TimeRule|null>(()=>{
        const ruleKey = status.setting["timeRule"]
        //默认为date
        if(!ruleKey){
            status.setting["timeRule"] = "date"
            status.value = new Date().getTime()
            return "date"
        }
        //否则获取目标rule
        let rule = getTimeRule(ruleKey)
        //获取失败时使用date
        if(!rule){
            showQuickInfo("未能获取指定的时间表达式，将使用现实时间替代")
            status.setting["timeRule"] = "date"
            status.value = new Date()
            rule = "date"
        }
        return rule
    })
//显示选择列表，选择时间规则
    async function showDateChoose(){
        const tmp = await showTimeSelector()
        if(tmp){
            status.value = tmp=="date"?new Date().getTime():0
            status.setting["timeRule"] = tmp=="date"?"date":tmp.__key
        }
        //没有做出选择:清空
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
    const unitFrom = ref<string>("")
    const unitEnd = ref<string>("")
    //列表变化时首尾单位变化
    watchEffect(()=>{
        unitFrom.value = unitList.value?unitList.value[0]:"";
        unitEnd.value = unitList.value?.at(-1)??""
    })
    //首尾单位选择时改变status
    watchEffect(()=>{
        status.setting["unitFrom"] = unitFrom.value
        status.setting["unitEnd"] = unitEnd.value
    })
//选择使用的数符
    const numFormatList = ["阿拉伯数字","简体中文数字","繁体中文数字"]
    const numFormat = ref("阿拉伯数字")
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
.dateBonus{
    .chooseTimeRule{
        display: flex;
    }
    .option{
        margin-top: 5px;
        display: flex;
        align-items: center;
        white-space: nowrap;
    }
}

</style>