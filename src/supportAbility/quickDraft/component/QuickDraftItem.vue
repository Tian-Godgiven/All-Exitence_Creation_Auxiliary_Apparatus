<template>
<div class="quickDraftItem" ref="itemRef">  
    <LongTapContainer :disabled="manageMode" @longtap="longTap" @click="click">
        <div class="content">
            <TextArea class="inner"
                placeholder="无内容"
                v-model="quickDraftItem.inner"
                :mode="'disabled'">
            </TextArea>
            <div class="times">
                <Time class="time" :value="timeValue" rule="date" unit-from="year" unit-end="day" linker="/" :show-unit="false"></Time>
                <Time class="time" :value="timeValue" rule="date" unit-from="hour" unit-end="minute" linker=":" :show-unit="false"></Time>
            </div>
        </div>      
        
        <div class="sideBar" v-show="manageMode">
            <div @click="deleteQuickDraftItem(quickDraftItem)">删除</div>
            <div ref="handlerRef">拖拽</div>
        </div>
        
        <Indicator v-if="dragState.type === 'be-dragging-edge' 
            && dragState.edge!=null" :edge="dragState.edge"
            gap="0px" />
    </LongTapContainer>

    <Teleport v-if="dragState.type=='preview'" :to="dragState.container">
        <div class="chapterShadow">{{  }}</div>
    </Teleport>
</div>
    
</template>

<script setup lang='ts'>
    import { computed, onMounted, onUnmounted, ref } from 'vue';
    import { deleteQuickDraftItem, QuickDraftItem, showFocusingPage } from '../quickDraft';
    import TextArea from '@/components/other/textArea/textArea.vue';
    import Time from '@/components/global/time.vue';
import LongTapContainer from '@/components/other/longTapContainer.vue';
import { showControlPanel } from '@/hooks/controlPanel';
import { DragState, getCombine } from '@/api/dragToSort';

import Indicator from '@/components/other/indicator.vue';
    const {quickDraftItem,manageMode} = defineProps<{quickDraftItem:QuickDraftItem,manageMode:boolean}>()
    const timeValue = computed(()=>{
        return {
            number:quickDraftItem.time,
            unit:"date"
        }
    }) 
    //长按显示控制面板
    function longTap(){
        showControlPanel([{
            "text":"删除",
            "click":()=>deleteQuickDraftItem(quickDraftItem)
        }])
    }
    //点击聚焦到该暂记对象
    function click(){
        showFocusingPage(quickDraftItem)
    }
    //拖拽功能
    const itemRef = ref()
    const handlerRef = ref()
    const idle:DragState = {type:"idle"}
    const dragState = ref<DragState>(idle)
    let clean = ()=>{}
    onMounted(()=>{
        clean = getCombine({
            "element":itemRef.value,
            "dragHandle":handlerRef.value,
            canDrop:()=>{
                return true
            },
            dragState,
            idle,
            getData:()=>{
                return {
                    type:"quickDraftItem",
                    itemKey:quickDraftItem.__key
                }
            },
            preview:false
        })
    })
    onUnmounted(()=>{
        clean()
    })
</script>

<style scoped lang='scss'>
@use "@/static/style/globalStyle.scss";
@use "@/static/style/global.scss" as global;
.quickDraftItem{
    box-sizing: border-box;
    position: relative;
    border: 3px solid black;
.content{
    //只显示3行内容
    .inner{
        min-height: 1.5rem;
        max-height: 4rem;
        color: global.$bgColor40;
        overflow: hidden;
        @extend .dontShowMoreText;
    }
    .times{
        display: flex;
        gap: 10px;
        width: calc(100% - 60px);
        .time{
            height: 1rem;
            text-wrap: nowrap;
            font-size: 0.7rem;
        }
    }
}
.sideBar{

}
    
}

</style>