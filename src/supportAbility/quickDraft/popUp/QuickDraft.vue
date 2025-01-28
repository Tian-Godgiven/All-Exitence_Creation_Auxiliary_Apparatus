<template>
<div class="quickDraft">
    <div class="managePage">
        <div class="topButtons">
            <Button icon="add" name="创建" @click="create"></Button>
            <Button icon="manage" name="管理模式" @click="switchManageMode"></Button>
            <Button icon="floatWindow" name="切换悬浮窗" @click="switchFloatWindow"></Button>
            <Button icon="close" name="关闭" @click="closePopUp(popUp)"></Button>
        </div>
        <div class="quickDraftItems">
            <QuickDraftItem 
                v-for="quickDraftItem in quickDraft" 
                :quick-draft-item="quickDraftItem"/>
        </div>
    </div>
    <transition name="slide">
        <FocusingPage></FocusingPage>
    </transition>
</div>  
</template>

<script setup lang='ts'>
    import Button from '@/components/global/button.vue';    
    import { addQuickDraftItem, createQuickDraftItem, nowQuickDraft } from '../quickDraft';
    import { closePopUp, PopUp } from '@/hooks/pages/popUp';
    import QuickDraftItem from '../component/QuickDraftItem.vue';
    import FocusingPage from '../component/FocusingPage.vue';
    const {popUp} = defineProps<{popUp:PopUp}>()
    const quickDraft = nowQuickDraft
    //切换管理模式
    function switchManageMode(){

    }
    //切换显示悬浮窗
    function switchFloatWindow(){

    }

    //创建并添加新的暂记对象到最后
    function create(){
        const newItem = createQuickDraftItem()
        addQuickDraftItem(newItem,0)
    }

    //当前聚焦的对象
    
</script>

<style scoped lang='scss'>
.quickDraft{
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    .managePage{
        width: 100%;
        position: relative;
        z-index: 1;
        .topButtons{
            margin-left: auto;
            display: flex;
            >.button{
                width: 90px;
                height: 90px;
            }
        }
        .quickDraftItems{
            box-sizing: border-box;
            width: 100%;
            gap: 10px;
            display: flex;
            flex-direction: column;
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