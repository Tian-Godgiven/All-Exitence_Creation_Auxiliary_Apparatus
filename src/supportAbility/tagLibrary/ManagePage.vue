<template>
<div class="tagManager">
    <TagGroup v-for="tagGroup,index in list" :tagGroup :index></TagGroup>
</div>
</template>

<script setup lang='ts'>
    import { getTagLibrary} from './tagLibrary';
    import TagGroup from './components/TagGroup.vue';
    const list = getTagLibrary()
</script>

<style scoped lang='scss'>
.tagManager{
    width: 100%;
}
</style>