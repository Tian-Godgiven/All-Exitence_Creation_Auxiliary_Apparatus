<template>
<div class="quickDraft">
    <ManagePage :popUp></ManagePage>
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
    import { PopUp } from '@/hooks/pages/popUp';
    const {popUp} = defineProps<{popUp?:PopUp}>()
</script>

<style scoped lang='scss'>
.quickDraft{
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
}
</style>