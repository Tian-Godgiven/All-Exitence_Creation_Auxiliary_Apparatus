<template>
	<div class="chapter">
		<div class="titleBar" ref="chapterRef" 
			:class="[
				(dragState.type=='be-dragging-over' && dragState.enter==true) ? 'dragIn':'',
				(dragState.type=='dragging' ? 'dragging':'')
			]">
			<div class="titleButtons" v-show="!manageMode">
				<div class="button" @click="clickAddArticle">插入文本</div>
				<div class="button" @click="clickAddChapter">插入章节</div>
			</div>

			<div class="titleButtons manageButtons" v-show="manageMode">
				<div @click="deleteChapterPopUp(from,chapter)">删除</div>
				<DragHandler>
					<div ref="handlerRef">拖动</div>
				</DragHandler>
			</div>
			
			<longTapContainerVue class="titleName" 
				:disabled="manageMode"
				@longtap = "longtap" 
				@click="swicthExpending()">
				<div class="text">{{chapter.name }}</div>
			</longTapContainerVue>
		</div>

		<div class="innerBar">
			<div class="before" :style="{width: 15 + 'px'}"></div>

			<div class="inner" v-show="expending && dragState.type!='dragging'">
				<chapterVue v-for="childChapter in chapters" 
					:key="chapter.__key"
					:level="level+1"
					:from="chapter"
					:chapter="childChapter">
				</chapterVue>

				<div v-for="(article,index) in articles">
					<articleVue 
						:key="article.__key"
						:from="chapter" 
						:article = "article">
					</articleVue>
					<div class="separator" v-if="index < articles.length-1"></div>
				</div>
			</div>
		</div>

		<indicatorVue v-if="dragState.type === 'be-dragging-over' 
      		&& dragState.edge!=null" :edge="dragState.edge"
      		gap="0px" />
		
	</div>

	<!-- 幻影元素 -->
	<Teleport v-if="dragState.type=='preview'" :to="dragState.container">
		<div class="chapterShadow">{{ chapter.name }}</div>
	</Teleport>
</template>

<script setup lang="ts" name="chapterVue"> 
	import { onMounted, onUnmounted, ref, inject, computed } from "vue";
	import articleVue from "./article.vue"
	import chapterVue from "./chapter.vue"
	import { addArticle, createChapter, focusOnChapter,focusOnArticle, deleteChapterPopUp ,updateChapter} from "@/hooks/all-articles/allArticles";
	import { showControlPanel } from "@/hooks/controlPanel";
	import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine"
	import {draggable,dropTargetForElements} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
	import {type Edge} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
	import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
	import { pointerOutsideOfPreview } from "@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview";
	import { Chapter } from "@/class/Chapter";
	import {
		attachInstruction,
		extractInstruction,
	} from '@atlaskit/pragmatic-drag-and-drop-hitbox/tree-item';
	import longTapContainerVue from "../../other/longTapContainer.vue";
	import indicatorVue from "@/components/other/indicator.vue";
	import { DragState } from '@/api/dragToSort';
import DragHandler from "@/components/global/DragHandler.vue";

	let {chapter,from,level} = defineProps<{chapter:Chapter,from:any,level:number}>()
	//展开与切换展开
	let expending = computed(()=>{
		return chapter.expending
	})
	function swicthExpending(){
		chapter.expending = !expending.value
	}

	//显示的内容
	let articles = computed(()=>{
		return chapter.articles
	})
	let chapters = computed(()=>{
		return chapter.chapters
	})

	//管理模式
	const manageMode:any = inject("manageMode",false)

	//拖拽功能的实现
	const chapterRef = ref<HTMLElement | null>(null)
	const handlerRef = ref<HTMLElement | null>(null)

	const idle:DragState = {type:"idle"}//初始拖拽状态
	const dragState = ref<DragState>(idle)//拖拽状态
	//获取数据
	function getChapterData(chapter:Chapter){
		return {
			type:"chapter",
			chapter,
			from,
			__key:chapter.__key
		}
	}

	let cleanup = ()=>{}
	onMounted(()=>{
		if(chapterRef.value == null || handlerRef.value==null)return;

		cleanup = combine(
			draggable({
				element:chapterRef.value,
				dragHandle:handlerRef.value,
				//设置初始的data
				getInitialData() {
					return getChapterData(chapter)
				},
				onGenerateDragPreview({ nativeSetDragImage }) {
					// 自定义预览内容
					setCustomNativeDragPreview({
						nativeSetDragImage,
						getOffset: pointerOutsideOfPreview({
							x: "16px",
							y: "8px",
						}),
						render({ container }) {
							dragState.value = { type: "preview", container };
						},
					});
				},
				onDrag(){
					dragState.value = {type:"dragging"}
				},
				onDrop(){
					dragState.value = idle
				}
			}),
			dropTargetForElements({
				element:chapterRef.value,
				canDrop({source}){
					if(source.element == chapterRef.value){
						return false
					}
					const type = source.data.type
					if(type == "chapter" || type == "article"){
						return true
					}
					return false
				},
				getData({input,element}){
					const data = getChapterData(chapter)
					return attachInstruction(data, {
						input,
						element,
						currentLevel: level, //该元素的level
						indentPerLevel: level*20, //该元素的缩进
						mode: 'standard'
					});
				},
				getIsSticky() {
					return true;
				},
				onDragEnter({self,location}){
					if(location.current.dropTargets[0] == self){
						changeState(self)
					}
					//否则默认状态
					else{
						dragState.value = idle
					}
				},
				onDrag({self,location}){
					if(location.current.dropTargets[0] == self){
						//如果状态已经改变了，则不变
						const instruction = extractInstruction(self.data)
						if(!instruction)return
						let edge :Edge|null = null
						if(instruction.type == "reorder-above"){
							edge = "top"
						}
						else if(instruction.type == "reorder-below"){
							edge = "bottom"
						}
						if(dragState.value.type!="be-dragging-over" || dragState.value.edge != edge){
							changeState(self)
						}
					}
					//否则默认状态
					else{
						dragState.value = idle
					}
				},
				// 拖离时重置元素状态
				onDragLeave() {
					dragState.value = idle
				},
				onDrop() {
					dragState.value = idle
				},

			})
		)
	})

	onUnmounted(()=>{
		cleanup()
	})

	function changeState(self:any){
		// self为该元素的简易数据
		const instruction = extractInstruction(self.data)
		if(!instruction)return
		let edge:Edge|null = null
		let enter : boolean|null = false
		if(instruction.type == "reorder-above"){
			edge = "top"
		}
		else if(instruction.type == "reorder-below"){
			edge = "bottom"
		}
		else if(instruction.type == "make-child"){
			enter = true
		}
		else{
			return null
		}
		// 修改该元素的状态为:正在被拖入，会显示提示线条，并设置其所处的边界（上or下
		dragState.value = { type: "be-dragging-over", enter, edge };
	}


	//点击插入章节
	async function clickAddChapter(){
		//弹出创建章节页面
		const newChapter = await createChapter(chapter)
		chapter.expending=true
		//聚焦到该章节
		focusOnChapter(newChapter)
	}

	//点击插入新文章
	async function clickAddArticle(){
		const newArticle = addArticle(chapter)
		//聚焦到该文章
		chapter.expending=true
		focusOnArticle(newArticle)
	}

	//长按显示控制面板
	function longtap(){
		showControlPanel([{
			text:"删除",
			click:()=>{deleteChapterPopUp(from,chapter)}
		},{
			text:"重命名",
			click:()=>{updateChapter(chapter)}
		}])
	}
</script>



 
<style lang="scss" scoped>
@use "@/static/style/components/leftPage.scss";
	.chapter{
		position: relative;
		.titleBar{
			background-color: $bgColor80;
			height: 70px;
			.titleName{
				height: 65px;
				font-size: $midFontSize;
			}
		}
		.innerBar{
			display: flex;
			width: 100%;
			.before{
				flex-shrink: 0;
			}
			.inner{
				width: 100%;
			}
		}
		.dragIn{
			box-sizing: border-box;
			border: 5px solid blue;
		}
		.dragging{
			opacity: 0.5;
		}
	}
	.separator{
		@extend .leftPageSeparator
	}
	.chapterShadow{
		background-color: white;
		width: 100px;
		height: 50px;
		border: 3px solid black;
	}
</style>