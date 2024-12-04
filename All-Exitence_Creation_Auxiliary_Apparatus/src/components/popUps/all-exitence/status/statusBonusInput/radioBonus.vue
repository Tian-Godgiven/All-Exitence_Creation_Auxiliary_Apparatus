<template>
	<div class="radio">
		<div class="textInput">文本：
			<downLineInputVue
				@input="setStatus" v-model="text"/>
		</div>
	</div>
</template>

<script setup lang="ts" name=""> 
import { inject, ref } from 'vue'; 
import downLineInputVue from '@/components/other/input/downLineInput.vue';
	const status = inject<any>("status")
	const text = ref("")
	function setStatus(){
		status["setting"]["radio"] = text.value
	}
	setStatus()
</script>

<style lang="scss" scoped>
	@use "@/static/style/components/inputs.scss";
	.radio{
		.textInput{
			display: flex;
			white-space: nowrap;
			width: 100%;
			input{
				width:calc(100% - 100px);
				text-align: left;
			}
		}
	}
</style>