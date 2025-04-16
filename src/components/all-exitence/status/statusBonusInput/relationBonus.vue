<template>
    <div class="relationBonus">
        <div class="relationInfo">
            <div class="infoTitle">
                <div>属性名</div>
                <div>属性类型</div>
                <div/>
            </div>
            <div class="info" v-for="(value,key) in relationSource">
                <div>{{ key }}</div>
                <div>{{ getValueType(value.valueType) }}</div>
                <div @click="deleteRelationStatus(key as string)">删除</div>
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
    import { showPopUp } from '@/hooks/pages/popUp';
    import Status from '@/interfaces/Status';
    import { reactive, inject } from 'vue';
    import { statusValueTypeList } from '@/static/list/statusValueList';

    const status = inject<any>('status');
    //初始存在一个空值
    status.value = [{}]
    const allStatus = inject<any>("allStatus")
    const allTypeStatus = inject<any>("allTypeStatus")

    const relationSource = reactive<{[statusName:string]:any}>({})
    //为属性添加关联体设置
    status.setting["relationSource"] = relationSource

    //点击弹出属性创建弹窗，将返回的属性放入关联体中
    function addRelation(){
        showPopUp({
            vueName:"createStatus",
            mask:true,
            buttons:[],
            props:{
                banValueType:["multi","status"],//禁止复合和嵌套类属性
				allStatus,
				allTypeStatus
            },
            returnValue:(status:Status)=>{
                //这个属性的名称是否已存在
                if(relationSource[status.name] != null){
                    showQuickInfo("关联属性的名称不可重复")
                    return false
                }
                //将这个属性添加到关联体当中
                relationSource[status.name] = status
            }
        })
    }

    //点击创建一个新的关联单元，也就是向其中添加一个空对象
    function addUnit(){
        status.value.push({})
    }

    //点击删除关联属性
    function deleteRelationStatus(statusName:string){
        delete relationSource[statusName]
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