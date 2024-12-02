<template>
	<div class="exitence">
		<div class="name">{{name}}</div>
		<div class="tags">
			<div v-for="(tag,index) in tags">[{{tag}}]</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="">
import { ref } from 'vue'; 
	let {exitence} = defineProps(["exitence"])
	let name = ref(exitence.name)
	let tags = ref(exitence.status.tags)
</script>

<style lang="scss" scoped>
	@use "@/static/style/leftPage.scss";
	.exitence{
		@extend .leftPageExitence
	}
</style>