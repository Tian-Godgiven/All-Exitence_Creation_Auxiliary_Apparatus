<template>
<div class="listMenu">
    <div class="title" v-if="title">{{ title }}</div>
    <Button class="menuOption" v-for="option in list" 
        @click="option.click">
        <IconVue v-if="option.icon" :icon="option.icon"></IconVue>
        <div>{{ option.label }}</div>
    </Button>
</div>
</template>

<script setup lang='ts'>
    import { type Icon } from '@/static/list/iconList';
import IconVue from './Icon.vue';
import Button from './Button.vue';
    const {title,list} = defineProps<{
        title?:string,
        list:{label:string,icon?:Icon,click:()=>void}[]
    }>()
</script>

<style scoped lang='scss'>
.listMenu{
    word-break: keep-all;
	background-color: $bgColor;
    border: 3px solid rgb(187, 187, 187);
    border-radius: 10px;
    box-shadow: $groundShadow;
    overflow: visible;
    .title{
        font-size: 0.8rem;
        color: $bgColor40;
        padding: 0px 20px;
    }
	.menuOption{
		padding: 5px 20px;
	}
}
</style>