<template>
<div class="quickDraft">
    <div class="managePage">
        <div class="topButtons">
            <Button icon="add" name="创建" @click="create"></Button>
            <Button icon="manage" name="管理模式" @click="switchManageMode"></Button>
            <Button :icon="floatWindowKey?'hideFloat':'showFloat'" name="切换显示悬浮窗" @click="switchFloatWindow"></Button>
            <Button icon="close" name="关闭" @click="close"></Button>
        </div>
        <div class="quickDraftItems">
            <QuickDraftItem 
                v-for="quickDraftItem in quickDraft" 
                :key="quickDraftItem.__key"
                :manage-mode="manageMode"
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
    import { addQuickDraftItem, createQuickDraftItem, nowQuickDraft , switchQuickDraftFloatWindow, switchFoldFloatWindow, floatWindowKey } from '../quickDraft';
    import { closePopUp, PopUp } from '@/hooks/pages/popUp';
    import QuickDraftItem from '../component/QuickDraftItem.vue';
    import FocusingPage from '../component/FocusingPage.vue';
    import { ref,onMounted,onUnmounted, toRaw } from 'vue';
import { getMonitor } from '@/api/dragToSort';
    const {popUp} = defineProps<{popUp?:PopUp}>()
    const quickDraft = nowQuickDraft
    //切换管理模式
    const manageMode = ref(false)
    function switchManageMode(){
        manageMode.value = !manageMode.value
    }
    //管理放置事件
    let cleanup = ()=>{}
onMounted(()=>{
	cleanup = getMonitor({
        canMonitor:(source)=>{
            const data = source.data
            return data.type == "quickDraftItem"
        },
        "sourceIndex":(sourceData)=>{
            const key = sourceData.itemKey
            return quickDraft.findIndex((item)=>{
                return item.__key == key
            })
        },
        "targetIndex":(targetData)=>{
            const key = targetData.itemKey
            return quickDraft.findIndex((item)=>{
                return item.__key == key
            })
        },
        "list":toRaw(quickDraft),
        returnNewList:(newList)=>{
            Object.assign(quickDraft,newList)
        }
    })
})
onUnmounted(()=>{
	cleanup()
})
    //切换显示悬浮窗
    function switchFloatWindow(){
        switchQuickDraftFloatWindow()
    }

    //创建并添加新的暂记对象到开始
    function create(){
        const newItem = createQuickDraftItem()
        addQuickDraftItem(newItem,0)
    }

    //关闭
    function close(){
        if(popUp)closePopUp(popUp)
        else{
            //收起悬浮窗
            switchFoldFloatWindow(true)
        }
    }
    
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