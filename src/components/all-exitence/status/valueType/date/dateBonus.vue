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
            <Selector v-model="unitFrom" :list="unitList"/>
        </div>
        <div class="option">终末单位：
            <Selector v-model="unitEnd" :list="unitList"/>
        </div>
        <div class="option">数字类型：
            <Selector v-model="numFormat" :list="numFormatList"/>
        </div>
        <div class="option">链接符：
            <Selector v-model="linker" :list="linkerList"/>
        </div>
    </div>
    
</div>
</template>

<script setup lang='ts'>
    import { computed, ref, watch, watchEffect } from 'vue';
    import Button from '@/components/global/Button.vue';
    import Selector from '@/components/global/Selector.vue';
    import { getTimeRule, showTimeSelector, TimeLinker } from '@/supportAbility/customTime/translateTime';
import Status from '@/interfaces/Status';
import { showQuickInfo } from '@/api/showQuickInfo';
import { TimeRule } from '@/supportAbility/customTime/customTime';
import { ExitenceStatus } from '@/class/Exitence';
import { deleteStatusSetting, getStatusSettingValue, setStatus } from '@/hooks/all-exitence/status';
    //时间属性
    const {status,fullStatus} = defineProps<{
        status:Status|ExitenceStatus,
        fullStatus:Status
    }>()

//当前时间规则，默认为date
    const timeRule = computed<TimeRule|null>(()=>{
        const ruleKey = getStatusSettingValue(fullStatus.setting,"timeRule","string")
        //默认为date
        if(!ruleKey){
            setStatus(status,"timeRule","date")
            status.value = new Date().getTime()
            return "date"
        }
        //否则获取目标rule
        let rule = getTimeRule(ruleKey)
        //获取失败时使用date
        if(!rule){
            showQuickInfo("未能获取指定的时间表达式，将使用现实时间替代")
            setStatus(status,"timeRule","date")
            status.value = new Date()
            rule = "date"
        }
        return rule
    })
//显示选择列表，选择时间规则
    async function showDateChoose(){
        const timeRule = await showTimeSelector()
        if(timeRule){
            status.value = timeRule=="date"?new Date().getTime():0
            const timeRuleKey = timeRule=="date"?"date":timeRule.__key
            setStatus(status,"timeRule",timeRuleKey)
            //同步修改规则列表
            getUnitList(timeRule)
            console.log(status,fullStatus.setting)
        }
        //没有做出选择:清空
        else{
            deleteStatusSetting(status,"timeRule")
        }
    }
//设置首尾单位
    const unitList = ref<{label:string,value:string}[]>([])
    const unitFrom = ref<string>("")
    const unitEnd = ref<string>("")
    getUnitList(timeRule.value)
    //修改单位列表与首尾单位
    function getUnitList(timeRule:TimeRule|null){
        if(!timeRule)timeRule = "date"
        let list:string[] = []
        if(timeRule == "date"){
            list = ["年","月","日","时","分","秒"]
        }
        else if(timeRule){
            const timeRuleUnits = timeRule?.units
            list = timeRuleUnits.map(unit=>unit.name)
        }
        const tmpList = list.map(item=>{
            return {
                label:item,
                value:item
            }
        })
        //修改当前单位列表
        unitList.value = tmpList 
        //修改当前首尾单位
        unitFrom.value = unitList.value[0].value
        const last = unitList.value.at(-1)
        unitEnd.value = last?last.value:""
        //同步到status中
        setStatus(status,"unitFrom",unitFrom.value)
        setStatus(status,"unitEnd",unitEnd.value)
    }
    //选择首尾单位,改变status
    watch([() => unitFrom.value, () => unitEnd.value], ([newUnitFrom, newUnitEnd]) => {
        setStatus(status, "unitFrom", newUnitFrom);
        setStatus(status, "unitEnd", newUnitEnd);
    });
//选择使用的数符
    const numFormatList = [
        {label:"阿拉伯数字",value:"阿拉伯数字"},
        {label:"简体中文数字",value:"简体中文数字"},
        {label:"繁体中文数字",value:"繁体中文数字"}
    ]
    const numFormat = ref("阿拉伯数字")
    watchEffect(()=>{
        setStatus(status,"numFormat",numFormat.value)
    })
//选择链接符号
    const linker = ref<false|TimeLinker>(false)
    watchEffect(()=>{
        if(linker.value != false){
            setStatus(status,"linker",linker.value)
        }
        else{
            deleteStatusSetting(status,"linker")
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
            setStatus(status,"showUnit",false)
        }
        else{
            deleteStatusSetting(status,"showUnit")
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