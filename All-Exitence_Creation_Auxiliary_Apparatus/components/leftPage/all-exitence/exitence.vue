<template>
	<view class="exitence">
		<view class="name">{{name}}</view>
		<view class="tags">
			<view v-for="(tag,index) in tags">[{{tag}}]</view>
		</view>
	</view>
</template>

<script setup lang="ts" name="">
import { ref } from 'vue'; 
	let {exitence} = defineProps(["exitence"])
	let name = ref(exitence.name)
	let tags = ref(exitence.status.tags)
</script>

<style lang="scss" scoped>
	@import "@/static/style/leftPage.scss";
	.exitence{
		@extend .leftPageExitence
	}
</style>