<template>
<div class="dragHandler" @pointerdown.stop @pointermove.stop>
    <div class="handler">
        <Button icon="dragHandle" name="拖动"></Button>
    </div>
</div>
</template>

<script setup lang='ts'>
import Button from './Button.vue';
</script>

<style scoped lang='scss'>
.dragHandler{
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    >.handler{
        flex-shrink: 0;
        margin: auto;
        width: 40px;
        height: 60px;
        max-height: 70%;
        background-color: $bgColor;
        border: 3px solid $bgColor70;
        border-radius: 10px;
        box-shadow: $groundShadow;
        >.icon{
            height: 100%;
            width: 100%;
        }
        >.button{
            height: 100%;
            width: 100%;
        }
    }
    
}
</style>