<template>
<div class="quickDraftItem" ref="itemRef">  
    <LongTap :disabled="manageMode" :longTap="longTap" :click="click">
        <div class="content">
            <TextArea class="inner"
                placeholder="无内容"
                v-model="quickDraftItem.inner"
                mode="disabled">
            </TextArea>
            <div class="times">
                <Time class="time" 
                    :value="quickDraftItem.time" 
                    rule="date" 
                    unit-from="年" 
                    unit-end="日" 
                    linker="/" 
                    :show-unit="false">
                </Time>
                <Time class="time" 
                    :value="quickDraftItem.time" 
                    rule="date" 
                    unit-from="时" 
                    unit-end="分" 
                    linker=":" 
                    :show-unit="false">
                </Time>
            </div>
        </div>      
        
        <div class="sideBar" v-show="manageMode">
            <div @click="deleteQuickDraftItem(quickDraftItem)">删除</div>
            <DragHandler>
                <div ref="handlerRef">拖动</div>
            </DragHandler>
        </div>
        
        <Indicator v-if="dragState.type === 'be-dragging-edge' 
            && dragState.edge!=null" :edge="dragState.edge"
            gap="0px" />
    </LongTap>

    <Teleport v-if="dragState.type=='preview'" :to="dragState.container">
        <div class="chapterShadow"></div>
    </Teleport>
</div>
    
</template>

<script setup lang='ts'>
    import { onMounted, onUnmounted, ref } from 'vue';
    import { deleteQuickDraftItem, QuickDraftItem, showFocusingPage } from '../quickDraft';
    import TextArea from '@/components/other/textArea/textArea.vue';
    import Time from '@/components/global/time.vue';
    import LongTap from '@/components/other/LongTap.vue';
    import { showControlPanel } from '@/hooks/controlPanel';
    import { DragState, getCombine } from '@/api/dragToSort';

    import Indicator from '@/components/other/indicator.vue';
import DragHandler from '@/components/global/DragHandler.vue';
    const {quickDraftItem,manageMode} = defineProps<{quickDraftItem:QuickDraftItem,manageMode:boolean}>()
    //长按显示控制面板
    function longTap(){
        showControlPanel({
            option:[{
                text:"删除",
                click:()=>deleteQuickDraftItem(quickDraftItem)
            }]
        })
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
.quickDraftItem{
    box-sizing: border-box;
    position: relative;
    border: 3px solid black;
.content{

    .inner{
        min-height: 1.5rem;
        color: $bgColor40;
        @include textMaxLine(3);
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
    
}

</style>