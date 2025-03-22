<template>
<div class="editTimeRule">
    <DownLineInput class="name" 
        v-model="newRule.name" 
        placeholder="自定义时间名称"/>
    <div class="selectBar">
        <div class="selectNumFormat">
            <ElSelect
            v-model="newRule.numFormat">
                <ElOption
                    v-for="item in numFormatChoice"
                    :key="item"
                    :value="item"/>
            </ElSelect>
        </div>
        <div class="selectPosition">
            仅限当前项目<input type="checkbox" v-model="onlyProject">
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
    
    <div class="finalButtons">
        <Button name="确认" @click="confirm">确认</Button>
        <Button name="返回" @click="quit">返回</Button>
    </div>
</div>
</template>

<script setup lang='ts'>
    import {reactive, ref, toRaw} from 'vue';
import { addCustomTimeRule, changeCustomTimeRulePosition, checkCustomTimeRule, CustomTimeRule, hideEditPage, sortRuleUnits} from '../customTime';
import { cloneDeep } from 'lodash';
import DownLineInput from '@/components/other/input/downLineInput.vue';
import { ElOption, ElSelect } from 'element-plus';
import Button from '@/components/global/Button.vue';
import EditTimeRuleUnit from './EditTimeRuleUnit.vue';
import { editTarget } from '../customTime'; 
import { nanoid } from 'nanoid';
    //初始值
    const idle = {
        name:"",
        numFormat:"阿拉伯数字",
        units:[{name:"",target:false}],
        __key:nanoid()
    }
    //若为空则创建新规则
    let tmp:any = editTarget.targetRule
    if(tmp == null){
        tmp = idle
    }
    //拷贝编辑对象
    let newRule = reactive(cloneDeep(tmp))
    
    //数符选项
    const numFormatChoice:CustomTimeRule["numFormat"][] = [
        "简体中文数字",
        "繁体中文数字",
        "阿拉伯数字"
    ]
    //位置选项:项目内
    const onlyProject = ref(editTarget.position=="project")
    //添加空的新单位到开头，默认以上一个单位为基准
    function addUnit(){
        const lastUnit = newRule.units[0]
        newRule.units.unshift({
            name:"",
            target:lastUnit.name,
            equal:1
        })
    }
    //返回修改后的规则
    function confirm(){
        const newPosition = onlyProject.value?"project":"global"
        //检查是否符合条件
        console.log(newRule.units)
        if(!checkCustomTimeRule(newRule,newPosition)){return false}
        console.log(newRule.units)
        //按照从大到小的顺序重新排列单位
        const newUnits = sortRuleUnits(newRule.units)
        newRule.units = newUnits
        //如果传入为null，则添加新规则
        if(editTarget.targetRule==null){
            addCustomTimeRule(toRaw(newRule),newPosition)
        }
        //否则修改传入的规则的内容或位置
        else{
            console.log(newRule)
            Object.assign(editTarget.targetRule,toRaw(newRule))
            console.log(editTarget.targetRule)
            if(newPosition != editTarget.position){
                changeCustomTimeRulePosition(editTarget.targetRule,newPosition)
            }
            
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
@use "@/static/style/global.scss" as global;
@use "@/static/style/popUp.scss";
.editTimeRule{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: global.$bgColor;
    box-sizing: border-box;
    padding: 20px;
    z-index: 2;
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
    .finalButtons{
        @extend .finalButtons
    }
    
}

</style>