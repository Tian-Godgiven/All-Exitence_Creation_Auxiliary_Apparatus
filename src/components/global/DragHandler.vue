<template>
<div class="dragHandler" @pointerdown.stop @pointermove.stop @pointerup.stop>
    <Button icon="dragHandler" name="拖动"></Button>
</div>
</template>

<script setup lang='ts'>
import Button from './Button.vue';

    
</script>

<style scoped lang='scss'>
.dragHandler{
    width: 100%;
    height: 100%;
    >.button{
        height: 100%;
        width: 100%;
    }
}
</style>