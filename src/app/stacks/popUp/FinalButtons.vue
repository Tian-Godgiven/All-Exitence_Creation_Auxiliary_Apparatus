<template>
<div class="finalButtons">
    <Button v-for="button in buttons" @click="button.click" :name="button.name"></Button>
</div>
</template>

<script setup lang='ts'>
    import Button from '@/components/global/Button.vue';
    type Button = {
        click: (...arg:any[]) => void,
        name: string
    }
    const {buttons} = defineProps<{buttons:Button[]}>();
</script>

<style scoped lang='scss'>
.finalButtons{
	margin-top: 20px;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	.button{
		margin: 10px;
		padding: 5px 15px;
		border: 3px solid black;
	}
}
</style>