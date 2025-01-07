<template>
    <div class="groupRule">
        <div class="target">{{ ruleTarget }}</div>
        <div class="simbol">{{ ruleSimbol }}</div>
        <div class="value">{{ ruleValue}}</div>
        <div class="delete" @click="deleteRule">删除</div>
        <div class="dragHandle">拖</div>
    </div>
</template>

<script setup lang='ts'>
    import { showQuickInfo } from '@/api/showQuickInfo';
import { getTypeStatusByKey } from '@/hooks/all-exitence/allExitence';
import { separateRule } from '@/hooks/expression/groupRule';
import { inject } from 'vue';
    const {rule} = defineProps(["rule"])
    const type = inject<any>("type")
    const emits = defineEmits(["deleteRule"])
    //将rule中的部分拆开
    const ruleObject = separateRule(rule)

    const ruleSimbol = ruleObject?.simbol
    const ruleValue = ruleObject?.value
    //根据rule的显示规则翻译对象
    const ruleTarget = (function(){
        if(ruleObject?.ifHave){
            return translateTarget() + "中的任意值"
        }
        else{
            return translateTarget()
        }
    }())
    function translateTarget(){
        const theTarget = ruleObject?.target
        if(!theTarget){
            return ""
        }
        switch(theTarget){
            case "name":
                return "事物名称"
            case "statusNum":
                return "属性数量"
            case "tag":
                return "事物标签"
            default:
                //事物的某个属性值：提取其中的属性key
                const regex1 = /^\[(.*)\]\.value$/; 
                const key = theTarget.match(regex1)?.[1];
                if (key) {
                    if(key=="allStatus"){
                        return "事物的所有属性"
                    }
                    //获取属性对象
                    const status = getTypeStatusByKey(key,type.typeStatus);
                    if(!status){
                        showQuickInfo("错误：未知的属性key")
                        return ""
                    }
                    return `事物属性: ${status.name}`
                } 
                //事物的某个设置值
                else{
                    const regex2 = /^setting\[(.*)\]$/;  // 匹配 setting[name] 结构
                    const setName = theTarget.match(regex2);
                    if(setName){
                        return `事物的${setName}设置项`
                    }
                    else{
                        showQuickInfo("错误：未定义含义的分组规则对象")
                        return ""
                    }
                }
        }
    }
    //删除该规则
    function deleteRule(){
        emits("deleteRule")
    }
</script>

<style scoped lang='scss'>
    .groupRule{
        display: flex;
        margin: 5px 0;
        border: 3px solid black;
        border-radius: 5px;
        >div{
            margin: 5px;
            
        }
    }
</style>