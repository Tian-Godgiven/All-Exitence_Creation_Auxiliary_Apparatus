<template>
    <div>
        {{ rule }}
    </div>
</template>

<script setup lang='ts'>
    import { ref } from 'vue';
    const {rule} = defineProps(["rule"])
</script>

<style scoped lang='scss'>

</style>