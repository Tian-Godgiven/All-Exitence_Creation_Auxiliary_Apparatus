<template>
    <SwitchExpand v-if="'child' in item">
        <template #title>
            <ChooseInNode :item="item" :parent="parent">
                <div>{{ item.name }}</div>
            </ChooseInNode>
        </template>
        <template #inner>
            <ChooseArticleOption v-for="child in item.child"
                :item="child" :parent="parent"/>
        </template>
    </SwitchExpand>
    
    <ChooseInNode v-else :item="item" :parent="parent">
        <div>{{ item.name }}</div>
    </ChooseInNode>
</template>

<script setup lang='ts'>
import { Item } from './chooseArticle';
import SwitchExpand from '@/components/other/SwitchExpand.vue';
import ChooseInNode from '@/components/other/chooseInTree/ChooseInNode.vue';
    const {item,parent} = defineProps<{item:Item,parent?:Item}>()
</script>

<style scoped lang='scss'>

</style>