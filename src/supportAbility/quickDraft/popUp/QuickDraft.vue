<template>
<div class="quickDraft">
    <ManagePage></ManagePage>
    <SlidePage :show="ifFocusing">
        <FocusingPage></FocusingPage>
    </SlidePage>
</div>  
</template>

<script setup lang='ts'>
    import FocusingPage from '../component/FocusingPage.vue';
    import SlidePage from '@/components/other/SlidePage.vue';
    import ManagePage from '../component/ManagePage.vue';
    import { ifFocusing } from '../quickDraft';
</script>

<style scoped lang='scss'>
.quickDraft{
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
}
</style>
