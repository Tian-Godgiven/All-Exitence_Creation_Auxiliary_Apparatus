<template>
<div class="leftPage" :style="{left:leftWidth}">
	<div class="top">
		<div class="desktopModes" v-if="!nowLeftManage">
			<button type="button" :class="{active: !model}" @click="changeLeftPageMode('all-article')">文章</button>
			<button type="button" :class="{active: model}" @click="changeLeftPageMode('all-exitence')">万物</button>
		</div>
		<div class="title" :class="nowLeftManage?'manageMode':''" 
			@click="title.click">
			{{ title.name }}
		</div>
		<div class="buttons">
			<Button name="管理" @click="switchManageMode" icon="manage"></Button>
			<Button name="搜索" @click="search" icon="search"></Button>
			<Button name="全部收起" @click="foldAll" icon="allFold"/>
			<Button name="新建" @click="createNew" icon="addNew"></Button>
			<Menu vertical="right" horizen="bottom">
				<template #default={switchMenu}>
					<Button name="显示更多" 
						@click="switchMenu" icon="more">
					</Button>
				</template>
				<template #menu>
					<ListMenu title="更多" :list></ListMenu>
				</template>
			</Menu>
		</div>
	</div>
	<div class="inner" ref="leftInnerRef">
		<AllExitence v-show="model"/>
		<AllArticles v-show="!model"/>
		<div class="scrollBottom"></div>
	</div>
</div>
</template>

<script setup lang="ts" name="LeftPage">
	import { leftMaxWidth, leftShowWidth } from '@/hooks/pages/pageChange';
	import AllExitence from './components/all-exitence/all-exitence.vue';
	import AllArticles from './components/all-articles/all-articles.vue';
	import { computed, nextTick, onMounted, useTemplateRef, watch } from "vue"
	import { createEmptyType, nowAllExitence } from '@/hooks/all-exitence/allExitence';
	import { showTargetOnMain } from '@/hooks/pages/mainPage/showOnMain';
	import { hidePage } from '@/hooks/pages/pageChange';
	import { addChapterPopUp, nowAllArticles } from '@/hooks/all-articles/allArticles';
	import { Type } from '@/class/Type';
	import { Chapter } from '@/class/Chapter';
	import { changeLeftPageMode, nowLeftManage, nowLeftPageMode, scrollTargetId } from '@/hooks/pages/leftPage';
	import Button from '@/components/global/button.vue';
	import Menu from '@/components/global/Menu.vue';
import ListMenu from '@/components/global/ListMenu.vue';
import { callSupportAbility } from '@/hooks/app/app';
	//左侧宽度
	const leftWidth = computed(()=>{
		//出现变化时关闭管理模式
		nowLeftManage.value = false
		return (leftShowWidth.value - leftMaxWidth)+'px'
	})

	// 当前模式 true = [万物] false = [文本]
	const model = computed(()=>{
		if(nowLeftPageMode.value == "all-exitence"){
			return true
		}
		return false
	})

	//当前显示的标题
	const title = computed(()=>{
		if(nowLeftManage.value){
			return {
				name:"结束管理",
				click:switchManageMode
			}
		}
		return {
			name:model.value?"万物":"文章",
			click:()=>changeLeftPageMode()
		}
	})

	//点击切换管理模式:管理万物中的分类/分组+管理章节
	function switchManageMode(){
		nowLeftManage.value = !nowLeftManage.value;
	}

	//点击收起当前所有内容
	function foldAll(){
		//万物
		if(model.value){
			nowAllExitence.types.forEach((type:Type) => {
				//将其收起
				type.expending = false
				//分组
				type.groups.forEach((group)=>{
					group.expending = false
				})
			});
		}
		//文章
		else{
			nowAllArticles.chapters.forEach((chapter)=>{
				//递归折叠所有章节
				expandingChapter(chapter)
			})
			function expandingChapter(chapter:Chapter){
				chapter.expending = false
				chapter.chapters.forEach((chapter)=>{
					expandingChapter(chapter)
				})
			}
		}
	}
	
	//创建新分类/章节
	function createNew(){
		//万物类
		if(model.value){
			const type = createEmptyType()
			showTargetOnMain({
				type:"type",
				target:type
			})
			hidePage("left")
		}
		else{
			addChapterPopUp()
		}
	}
	
	//搜索
	function search(){
		callSupportAbility("search")
	}
	
	//滚动到指定的div
	const leftInnerRef = useTemplateRef("leftInnerRef")
	onMounted(()=>{
		watch(scrollTargetId,()=>{
			if(leftInnerRef.value && scrollTargetId.value){
				const targetElement = leftInnerRef.value.querySelector("#"+scrollTargetId.value)
				if(targetElement){
					//等待元素加载
					nextTick(()=>{
						targetElement.scrollIntoView({
							behavior: 'smooth',  // 滚动动画
							block: 'center',       // 滚动到目标元素的顶部
							inline: 'nearest'
						})
					})
				}
			}
		},{
			immediate:true
		})
	})

	//更多菜单选项 待完成
	const list:{label:string,click:()=>void}[] = [
		// {label:"导入导出",click:()=>{}},
		// {label:"设置",click:()=>{}}
	]
	
	
</script>

<style lang="scss" scoped>
.desktopModes{ display: none; }
@media (min-width: 900px){
	.leftPage.leftPage{
		left: 0 !important;
		width: 320px !important;
		border-right: 1px solid $bgColor70;
		box-sizing: border-box;
		> .top{
			height: 110px;
			flex-wrap: wrap;
			.desktopModes{
				display: flex;
				width: 100%;
				height: 54px;
				button{
					flex: 1;
					border: 0;
					border-bottom: 2px solid transparent;
					background: transparent;
					color: inherit;
					cursor: pointer;
					font: inherit;
					&.active{ border-bottom-color: currentColor; font-weight: 600; }
				}
			}
			.title:not(.manageMode){ display: none; }
			.title.manageMode{ height: 54px; width: 100%; font-size: 1rem; }
			.buttons{
				height: 53px;
				width: 100%;
				.button{ width: 48px; }
			}
		}
	}
}
.leftPage{
	top:0; 
	height: 100%;
	width: 650px;
	background-color: $bgColor;
	position: absolute;
	z-index: 5;
	overflow: hidden;
	> .top{
		width:100%;
		word-break: break-all;
		background-color: $bgColor;
		height: 110px;
		display: flex;
		position: relative;
		z-index: 1;
		box-sizing: border-box;
		border-bottom: 1px solid $bgColor70;
		.title{
			flex-grow: 1;
			display: flex;
			align-items: center;
			font-weight: 600;
			width: 250px;
			height: 100%;
			font-size: $bigFontSize;
			&.manageMode{
				font-size: 1.8rem;
			}
		}
		.buttons{
			height: 100%;
			display: flex;
			.button{
				width: 75px;
				height: 100%;
				box-sizing: border-box;
			}
		}
	}
	> .inner{
		position: relative;
		overflow: auto;
		scrollbar-width: none;
		height: calc(100vh - 110px);
		z-index: 0;
		.scrollBottom{
			width: 100%;
			height: 100px;
		}
	}
	
}

@media (min-width: 900px){
	.leftPage.leftPage > .top{
		height: 120px;
		.desktopModes, .title.manageMode{ height: 60px; }
		.desktopModes button{ font-size: 1.1rem; }
		.buttons{
			height: 60px;
			.button{
				height: 60px;
				padding: 14px;
			}
		}
	}
	.leftPage.leftPage > .inner{ height: calc(100% - 120px); }
}
</style>
