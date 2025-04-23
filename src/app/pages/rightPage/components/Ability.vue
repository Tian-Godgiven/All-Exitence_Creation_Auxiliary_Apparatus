<template>
<div class="ability">
    <Button :name="ability.name" @click="ability.click"></Button>
    <div class="name">{{ ability.name }}</div>
</div>
</template>

<script setup lang='ts'>
    import { RightAbility } from '@/static/list/rightAbilityList';
    import Button from '@/components/global/Button.vue';
    const {ability} = defineProps<{ability:RightAbility}>()
</script>

<style scoped lang='scss'>
.ability{
	width: 100%;
	display: flex;
	flex-direction: column;
	place-items: center;
    .button{
		margin: 30px;
		width: calc(100% - 60px);
		aspect-ratio: 1;
		margin-bottom: 10px;
		border-radius: 50%;
		background-color: $rightButtonColor;
		box-shadow: 0px 0px 6px 1px rgb(99, 99, 99);
		z-index: 2;
		flex-shrink: 0
	}
	.name{
		font-size: $smallFontSize;
		text-align: center;
	}
}
</style>