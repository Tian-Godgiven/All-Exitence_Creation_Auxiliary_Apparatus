<template>
<div class="noContent">
    <span>{{ placeholder }}</span>
</div>
</template>

<script setup lang='ts'>
    const {placeholder="无内容"} = defineProps<{
        placeholder?:string
    }>()
</script>

<style scoped lang='scss'>
.noContent{
    height: 2rem;
    width: 100%;
    display: flex;
    place-items: center;
    color: $previewText;
    font-size: 0.8rem;
    font-style: italic;
    text-align: center;
    span{
        width: 100%;
    }
}
</style>