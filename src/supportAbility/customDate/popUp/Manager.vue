<template>
<div class="customTime">
    <div class="manager">
        <div @click="addTimeRule">新增</div>
        <div class="timeRules">
            <div v-for="rule in allTimeRule">
                名称，规则，数符, 删除，
                <div @click="editTimeRule(rule)">编辑</div>
            </div>
        </div>
    </div>
    <EditTimeRule ref="editPageRef" :timeRule="timeRule"></EditTimeRule>
</div>
    
</template>

<script setup lang='ts'>
    import { ref } from 'vue';
    import EditTimeRule from '../components/EditTimeRule.vue';
    import { CustomTimeRule } from '../customTime';
    import { gsap } from 'gsap/gsap-core';

    const allTimeRule = []
    //显示在编辑页面的时间表达式
    const timeRule = ref<CustomTimeRule|null>(null)
    function addTimeRule(){
        //显示编辑页面，传入空内容
        timeRule.value = null
        showEditPage()
    }
    //编辑时间表达式
    function editTimeRule(theRule:CustomTimeRule){
        //显示编辑页面
        timeRule.value = theRule
        showEditPage()
    }
    //显示编辑页面
    const editPageRef = ref()
    function showEditPage(){
        if(!editPageRef.value)return
        const dom = editPageRef.value.$el
        gsap.to(dom,{
            x:"0",
            ease:"power1.inOut"
        })
    }
</script>

<style scoped lang='scss'>
    .customTime{
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
</style>