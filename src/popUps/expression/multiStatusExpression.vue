<template>
	<div>
		<!-- 显示区 -->
		<textAreaVue 
			placeholder="输入表达式"
			:inputSuggestionList="inputSuggestionList"
			ref="textArea"
			class="showArea"
			v-model="inputValue"
			:inputSupport="true"/>
		<!-- 输入区 -->
		<div class="inputArea">
			<div class="quote">
				<div @click="quoteStatus">引用属性</div>
				<div @click="quotePart">引用部分</div>
			</div>
			<div class="keyBoard">
				<div @click="clickButton('+')">+</div>
				<div @click="clickButton('-')">-</div>
				<div @click="clickButton('backSpace')" class="backSpace">退格</div>
				
				<div @click="clickButton('*')">*</div>
				<div @click="clickButton('/')">/</div>
				
				<div @click="clickButton('%')">%</div>
				<div @click="clickButton('^')">次方</div>
				<div @click="clickButton('^^')">开方</div>
			</div>
		</div>
		
		<!-- 待完成：写一个注意事项说清楚顺序执行，没有乘除优先 -->
		<div class="errorArea">报错信息：
			<div v-for="text in errorMsg" class="errorMsg">{{ text }}</div>
		</div>

		<div class="buttons">
			<div class="button" @click="onConfirm">确认</div>
			<div class="button" @click="closePopUp(popUp)">返回</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="">
	import { onMounted, onUnmounted, ref, shallowRef } from 'vue'; 
	import { closePopUp, showPopUp } from '@/hooks/pages/popUp';
	import chooseFromListVue from '@/components/other/chooseFromList.vue';
	import textAreaVue from '@/components/other/textArea/textArea.vue';
	import { showQuickInfo } from '@/api/showQuickInfo';
	import { suggestionItem } from '@/hooks/inputSupport/inputSuggestion/inputSuggestion';
import Status from '@/interfaces/exitenceStatus';
import { deleteInputLast } from '@/api/cursorAbility';
import { explainExpression, multiStatusPart } from '@/hooks/expression/multiStatusValue';
	const {props,popUp,returnValue} = defineProps(["props","popUp","returnValue"])
	const {parts,typeStatus} = props
	//输入区组件
	const textArea = ref()
	const inputValue = ref("")
	//表达式的值是一个数组
	let expressionValue:any[] = []
	// 报错信息
	const errorMsg = ref<any[]>([])

	// 生成提示信息列表
		//提示信息列表是这个类的属性与这个复合属性的part
		const createSuggestionItem = (type:string,key:any,text: string, label: string) => ({
			text,
			showText: `${label}:${text}`,
			type: "quote",
			click: (input: string) => {
				// 先删除input内容
				deleteInputLast(input.length)
				//再添加内容
				addItem({name:text,__key:key},type)
			}
		});
		const suggestionParts = parts.map((part: multiStatusPart) => 
			createSuggestionItem("quotePart",part.__key,part.__key, "部分"));
		const suggestionStatus = typeStatus.map((status: Status) =>
			createSuggestionItem("quoteStatus",status.__key,status.name, "属性"));
		// 合并两个数组
		const inputSuggestionList: suggestionItem[] = [...suggestionParts, ...suggestionStatus];
	// 向输入框中添加内容
	function addItem(value:any,type:string){
		//引用类型添加引用div
		if(type == "quoteStatus" || type == "quotePart"){
			const text = type=="quoteStatus" ? "引用属性":"引用部分"
			const name = type=="quoteStatus" ? value.name:value.__key
			const tmp = text + name
			const data = {
				type,
				name,
				key: value.__key
			}
			textArea.value.addDom(`<div contenteditable="false" data-quoteData='${JSON.stringify(data)}' class="quoteDiv">${tmp}</div>`)
		}
		//添加符号
		else if(type=="simbol"){
			textArea.value.addContent(value)
		}
		//退格
		else if(type=="backSpace"){
			textArea.value.deleteContent(1)
		}
		//检查表达式
		checkExpression()
	}
	// 检查表达式:item之间的排列是否符合规范，不符合规范的情况下报错
	let noError = true
	function checkExpression(){
		errorMsg.value = []
		noError = true //初始化
		//获取输入框的内容值
		expressionValue = textArea.value.getContentDom("quoteDiv",(e:any)=>{
			return e.dataset.quotedata
		})
		//为空
		if(!expressionValue){
			return false
		}
		let lastItem:any
		//解析输入内容值
		const tmp = explainExpression(expressionValue)
		if(!tmp){
			errorMsg.value.push("表达式无法解析，请检查是否存在错误输入对象")
			noError = false
		}
		//规则：两个对象/字符串/数字之间必须存在计算符号
		tmp.forEach((item)=>{
			if(!lastItem){
				if(isSimbol(item)){
					noError = false
					errorMsg.value.push(`不能以符号开头:[${item}]`)
				}
				lastItem = item
			}
			else{
				//上一个是符号，这个也是符号
				if(isSimbol(item) && isSimbol(lastItem)){
					//除非是^^（开方运算符）或者"]" 和 "()"
					if((item!="^" || lastItem != "^") //开方运算符
						&&
						(lastItem !="]" && lastItem != ")" && item != "("//闭括号
					)){
						noError = false
						errorMsg.value.push(`不得连续使用计算符号:[${lastItem}] 与 [${item}]`)
					}
				}
				//上一个不是符号，这个也不是符号
				else if(!isSimbol(item) && !isSimbol(lastItem)){
					noError = false
					const lastText = getText(lastItem)
					const nowText = getText(item)
					errorMsg.value.push(`应当使用计算符号链接:【${lastText}】与【${nowText}】`)
				}
			}
			lastItem = item
		})
		
		function isSimbol(item:any){
			return ["+","-","*","/","%","^","^^","[","]","(",")"].includes(item)
		}
		function getText(item:any){
			if(typeof item == "object"){
				const tmp = item.type == "quoteStatus" ? "引用属性":"引用部分"
				return tmp + item.name
			}
			else{
				return item
			}
		}
	}
	// 定时检查表达式
	let intervalId:any= null; // 保存定时器的ID
		onMounted(()=>{
			intervalId = setInterval(()=>{
				checkExpression()
			},5000)
		})
		// 删除定时器
		onUnmounted(()=>{
			if (intervalId !== null) {
				clearInterval(intervalId); // 清除定时器
			}
		})

	
	// 弹出选择引用属性页面
	function quoteStatus(){
		showPopUp({
			vue:shallowRef(chooseFromListVue),
			props:{
				list:typeStatus,
				info:"点击选择引用属性",
				empty:"当前无可选属性",
				//允许选择非复合属性和非嵌套的属性
				selectRule:(status:any)=>{
					if(status.valueType != "multi" && status.valueType != 'status'){
						return true
					}
					return false
				},
				showValue:(status:any)=>{
					return status.name
				},
				chooseValue:(status:any)=>{
					return {name:status.name,__key:status.key}
				}
			},
			buttons : [],
			mask : true,
			returnValue : (array:[])=>{
				//遍历返回的数组
				array.forEach((value)=>{
					addItem(value,"quoteStatus")
				})
				
			},
			size:{
				width:"600px",
				height:"auto"
			}
		})
	}
	// 弹出选择引用部分页面
	function quotePart(){
		showPopUp({
			vue:shallowRef(chooseFromListVue),
			props:{
				list:parts,
				info:"点击选择引用部分",
				empty:"当前无可选部分",
				//允许选择非换行的部分，并且该部分应具备关键字
				selectRule:(part:any)=>{
					if(part.valueType != "enterLine" && part.__key && part.__key != ""){
						return true
					}
					return false
				},
				showValue:(part:any)=>{
					return part.__key
				},
				chooseValue:(part:any)=>{
					return {__key:part.__key}
				}
			},
			buttons : [],
			mask : true,
			returnValue : (array)=>{
				//遍历返回的数组
				array.forEach((value:any)=>{
					addItem(value,"quotePart")
				})
			},
			size:{
				width:"600px",
				height:"auto"
			}
		})
	}
	// 点击输入运算符号
	function clickButton(name:string){
		//退格
		if(name == "backSpace"){
			addItem(null,"backSpace")
		}
		else{
			addItem(name,"simbol")
		}
	}
	// 点击确定返回表达式
	function onConfirm(){
		//为空
		if(!expressionValue){
			closePopUp(popUp)
		}
		//再检查一次表达式
		checkExpression()
		if(noError){
			//返回解释后的表达式
			returnValue(explainExpression(expressionValue))
			closePopUp(popUp)
		}
		else if(!noError){
			showQuickInfo("表达式包含错误内容")
		}
	}
</script>

<style lang="scss" scoped>
	@use "@/static/style/popUp.scss";

	.showArea{
		width: 100%;
		height: 120px;
		border: 3px solid black;
		padding: 5px;
		border-radius: 10px;
		margin-bottom: 30px;
		outline: none;
		overflow: auto;
		word-break: break-all;
		// 输入的引用对象
		:deep(.quoteDiv){
			display: inline-block;
			border-radius: 15%;
			user-select: none;
			margin: 5px;
			padding: 5px;
			border: 3px solid black;
		}
		
	}
	.inputArea{
		user-select:none;
		display: flex;
		width: 100%;
		.quote{
			width: 250px;
			margin-right: 5px;
			> div{
				text-align: center;
				padding: 5px;
				margin-bottom: 5px;
				border: 4px solid black;
			}
		}
		.keyBoard{
			width: calc(100% - 250px);
			display: grid;
			grid-template-columns: 1fr 1fr 1fr; /* 三列，分别是 1fr, 2fr 和 1fr */
			grid-template-rows: 1fr 1fr 1fr; /* 三行，第一行 100px 高，第二行自适应，第三行 50px 高 */
			border: 1px solid black;
			> div{
				border: 1px solid black;
			}
			.backSpace{
				grid-column: 3;
				grid-row: span 2;
			}
		}
	}

	.errorArea{
		.errorMsg{
			font-weight: bold;
			color:red;
		}
	}

	.buttons{
		@extend .finalButtons;
	}
	
</style>