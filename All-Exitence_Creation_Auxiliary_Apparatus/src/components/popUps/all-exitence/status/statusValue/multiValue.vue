<template>
	<div>
		<!-- 根据part的类型显示内容 -->
		<div v-for="(part) in parts">
			<div class="text" v-if="part.valueType=='text'">{{part.value}}</div>
		</div>
	</div>
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