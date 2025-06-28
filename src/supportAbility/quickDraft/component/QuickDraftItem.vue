<template>
<div class="quickDraftItem" ref="itemRef">  
    <LongTap class="container" :disabled="manageMode" :longTap="longTap" :click="click">
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
    </LongTap>
</div>
    
</template>

<script setup lang='ts'>
        import { deleteQuickDraftItem, QuickDraftItem, showFocusingPage } from '../quickDraft';
    import TextArea from '@/components/other/textArea/textArea.vue';
    import Time from '@/components/global/time.vue';
    import LongTap from '@/components/other/LongTap.vue';
    import { showControlPanel } from '@/hooks/controlPanel';

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
</script>

<style scoped lang='scss'>
.quickDraftItem{
.content{
    width: 100%;
    height: 100%;
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
.sideBar{
    width: 20%;
    align-self: center;
    justify-self: center;
}

.container{
    display: flex;
}
    
}

</style>