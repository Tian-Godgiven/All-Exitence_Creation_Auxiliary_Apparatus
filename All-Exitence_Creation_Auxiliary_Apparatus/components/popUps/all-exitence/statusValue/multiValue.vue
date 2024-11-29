<template>
	<view>
		<!-- 根据part的类型显示内容 -->
		<view v-for="(part,index) in parts">
			<view class="text" v-if="part.valueType=='text'">{{part.value}}</view>
		</view>
	</view>
</template>

<script setup lang="ts" name="">
import { inject, ref } from 'vue'; 
import statusValueVue from './statusValue.vue';
	const status = inject("status")
	const changeStatusValue = inject("changeStatusValue")
	const parts = ref(status['value'])
	console.log(parts)
</script>

<style lang="scss" scoped>

</style>