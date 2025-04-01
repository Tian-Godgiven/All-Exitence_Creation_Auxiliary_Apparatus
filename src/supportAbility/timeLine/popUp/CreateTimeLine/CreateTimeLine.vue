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
        <Selector v-model="maxUnit" :list="timeRuleUnits"></Selector>
    </div>
    <div>选择最小单位
        <Selector v-model="minUnit" :list="minUnitList"></Selector>
    </div>
    <div>起始时间：
        <DownLineInput v-model="startTime" placeholder="默认"></DownLineInput>
    </div>

    <div class="finalButtons">
        <Button @click="confirm" name="确认"></Button>
        <Button @click="quit" name="取消"></Button>
    </div>
</div>
</template>

<script setup lang='ts'>
    import DownLineInput from '@/components/other/input/downLineInput.vue';
    import { computed, ref, watch} from 'vue';
    
    import Button from '@/components/global/Button.vue';
import { getSmallestTimeValue, hideCreateTimeLine} from '../../timeLine';
import { getTimeRule, getTimeRuleUnits } from '@/supportAbility/customTime/translateTime';
import { isString } from 'lodash';
import Selector from '@/components/global/Selector.vue';
import ShowTarget from './ShowTarget/ShowTarget.vue';
import { chooseTarget, minTimeValue, targetList, targetType,timeRuleKey } from './createTimeLine';
    
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
        if(timeRule.value){
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
        }
        else{
            return [{label:"",value:""}]
        }
        
    })
    //选择最大时间单位
    const maxUnit = ref("")
    watch(timeRuleUnits,()=>{
        console.log(timeRuleUnits.value)
        if(timeRuleUnits.value){
            const tmp = timeRuleUnits.value[0]
            maxUnit.value = tmp.value
            return;
        }
        maxUnit.value = ""
    })
    //最小时间单位的选项
    const minUnitList = computed(()=>{
        if(!timeRuleUnits.value)return [{label:"",value:""}]
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


    //起始时间值,为当前选择的对象中，时间值最小的对象的最小时间单位为最小值时的值
    const startTime = computed(()=>{
        if(!timeRule.value)return 0
        //最小时间值
        console.log("计算起始时间值",
            minTimeValue.value,
            timeRule.value,
            minUnit.value
        )
        return getSmallestTimeValue(minTimeValue.value,timeRule.value,minUnit.value)
    })

    //确认，返回当前编辑的对象
    function confirm(){
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

    .finalButtons{
        @extend .finalButtons;
    }
</style>
