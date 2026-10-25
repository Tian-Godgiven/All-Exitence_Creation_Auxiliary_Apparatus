<template>
<TargetContainer textAligh="center" ref="containerRef">
    <template #title class="title">
        <textAreaVue
            mode="string"
            placeholder="输入标题"
            v-model="article.title"
            :inputSupport="true">
        </textAreaVue>
    </template>
    <template #inner>
        <textAreaVue 
            ref="document"
            class="articleText"
            inputSuggestionList="all"
            v-model="article.inner"
            :inputSupport="true"> 
        </textAreaVue>
    </template>
    <template #info>
        <div class="articleInfo">
            <span class="wordCount">字数: {{textNum}}</span>
            <button v-for="item in timeLineReferences" :key="item.node.__key" class="timeLineReference" @click="showTimeLinePage({ timeLineKey: item.timeLine.__key, segmentKey: item.segment.__key, nodeKey: item.node.__key })">
                {{ timeLineReferences.length > 1 ? `${item.timeLine.name} / ${item.segment.name}: ` : '' }}{{ formatReferenceTime(item.segment, item.node) }}
            </button>
        </div>
    </template>
</TargetContainer>
</template>

<script setup lang='ts'>
    import { computed, onMounted, onUnmounted, useTemplateRef } from 'vue';
    import textAreaVue from '@/components/other/textArea/textArea.vue';
    import { translateToTextContent } from '@/hooks/expression/textAreaContent';
import TargetContainer from './TargetContainer.vue';
import { Article } from '@/class/Article';
import { showOnMain } from '@/hooks/pages/mainPage/showOnMain';
import { formatTimeLineDate, getTimeLineDate, nowStoryTimeLines, showTimeLinePage } from '@/supportAbility/timeLine/timeLine';
import type { TimeLineNode, TimeLineSegment } from '@/supportAbility/timeLine/timeLine';
    const {article} = defineProps<{
        article:Article,
    }>()
    // 内容栏字符数量
	let textNum = computed(()=>{
        const inner = translateToTextContent(article.inner)
		return inner.length
	})
    const timeLineReferences = computed(() => nowStoryTimeLines.flatMap(timeLine => timeLine.segments.flatMap(segment => segment.nodes.filter(node => node.target?.type === 'article' && node.target.key === article.__key).map(node => ({ timeLine, segment, node })))))
    function formatReferenceTime(segment: TimeLineSegment, node: TimeLineNode){
        const prefix = segment.axisOrigin && segment.calendarName ? `${segment.calendarName} ` : ''
        const start = formatTimeLineDate(segment, node.start)
        const unit = segment.axisOrigin ? '' : segment.unit
        if(node.end == null || node.end <= node.start) return `${prefix}${start}${unit}`
        let end = formatTimeLineDate(segment, node.end)
        const startDate = getTimeLineDate(segment, node.start)
        const endDate = getTimeLineDate(segment, node.end)
        if(startDate && endDate && startDate.getFullYear() === endDate.getFullYear()){
            if(segment.unit === '日' && startDate.getMonth() === endDate.getMonth()) end = `${endDate.getDate()}日`
            else if(segment.unit === '日') end = `${endDate.getMonth() + 1}月${endDate.getDate()}日`
            else if(segment.unit === '月') end = `${endDate.getMonth() + 1}月`
        }
        return `${prefix}${start}${unit}~${end}${unit}`
    }

    let containerRef = useTemplateRef("containerRef")
    // 记录文档滑动位置
    function getScrollTop(){
        //当前滑动位置
        if(containerRef.value){
            const scrollTop = containerRef.value.getScrollTop()
            if(scrollTop){
                showOnMain.scrollTop = scrollTop
                return;
            }
        }
        showOnMain.scrollTop = 0
        return 0
    }
    onMounted(()=>{
        //设定当前的滑动高度
        if(containerRef.value){
            containerRef.value.setScrollTop(article.lastScrollTop)
        }
        window.addEventListener("getShowOnMainScrollTop",getScrollTop)
    })
    onUnmounted(()=>{
        window.removeEventListener("getShowOnMainScrollTop",getScrollTop)
    })
    
</script>

<style scoped lang='scss'>
    .articleText{
        min-height: 40%;
        padding-bottom: 100%;
        height: auto;
        overflow: visible;
    }
    .articleInfo { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
    .wordCount { padding: 5px 12px; border-radius: 6px; background: rgba($antiBgColor, 0.6); color: $bgColor; }
    .timeLineReference { max-width: 260px; padding: 0; border: 0; background: transparent; color: $previewText; font: inherit; text-align: right; cursor: pointer; overflow-wrap: anywhere; }
    .timeLineReference:hover { text-decoration: underline; }
</style>
