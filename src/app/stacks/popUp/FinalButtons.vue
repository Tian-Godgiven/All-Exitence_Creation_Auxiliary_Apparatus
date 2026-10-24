<template>
<div class="finalButtons">
    <Button v-for="button in buttons" @click="button.click" :name="button.name"></Button>
</div>
</template>

<script setup lang='ts'>
    import Button from '@/components/global/button.vue';
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
		border: 2px solid black;
	}
}

@media (min-width: 900px){
	.finalButtons{
		justify-content: flex-end;
		gap: 8px;
	}
	.finalButtons .button{
		margin: 0;
		border-width: 2px;
		border-radius: 6px;
	}
	.finalButtons .button:last-child{
		border-color: transparent;
	}
	.finalButtons .button:first-child{
		order: 1;
	}
}
</style>
