<template>
<div class="popUpContainer" >
    <!-- 弹窗遮罩层 -->
    <PopUpMask/>
    <PopUp :key="popUp.id" v-for="popUp in popUpList" :popUp="popUp"/>
</div>
</template>

<script setup lang='ts'>
    import { popUpList } from '@/hooks/pages/popUp';
    import PopUp from './PopUp.vue';
    import PopUpMask from './PopUpMask.vue';

</script>

<style scoped lang='scss'>
//弹窗容器
.popUpContainer{
			z-index: 6;
			position: absolute;
			height: 100%;
			width: 100%;
			top:0;
			left:0;
			pointer-events: none;
		}
</style>