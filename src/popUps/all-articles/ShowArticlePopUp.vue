<template>
<TargetContainer class="showArticlePopUp" :if-info="false">
  	<template #title class="title">
        <TextArea
            mode="disabled"
            placeholder="输入标题"
            v-model="article.title"
            :inputSupport="true">
        </TextArea>
    </template>
	<template #topBar>
		<div class="buttons">
            <Button name="跳转至文章" @click="clickJumpToArticle" icon="showOnMain"></Button>
            <Button @click="closePopUp(popUp)" icon="closePopUp"></Button>
        </div>
	</template>
    <template #inner>
        <TextArea 
			placeholder="无内容"
			mode="disabled"
            class="articleText"
            v-model="article.inner"> 
        </TextArea>
    </template>
</TargetContainer>
</template>

<script setup lang="ts">
import TargetContainer from '@/app/pages/mainPage/components/TargetContainer.vue';
import { Article } from '@/class/Article';
import TextArea from '@/components/other/textArea/textArea.vue';
import { showTargetOnMain } from '@/hooks/pages/mainPage/showOnMain';
import { closePopUp, PopUp } from '@/hooks/pages/popUp';
import Button from '@/components/global/Button.vue';
	const {props,popUp} = defineProps<{
		props:{
			article:Article,
		},popUp:PopUp
	}>()
	const {article} = props
	function clickJumpToArticle(){
        closePopUp(popUp)
        showTargetOnMain({type:"article",target:article})
    }
</script>

<style scoped lang="scss">
.articleText{
	min-height: 40%;
	padding-bottom: 100%;
	height: auto;
	overflow: visible;
}
.buttons{
    height: 50px;
    display: flex;
    gap: 5px;
    .button{
        aspect-ratio: 1;
        height: 100%;
    }
}
</style>