<template>
<div class="timeLinePopUp">
    <div class="manage">
        <div class="topBar">
            <Button @click="createNew" name="新建"></Button>
            <div>管理</div>
        </div>
        <div class="container">
            <Line :timeLine=testTimeLine[0]></Line>
            <Line :timeLine=testTimeLine[1]></Line>
        </div>
    </div>

    <SlidePage :show="ifShowCreatePage">
        <CreateTimeLine></CreateTimeLine>
    </SlidePage>
    
</div>

    
</template>

<script setup lang='ts'>
    import Button from '@/components/global/Button.vue';
    import Line from './components/Line.vue'
    import CreateTimeLine from "./popUp/CreateTimeLine/CreateTimeLine.vue"
    import { ifShowCreatePage, nowAllTimeLine, showCreateTimeLine } from './timeLine';
    import SlidePage from '@/components/other/SlidePage.vue';

    const testTimeLine = [
        {
            targetType:"exitence",//时间线目标的类型
            timeRuleKey:"date",//该时间线所使用的时间规则的key
            now:null,//该时间线当前所处的位置，默认从最早的一个对象开始
            unitEnd:"日",
            item:[{
                label:["分类","事物"],
                key:{
                    typeKey:"123",
                    exitenceKey:"456"
                },
                time:new Date(2025,2,1)
            }]
        },
        {
            targetType:"exitence",//时间线目标的类型
            timeRuleKey:"lJBZCzI5469McfKuOTizE",//该时间线所使用的时间规则的key
            now:null,//该时间线当前所处的位置，默认从最早的一个对象开始
            unitEnd:null,
            item:[{
                label:["分类","事物"],
                key:{
                    typeKey:"123",
                    exitenceKey:"456"
                },
                time:1
            }]
        }
        
    ]

    //显示新建时间线
    function createNew(){
        showCreateTimeLine()
    }
    
</script>

<style scoped lang='scss'>
.timeLinePopUp{
    overflow: hidden;
    position: relative;
    width: 100%;
    height: 100%;
    .manage{
        .topBar{

        }
        .container{
            height: calc(100% - 50px);
        }
    }
}
</style>