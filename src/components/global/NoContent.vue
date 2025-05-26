<template>
<div class="noContent">
    <div class="placeholder">
        <span>{{ placeholder }}</span>
        <slot></slot>
    </div>
</div>
</template>

<script setup lang='ts'>
    const {placeholder="无内容"} = defineProps<{
        placeholder?:string
    }>()
</script>

<style scoped lang='scss'>
.noContent{
    padding: 20px 0;
    width: 100%;
    display: flex;
    place-items: center;
    color: $previewText;
    font-size: 0.8rem;
    font-style: italic;
    text-align: center;
    .placeholder{
        height: 100%;
        width: 100%;
        span{
            width: 100%;
        }
    }
    
}
</style>