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
        字数: {{textNum}}
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
    const {article} = defineProps<{
        article:Article,
    }>()
    // 内容栏字符数量
	let textNum = computed(()=>{
        const inner = translateToTextContent(article.inner)
		return inner.length
	})

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
</style>