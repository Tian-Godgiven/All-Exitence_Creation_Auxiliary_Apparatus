<template>
<div class="editTimeRule" ref="pageRef">
    <DownLineInput class="name" 
        v-model="newRule.name" 
        placeholder="自定义时间名称"/>
    <div class="selectNumFormat">
        <ElSelect
        v-model="newRule.numFormat">
            <ElOption
                v-for="item in numFormatChoice"
                :key="item"
                :value="item"/>
        </ElSelect>
    </div>
    <div class="units">
        <div>已有单位</div>
        <div class="addNewUnit" @click="addUnit">新增</div>
        <div class="unit" v-for="unit in newRule.units">
            <DownLineInput 
                class="unitName"
                v-model="unit.name" 
                placeholder="单位名称（必需）"/>
            <div>=</div>
            <DownLineInput 
                v-if="unit.target"
                class="unitEqual"
                v-model="unit.equal" 
                placeholder="相等值"/>
            <ElSelect v-model="unit.target">
                <ElOption
                    :label="item.label"
                    :value="item.value"
                    v-for="item in unitTargetChoice">
                </ElOption>
            </ElSelect>
        </div>
    </div>
    
    <div class="finalButtons">
        <Button name="确认" @click="confirm">确认</Button>
        <Button name="返回" @click="returnManage">返回</Button>
    </div>
</div>
</template>

<script setup lang='ts'>
    import { computed, reactive, ref} from 'vue';
import { CustomTimeRule} from '../customTime';
import { cloneDeep } from 'lodash';
import DownLineInput from '@/components/other/input/downLineInput.vue';
import { ElOption, ElSelect } from 'element-plus';
import Button from '@/components/global/button.vue';
import { gsap } from 'gsap/gsap-core';
    let {timeRule=null} = defineProps<{timeRule:CustomTimeRule|null}>()
    //若为空则创建
    let tmp = timeRule
    if(tmp == null){
        tmp = {
            name:"",
            numFormat:"阿拉伯数字",
            units:[]
        }
    }
    //拷贝编辑对象
    const newRule = reactive(cloneDeep(tmp))
    //数符选项
    const numFormatChoice:CustomTimeRule["numFormat"][] = [
        "简体中文数字",
        "繁体中文数字",
        "阿拉伯数字"
    ]
    //单位目标选项
    const unitTargetChoice = computed(()=>{
        const tmp:{label:string,value:string|false}[] = 
            [{label:"最小单位",value:false}]
        for(const unit of newRule.units){
            if(unit.name != ""){
                tmp.push({
                    value:unit.name,
                    label:unit.name
                })
            }
        }
        return tmp
    })
    //添加空的新单位
    function addUnit(){
        newRule.units.push({
            name:"",
            target:false,
        })
    }
    //返回修改后的规则
    function confirm(){
        //确认名称不重复
        //所有单位的单位名都存在
        //所有单位的目标单位名都存在
        returnManage()
    }
    //返回管理页面
    const pageRef = ref()
    function returnManage(){
        if(!pageRef.value)return  
        const dom = pageRef.value
        gsap.to(dom,{
            x:"100%",
            ease:"power1.inOut"
        })
    }
</script>

<style scoped lang='scss'>
@use "@/static/style/global.scss" as global;
    .editTimeRule{
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background-color: global.$bgColor;
        transform: translateX(100%);
        box-sizing: border-box;
        padding: 20px;
        z-index: 2;
    }
</style>