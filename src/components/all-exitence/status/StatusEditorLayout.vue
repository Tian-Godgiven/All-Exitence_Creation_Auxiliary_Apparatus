<template>
<div class="statusEditorLayout">
	<div class="statusRow">
		<slot name="name"></slot>
		<div class="statusValue"><slot name="value"></slot></div>
		<Button class="confirmButton" bordered :name="confirmText" @click="$emit('confirm')"></Button>
	</div>
	<div class="statusType"><slot name="type"></slot></div>
	<slot></slot>
</div>
</template>

<script setup lang="ts">
import Button from '@/components/global/button.vue';

defineProps<{confirmText:string}>()
defineEmits(['confirm'])
</script>

<style scoped lang="scss">
.statusRow{
	display: flex;
	align-items: stretch;
	min-height: 40px;
	width: 100%;
	.statusValue{ flex: 1 1 0; min-width: 0; }
	.confirmButton{
		flex: 0 0 auto;
		min-width: 72px;
		height: 40px;
		margin-left: 8px;
		padding: 0 12px;
	}
}
.statusType{
	display: flex;
	align-items: center;
	height: 54px;
	:slotted(*){ flex: 1 1 auto; width: 100%; min-width: 0; }
}
@media (max-width: 899px){
	.statusRow{
		flex-wrap: wrap;
		.confirmButton{ margin-left: auto; }
	}
}
</style>
