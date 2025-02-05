<template>
    <div class="timeRuleUnit">
        
    </div>
</template>

<script setup lang='ts'>
    import { ref } from 'vue';
    import { CustomTimeRule } from '../customTime';
    const {unit,name} = defineProps<{
        unit: CustomTimeRule['units'][keyof CustomTimeRule['units']];
        name: string;
    }>();

</script>

<style scoped lang='scss'>

</style>