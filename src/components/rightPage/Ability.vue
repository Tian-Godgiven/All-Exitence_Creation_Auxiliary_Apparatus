<template>
<div class="ability">
    <Button :name="ability.name" @click="ability.click"></Button>
    <div>{{ ability.name }}</div>
</div>
</template>

<script setup lang='ts'>
    import { RightAbility } from '@/static/list/rightAbilityList';
    import Button from '../global/Button.vue';
    const {ability} = defineProps<{ability:RightAbility}>()
</script>

<style scoped lang='scss'>
.ability{
    .button{
		box-sizing: border-box;
		pointer-events: all;
		height: 100px;
		width: 100px;
		border-radius: 50%;
		background-color: $rightButtonColor;
		box-shadow: 0px 3px 6px 1px rgb(99, 99, 99);
		margin:15px;
		margin-top: 20px;
		z-index: 2;
		flex-shrink: 0
	}
}
</style>