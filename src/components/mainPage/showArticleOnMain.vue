<template>
<TargetContainer textAligh="center">
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
    import { computed } from 'vue';
    import textAreaVue from '@/components/other/textArea/textArea.vue';
    import { translateToTextContent } from '@/hooks/expression/textAreaContent';
import TargetContainer from './TargetContainer.vue';
    const {article} = defineProps(["article"])
    // 内容栏字符数量
	let textNum = computed(()=>{
        const inner = translateToTextContent(article.inner)
		return inner.length
	})
</script>

<style scoped lang='scss'>
    .articleText{
        :deep(.textArea){
            min-height: 40%;
            padding-bottom: 100%;
            height: auto;
        }
    }
</style>