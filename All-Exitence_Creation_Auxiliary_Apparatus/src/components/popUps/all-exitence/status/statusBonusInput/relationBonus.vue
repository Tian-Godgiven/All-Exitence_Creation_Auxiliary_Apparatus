<template>
    <div class="relationBonus">
        <div @click="addRelation">添加关联属性</div>
        <div @click="addUnit">创建关联单元</div>
    </div>
</template>

<script setup lang='ts'>
    import { showPopUp } from '@/hooks/pages/popUp';
    import Status from '@/interfaces/exitenceStatus';
    import { reactive, inject } from 'vue';

    const status = inject<any>('status');
    status.value = []
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
                //将这个属性添加到关联体当中,不需要其中的key
                relationSource[status.name] = {
                    value:status.value,
                    valueType:status.valueType,
                    setting:status.setting
                }
            }
        })
    }

    //点击创建一个新的关联单元，也就是向其中添加一个空对象
    function addUnit(){
        status.value.push({})
    }
</script>

<style scoped lang='scss'>

</style>