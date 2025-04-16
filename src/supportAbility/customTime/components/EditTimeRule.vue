<template>
<div class="editTimeRule">
    <DownLineInput class="name" 
        v-model="newRule.name" 
        placeholder="自定义时间名称"/>
    <div class="selectBar">
        <div class="selectNumFormat">
            <Selector v-model="newRule.numFormat" :list="numFormatList"></Selector>
        </div>
    </div>
    
    <div class="units">
        <div class="titleBar">
            <div>已有单位</div>
            <Button @click="addUnit" icon="add" name="新增单位"></Button>
        </div>
        <div class="container">
            <EditTimeRuleUnit v-for="unit in newRule.units" :unit="unit" :allUnit = newRule.units></EditTimeRuleUnit>
        </div>
    </div>
    
    <FinalButtons :buttons="[
        {click:confirm,name:'确认'},
        {click:quit,name:'返回'}]"></FinalButtons>
</div>
</template>

<script setup lang='ts'>
    import {computed, reactive,toRaw} from 'vue';
    import { addCustomTimeRule, checkCustomTimeRule, CustomTimeRule, CustomTimeRuleUnit, editCustomTimeRule, getCustomEqualToUnit, hideEditPage, sortRuleUnits} from '../customTime';
    import { cloneDeep } from 'lodash';
    import DownLineInput from '@/components/other/input/downLineInput.vue';
    import Button from '@/components/global/Button.vue';
    import EditTimeRuleUnit from './EditTimeRuleUnit.vue';
    import { editTarget } from '../customTime'; 
    import { nanoid } from 'nanoid';
    import { showQuickInfo } from '@/api/showQuickInfo';
    import Selector from '@/components/global/Selector.vue';
    import FinalButtons from '@/app/stacks/popUp/FinalButtons.vue';

    //初始值
    const idle:CustomTimeRule = {
        name:"",
        numFormat:"阿拉伯数字",
        units:[{name:"",target:false}],
        __key:nanoid()
    }
    //编辑对象是目标对象的拷贝
    const newRule = computed(()=>{
        let tmp = editTarget.value
        //若为空则创建新规则
        if(!tmp){
            tmp = idle
        }
        //拷贝编辑对象
        let newRule = reactive<CustomTimeRule>(cloneDeep(tmp))
        return newRule
    })
    
    //数符选项
    const numFormatList = [
        {label:"简体中文数字",value:"简体中文数字"},
        {label:"繁体中文数字",value:"繁体中文数字"},
        {label:"阿拉伯数字",value:"阿拉伯数字"}
    ]
    //添加空的新单位到开头，默认以上一个单位为基准
    function addUnit(){
        const lastUnit = newRule.value.units[0]
        const newUnit:CustomTimeRuleUnit = {
            name:"",
            target:lastUnit.name,
            equal:1,
        }
        newRule.value.units.unshift(newUnit)
    }
    //返回修改后的规则
    function confirm(){
        //检查是否符合条件
        if(!checkCustomTimeRule(newRule.value)){return false}
        //按照从大到小的顺序重新排列单位
        const newUnits = sortRuleUnits(newRule.value.units)
        newRule.value.units = newUnits
        //为所有单位添加或更新equalToMin
        for(let unit of newRule.value.units){
            if(unit.target){
                const equalToMin = getCustomEqualToUnit(newRule.value.units,unit,1)
                if(equalToMin){
                    unit.equalToMin = equalToMin
                }
                else{
                    showQuickInfo(`${unit.name}无法转换为最小单位，可能存在递归调用。`)
                    return false
                }
            }
        }
        //如果传入为null，则添加新规则
        if(editTarget.value==null){
            addCustomTimeRule(toRaw(newRule.value))
        }
        //否则修改传入的规则的内容或位置
        else{
            editCustomTimeRule(editTarget.value,newRule.value)
        }
        //返回管理页面
        hideEditPage()
    }
    //取消返回
    function quit(){
        hideEditPage()
    }
</script>

<style scoped lang='scss'>
.editTimeRule{
    .selectBar{
        display: grid;
        grid-template-columns: 9fr 9fr;
        gap: 10px;
        align-items: center;
        justify-content: center;
    }
    .units{
        .titleBar{
            display: flex;
            .button{
                height: 40px;
                width: 40px;
                border: 3px solid black;
                border-radius: 5px;
            }
        }
        .container{
            max-height: 700px;
            position: relative;
            overflow: auto;
            &::-webkit-scrollbar{
                display: none;
            }
        }
        
    }
    
}

</style>