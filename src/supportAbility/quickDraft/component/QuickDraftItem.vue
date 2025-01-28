<template>
    <div class="quickDraftItem" @click.stop="focusingOn">        
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
</template>

<script setup lang='ts'>
    import { computed, reactive } from 'vue';
    import { QuickDraftItem, showFocusingPage } from '../quickDraft';
    import TextArea from '@/components/other/textArea/textArea.vue';
    import Time from '@/components/global/time.vue';
    const {quickDraftItem} = defineProps<{quickDraftItem:QuickDraftItem}>()
    const timeValue = computed(()=>{
        return {
            number:quickDraftItem.time,
            unit:"date"
        }
    }) 
    //点击聚焦到该暂记对象
    function focusingOn(){
        showFocusingPage(quickDraftItem)
    }
</script>

<style scoped lang='scss'>
@use "@/static/style/globalStyle.scss";
@use "@/static/style/global.scss" as global;
.quickDraftItem{
    width: 100%;
    box-sizing: border-box;
    position: relative;
    border: 3px solid black;
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

</style>