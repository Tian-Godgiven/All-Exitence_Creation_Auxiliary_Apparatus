<template>
<div class="createTimeLine" ref="pageRef">

    <DownLineInput v-model="newTimeLine.name" placeholder="输入名称"></DownLineInput>

    <div class="chooseTarget">
        <div class="chooseType">目标类型:
            <Selector class="selector" 
                v-model="targetType" 
                :list="typeList">
            </Selector>
        </div>
        <Button name="选择目标" 
            class="showPopUp" 
            @click="chooseTarget">
        </Button>
    </div>
    
    <ShowTarget :targetType :targetList></ShowTarget>

    <div>选择最大单位
        <Selector placeholder="无选项" v-model="newTimeLine.unitStart" :list="timeRuleUnits"></Selector>
    </div>
    <div>选择最小单位
        <Selector placeholder="无选项" v-model="newTimeLine.unitEnd" :list="minUnitList"></Selector>
    </div>
    <div>起始时间：
        <div class="startTime" v-if="editTimeArr">
            <DateUnitValue v-for="unit in editTimeArr" :unit format="阿拉伯数字">
                {{ unit.name }}
            </DateUnitValue>
        </div>
    </div>

    <div class="finalButtons">
        <Button @click="confirm" name="确认"></Button>
        <Button @click="quit" name="取消"></Button>
    </div>
</div>
</template>

<script setup lang='ts'>
    import { computed, reactive, watch} from 'vue';
    import Button from '@/components/global/Button.vue';
import { createTimeLine,editTimeLine,TimeLine} from '../../timeLine';
import { getTimeRule, getTimeRuleUnits, translateTimeArrToValue, translateTimeValueToArr } from '@/supportAbility/customTime/translateTime';
import { cloneDeep, isString } from 'lodash';
import Selector from '@/components/global/Selector.vue';
import ShowTarget from './ShowTarget/ShowTarget.vue';
import { chooseTarget, editTarget, getKeyList, getTargetList, hideEditTimeLine, minTimeValue, targetList, timeStatusKey, targetType,timeRuleKey } from './editTimeLine';
import DateUnitValue from '@/components/all-exitence/status/statusValue/dateUnitValue.vue';
import DownLineInput from '@/components/other/input/downLineInput.vue';
    
    //选择的目标类型
    const typeList = [
        {value:"exitence",label:"事物"},
        // {value:"status",label:"事物属性"},
        {value:"article",label:"文章"},
    ]

    //初始值为空
    const idle:TimeLine = {
        name:"未命名时间轴",
        key:[],
        targetType: "exitence",
        timeRuleKey: "date",
        timeStatusKey:"",
        setting:{
            now:null,
            start:null
        },
        unitStart: "年",  // 当前时间线的最大单位
        unitEnd: "日",    // 当前时间线的最小单位
    }
    //编辑对象是源对象的拷贝
    const newTimeLine = computed(()=>{
        let tmp = editTarget.value
        //若为空则创建新规则
        if(!tmp){
            tmp = idle as TimeLine
        }
        //拷贝编辑对象
        let newTimeLine = reactive<TimeLine>(cloneDeep(tmp))
        return newTimeLine
    })

    //获取编辑对象时，设置编辑对象的初始值
    watch(newTimeLine,()=>{
        targetList.value = getTargetList(newTimeLine.value.targetType,newTimeLine.value.key)
        timeRuleKey.value = newTimeLine.value.timeRuleKey
        //开始时间为默认的最小时间
        const start = newTimeLine.value.setting.start
        if(start)minTimeValue.value = start
        timeStatusKey.value = newTimeLine.value.timeStatusKey      
    })

    //使用的时间规则
    const timeRule = computed(()=>{
        const rule = getTimeRule(timeRuleKey.value)
        return rule
    })

        // //仅在选择事物属性时有效，列出指定事物属性中可以被选为时间属性子属性
        // const statusKeyList = computed(()=>{
        //     //否则可选项为目标中存在时间类属性
            
        // })

    
    //所有可选时间单位，也用于最大时间单位选项
    const timeRuleUnits = computed(()=>{
        if(!timeRule.value)return false
        if(targetList.value.length==0)return false
        const units = getTimeRuleUnits(timeRule.value)
        return units.map(unit=>{
            //date类型
            if(isString(unit)){
                return {
                    label:unit,
                    value:unit
                }
            }
            //自定义类型
            return {
                label:unit.name,
                value:unit.name
            }
        })
        
    })
    //选择最大时间单位
    watch(timeRuleUnits,()=>{
        if(timeRuleUnits.value){
            const ifInclude = timeRuleUnits.value.find(unit=>
                unit.value == newTimeLine.value.unitStart
            )
            if(ifInclude){return;}
            const tmp = timeRuleUnits.value[0]
            newTimeLine.value.unitStart = tmp.value
            return;
        }
        newTimeLine.value.unitStart = ""
    })
    //最小时间单位的选项
    const minUnitList = computed(()=>{
        if(!timeRuleUnits.value)return false
        if(targetList.value.length==0)return false
        const maxIndex = timeRuleUnits.value.findIndex(unit=>{
            return unit.value == newTimeLine.value.unitStart
        })
        return timeRuleUnits.value.slice(maxIndex+1)
    })
    //最小单位
    watch(minUnitList,()=>{
        if(!minUnitList.value){
            newTimeLine.value.unitEnd = "";
            return;
        }
        //如果当前最小单位在选项里则不改变
        const ifInclude = minUnitList.value.find(unit=>
            unit.value == newTimeLine.value.unitEnd
        )
        if(ifInclude){return;}
        const tmp = minUnitList.value.at(-1)
        if(!tmp)return;
        newTimeLine.value.unitEnd = tmp.value
    })

    //时间轴的当前时间和起始时间
    //默认为当前选择的对象中，时间值最小的对象的最小时间单位为最小值时的值
    let nowTime:number|null = null
    let startTime :number|null = 0
    // 编辑时间，默认为当前的最小时间
    const editTimeArr = computed(()=>{
        if(!timeRule.value)return false
        if(minTimeValue.value == Infinity)return false
        if(targetList.value.length==0)return false
        const timeArr = translateTimeValueToArr({
            value:minTimeValue.value,
            rule:timeRule.value,
            unitFrom:newTimeLine.value.unitStart,
            unitEnd:newTimeLine.value.unitEnd
        })
        //要将其中最小的单位的值设为1
        const lastUnit = timeArr.at(-1)
        if(lastUnit){
            lastUnit.value = 1
        }
        return reactive(timeArr)
    })
    // 若编辑时间大于最小时间，则now为编辑时间，否则起始时间为编辑时间
    watch(editTimeArr,()=>{
        let value = 0
        if(timeRule.value && editTimeArr.value){
            //设定起始时间的值
            const tmp = translateTimeArrToValue(editTimeArr.value,timeRule.value)
            if(tmp){
                value = tmp
            }
        }
        //编辑时间大于最小时间，设定now为编辑时间
        if(value > minTimeValue.value){
            nowTime = value;
        }
        //否则设定start为编辑时间
        else{
            console.log(startTime,"是value")
            startTime = value
        }
    },{
        deep:true
    })

    //确认，返回当前编辑的对象
    function confirm(){
        const key = getKeyList(targetType.value,targetList.value)
        if(!key)return false;
        //形成一个完整的时间轴对象
        const timeLine = {
            name:newTimeLine.value.name,
            timeRuleKey:timeRuleKey.value, // 时间线规则的key，"date" 或其他值
            setting:{
                now:nowTime,
                start:startTime
            },
            targetType: targetType.value,  // 明确指定目标类型为 "article"
            unitEnd:newTimeLine.value.unitEnd,
            unitStart:newTimeLine.value.unitStart,
            key,
            timeStatusKey: timeStatusKey.value,

        }
        if(editTarget.value){
            editTimeLine(editTarget.value,timeLine as TimeLine)
        }
        else{
            //将这个时间线添加到当前时间线中
            createTimeLine(timeLine as TimeLine)
        }
        hideEditTimeLine()
    }
    //取消
    function quit(){
        hideEditTimeLine()
    }
</script>

<style scoped lang='scss'>
@use "@/static/style/popUp.scss";
.chooseTarget{
    width: 100%;
    .chooseType{
        display: flex;
        align-items: center;
        .selector{
            width: 200px;
        }
    }
    .showPopUp{
        width: 200px;
        text-align: center;
        border: 3px solid black;
        padding: 5px 10px;
        margin: 20px 0px;
    }
}
.startTime{
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
}

    .finalButtons{
        @extend .finalButtons;
    }
</style>
