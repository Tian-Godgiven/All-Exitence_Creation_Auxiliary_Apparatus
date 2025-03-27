<template>
<div class="customTime">
    <div class="manager">
        <div class="topBar">
            <div>自定义时间</div>
            <Button @click="addTimeRule" name="新增时间表达式" icon="add"></Button>
            <Button @click="closePopUp(popUp)" name="关闭" icon="close"></Button>
        </div>
        
        <div class="timeRules">
            <TimeRule v-for="rule in customTimeLib" :key="rule.__key" :rule="rule">
                <div @click="deleteCustomTimeRule(rule)">删除</div>
                <div @click="editTimeRule(rule)">编辑</div>
            </TimeRule>
        </div>
    </div>
    <Transition name="slide">
        <EditTimeRule ref="editPageRef" v-if="ifShowEditPage" ></EditTimeRule>
    </Transition>
    

</div>
    
</template>

<script setup lang='ts'>
    import EditTimeRule from '../components/EditTimeRule.vue';
    import { CustomTimeRule, deleteCustomTimeRule, customTimeLib, ifShowEditPage, showEditPage } from '../customTime';
    import TimeRule from '../components/TimeRule.vue';
    import Button from '@/components/global/Button.vue';
import { closePopUp, PopUp } from '@/hooks/pages/popUp';
    const {popUp} = defineProps<{popUp:PopUp}>()    
    //添加新的时间表达式
    function addTimeRule(){
        //显示编辑页面，传入空内容
        showEditPage(null)
    }
    //编辑时间表达式
    function editTimeRule(targetRule:CustomTimeRule){
        //显示编辑页面
        showEditPage(targetRule)
    }
   
</script>

<style scoped lang='scss'>
.customTime{
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    .topBar{
        display: flex;
        .button{
            border-radius: 10px;
            border: 3px solid black;
            height: 60px;
        }
    }
}
.slide-enter-active, .slide-leave-active {
    transition: transform 0.5s ease;
}

.slide-enter-from, .slide-leave-to /* .slide-leave-active in <2.1.8 */ {
    transform: translateX(100%); /* 初始状态在右侧外面 */
}

.slide-enter-to, .slide-leave-from /* .slide-leave-active in <2.1.8 */ {
    transform: translateX(0); /* 最终状态显示在父元素内 */
}
</style>