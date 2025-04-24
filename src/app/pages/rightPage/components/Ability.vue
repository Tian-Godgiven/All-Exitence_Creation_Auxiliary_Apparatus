<template>
<Button class="ability" @click="ability.click">
	<Icon class="icon" :icon="ability.icon"></Icon>
    <div class="name">{{ ability.name }}</div>
</Button>
</template>

<script setup lang='ts'>
    import { RightAbility } from '@/static/list/rightAbilityList';
import Icon from '@/components/global/Icon.vue';
import Button from '@/components/global/Button.vue';
    const {ability} = defineProps<{ability:RightAbility}>()
</script>

<style scoped lang='scss'>
.ability{
	width: 100%;
	display: flex;
	margin: 20px;
	flex-direction: column;
	place-items: center;
    .icon{
		margin: 10px;
		width: calc(100% - 60px);
		aspect-ratio: 1;
		margin-bottom: 10px;
		flex-shrink: 0
	}
	.name{
		font-size: $smallFontSize;
		text-align: center;
	}
}
</style>