<template>
<div class="relationBonus">
    <div class="relationInfo">
        <div class="infoTitle">
            <div>属性名</div>
            <div>属性类型</div>
            <div/>
        </div>
        <div class="info" v-for="childStatus in relationSource">
            <div>{{ childStatus.name }}</div>
            <div>{{ getValueType(childStatus.valueType) }}</div>
            <div @click="deleteRelationStatus(childStatus)">删除</div>
        </div>
    </div>
    
    <div class="buttons">
        <div class="button" @click="addRelation">添加关联属性</div>
        <div class="button" @click="addUnit">创建关联单元</div>
    </div>
</div>
</template>

<script setup lang='ts'>
    import { showQuickInfo } from '@/api/showQuickInfo';
    import Status from '@/interfaces/Status';
    import { reactive} from 'vue';
    import { statusValueTypeList } from '@/static/list/statusValueList';
import { getStatusSettingValue, setStatus, showCreateStatusPopUp } from '@/hooks/all-exitence/status';
import { Exitence, ExitenceStatus } from '@/class/Exitence';
import { Type } from '@/class/Type';

    const {status,fullStatus,target} = defineProps<{
        status:Status|ExitenceStatus,
        fullStatus:Status,
        target:Exitence|Type
    }>()

    //待测试：什么玩意要给它一个空值啊，初始存在一个空值
    status.value = [{}]
    const relationSource = reactive<Status[]>(
        getStatusSettingValue<Status>(fullStatus.setting,"relationSource","arr")
            ?? []
    )
    //为属性添加关联体设置,这个是响应式的值
    setStatus(status,"relationSource",relationSource)

    //点击弹出属性创建弹窗，将返回的属性放入关联体中
    function addRelation(){
        showCreateStatusPopUp({
            target:target,
            popUpSet:{
                mask:true,
                repeatable:true
            },
            banValueType:["multi","status"],//禁止复合和嵌套类属性
            returnValue:(status:Status)=>{
                //这个属性的名称是否已存在
                const ifExist = relationSource.find(childStatus=>{
                    return status.name == childStatus.name
                })
                if(ifExist != null){
                    showQuickInfo("关联属性的名称不可重复")
                    return false
                }
                //将这个属性添加到关联体当中
                relationSource.push(status)
            }
        })
    }

    //点击创建一个新的关联单元，也就是向其中添加一个空对象
    function addUnit(){
        status.value.push({})
    }

    //点击删除关联属性
    function deleteRelationStatus(status:Status){
        const index = relationSource.findIndex(childStatus=>status.name == childStatus.name)
        if(index >= 0){
            relationSource.splice(index)
        }
    }

    //获取属性值类型的中文名称
    function getValueType(value:string){
        return statusValueTypeList.find((tmp)=>tmp.value==value)?.label
    }
</script>

<style scoped lang='scss'>
    .relationInfo{
        display: grid;
        grid-template-columns: 2fr 3fr 1fr; /* 每行 3 列 */
        gap: 10px;
        .infoTitle{
            display: contents; /* 每个 row 不占据额外的空间 */
        }
        .info{
            display: contents;
        }
    }
    .buttons{
        width: 100%;
        display: flex;
        .button{
            display: flex;
            align-items: center;
            justify-content: center;
            border: 3px solid black;
            width: 50%;
            box-sizing: border-box;
            padding: 5px;
            margin: 5px;
        }
    }
</style>