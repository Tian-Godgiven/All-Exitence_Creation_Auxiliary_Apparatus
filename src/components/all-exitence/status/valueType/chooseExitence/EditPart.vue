<template>
<div class="editChooseExitenceStatus">
    <div class="separateLine"></div>
    <div class="chooseList">
        <SwitchExpand class="type" v-for="type in list">
            <template #title>
                <div>{{ type.name }}</div>
            </template>
            <template #inner>
                <div class="exitenceContainer">
                    <template v-for="exitence in type.child">
                        <div class="exitence"
                            @click="chooseExitence(type,exitence)">
                            {{ exitence.name }}
                        </div>
                    </template>
                </div>
            </template>
        </SwitchExpand>
    </div>
    
</div>
</template>

<script setup lang='ts'>
import { Type } from '@/class/Type';
    import SwitchExpand from '@/components/other/SwitchExpand.vue';
    import { getTypeByKey, nowAllExitence } from '@/hooks/all-exitence/allExitence';
import { getSettingValue } from '@/hooks/all-exitence/status';
    import { addExitenceToChooseExitenceStatus, ChooseExitenceStatus } from '@/hooks/all-exitence/status/chooseExitence';
    import { computed } from 'vue';
    const {status,setting,disabled} = defineProps<{
        status:ChooseExitenceStatus,
        setting:Record<string,any>,
        disabled:boolean
    }>()

    //获取选项范围:属性设置：在指定分类中选择
    function getRange(){
        const setValue = getSettingValue(setting,"chooseFromType","string")
        if(setValue !== null && setValue != "all"){
            const typeKey = setting.chooseFromType as string;
            const type = getTypeByKey(typeKey)
            if(type){
                return [type]
            }
        }
        //无设置或设置无效：在所有分类中选择事物
        return nowAllExitence.types
    }
    const range:Type[] = getRange()
    //获取所有选项树的列表，不包含分组
    const list = computed(()=>{
        //属性设置：每分类可选数量
        const chooseExitenceNumPerType = getSettingValue(setting,"chooseExitenceNumPerType","number")
        const chosenList = getChosenExitenceKeyList()
        const list = range.flatMap(type=>{
            //遍历分类，获取其中尚未被选择的事物的key和name
            const exitences = type.exitence.flatMap(exitence=>{
                //是否已经被选中
                const ifChosen = chosenList.includes(exitence.__key)
                if(ifChosen)return []
                return {
                    name:exitence.name,
                    key:exitence.__key,
                }
            })
            //判断该分类当前是否可选
            let choosable = true
            if(chooseExitenceNumPerType !== null){
                if((type.exitence.length - exitences.length)>=chooseExitenceNumPerType){
                    choosable = false
                }
            }
            return {
                name:type.name,
                key:type.__key,
                child:exitences,
                choosable,//可选状态
            }
        })
        return list
    })
    //获取属性中已选择的事物key列表
    function getChosenExitenceKeyList(){
        const list:string[] = []
        for(let typeKey in status.value){
            //然后找到对应的exitenceKey列表
            list.push(...status.value[typeKey].exitenceKey)
        }
        return list
    }
    
    //选择某个事物对象,将其添加到属性值中
    function chooseExitence(type:{name:string,key:string,choosable:boolean},exitence:{key:string}){
        //不可选状态
        if(disabled || !type.choosable)return false
        //添加到对应分类下的事物key中
        addExitenceToChooseExitenceStatus(status,type.key,type.name,exitence.key)
    }
</script>

<style scoped lang='scss'>
.separateLine{
    margin: 10px;
    height: 3px;
	background-color: $bgColor80;
}
.editChooseExitenceStatus{
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    .chooseList{
        flex-grow: 1;
    }
}
.exitenceContainer{
    margin-left: 20px;
    display: flex;
    flex-wrap: wrap;
    gap: 5px 10px;
}
.exitence{
    flex-shrink: 0;
    height: 50px;
    padding: 5px 20px;
    border-radius: 30px;
    background-color: $bgColor40;
    color: white;
}
</style>