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
	height: 100%;
	display: flex;
	padding: 20px;
	flex-direction: column;
	place-items: center;
	box-sizing: border-box;
    .icon{
		padding:0 25px;
		box-sizing: border-box;
		width: 100%;
		height: 100px;
		flex-shrink: 0
	}
	.name{
		font-size: 0.9rem;
		text-align: center;
	}
}
</style>