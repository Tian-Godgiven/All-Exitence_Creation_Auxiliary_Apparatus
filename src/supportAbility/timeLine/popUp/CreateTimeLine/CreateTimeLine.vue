<template>
<div class="createTimeLine" ref="pageRef">
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
        <Selector placeholder="无选项" v-model="maxUnit" :list="timeRuleUnits"></Selector>
    </div>
    <div>选择最小单位
        <Selector placeholder="无选项" v-model="minUnit" :list="minUnitList"></Selector>
    </div>
    <div>起始时间：
        <div class="startTime" v-if="startTimeArr">
            <DateUnitValue v-for="unit in startTimeArr" :unit format="阿拉伯数字">
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
    import { computed, reactive, ref, watch, watchEffect} from 'vue';
    import Button from '@/components/global/Button.vue';
import { createTimeLine, hideCreateTimeLine, TimeLine} from '../../timeLine';
import { getTimeRule, getTimeRuleUnits, translateTimeArrToValue, translateTimeValueToArr } from '@/supportAbility/customTime/translateTime';
import { isString } from 'lodash';
import Selector from '@/components/global/Selector.vue';
import ShowTarget from './ShowTarget/ShowTarget.vue';
import { chooseTarget, getTargetKeyList, minTimeValue, targetList, targetType,timeRuleKey } from './createTimeLine';
import DateUnitValue from '@/components/all-exitence/status/statusValue/dateUnitValue.vue';
import { TimeRule } from '@/supportAbility/customTime/customTime';
    
    //选择的目标类型
    const typeList = [
        {value:"exitence",label:"事物"},
        {value:"status",label:"事物属性"},
        {value:"article",label:"文章"},
    ]


    //使用的时间规则
    const timeRule = computed(()=>{
        const rule = getTimeRule(timeRuleKey.value)
        return rule
    })

    //目标属性的key：适用于文章or属性类型
    const timeStatusKey = ref<string>("")
    //仅在选择事物属性时有效，列出指定事物属性中可以被选为时间属性子属性
    const statusKeyList = computed(()=>{
        //否则可选项为目标中存在时间类属性
        
    })

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
    const maxUnit = ref("")
    watch(timeRuleUnits,()=>{
        if(timeRuleUnits.value){
            const tmp = timeRuleUnits.value[0]
            maxUnit.value = tmp.value
            return;
        }
        maxUnit.value = ""
    })
    //最小时间单位的选项
    const minUnitList = computed(()=>{
        if(!timeRuleUnits.value)return false
        if(targetList.value.length==0)return false
        const maxIndex = timeRuleUnits.value.findIndex(unit=>{
            return unit.value == maxUnit.value
        })
        return timeRuleUnits.value.slice(maxIndex+1)
    })
    //最小单位
    const minUnit = ref("")
    watch(minUnitList,()=>{
        if(!minUnitList.value){
            minUnit.value = "";
            return;
        }
        const tmp = minUnitList.value.at(-1)
        if(!tmp)return;
        minUnit.value = tmp.value
    })

    //起始时间值数组,为当前选择的对象中，时间值最小的对象的最小时间单位为最小值时的值
    let startTime = 0
    const startTimeArr = computed(()=>{
        if(!timeRule.value)return false
        if(minTimeValue.value == Infinity)return false
        if(targetList.value.length==0)return false
        const timeArr = translateTimeValueToArr({
            value:minTimeValue.value,
            rule:timeRule.value,
            unitFrom:maxUnit.value,
            unitEnd:minUnit.value
        })
        //要将其中最小的单位的值设为1
        const lastUnit = timeArr.at(-1)
        if(lastUnit){
            lastUnit.value = 1
        }
        
        return reactive(timeArr)
    })
    //修改数组的值为起始时间值
    watchEffect(()=>{
        startTime = 0
        if(!timeRule.value)return false
        if(!startTimeArr.value)return false
        //设定起始时间的值
        const tmp = translateTimeArrToValue(startTimeArr.value,timeRule.value)
        if(tmp){
            startTime = tmp;
        }
        else{
            startTime = 0
        }
    })

    //确认，返回当前编辑的对象
    function confirm(){
        const key = getTargetKeyList(targetType.value,targetList.value)
        if(!key)return false;
        //形成一个完整的时间轴对象
        const timeLine = {
            timeRuleKey:timeRuleKey.value, // 时间线规则的key，"date" 或其他值
            now: startTime,  // 当前时间线的位置，默认从最早的对象开始
            unitStart: maxUnit.value,  // 当前时间线的最大单位
            unitEnd: minUnit.value,   // 当前时间线的最小单位
            targetType: targetType.value,  // 明确指定目标类型为 "article"
            key,
            timeStatusKey: timeStatusKey.value  
        }
        //将这个时间线添加到当前时间线中
        createTimeLine(timeLine as TimeLine)
        
        hideCreateTimeLine()
    }
    //取消
    function quit(){
        hideCreateTimeLine()
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
