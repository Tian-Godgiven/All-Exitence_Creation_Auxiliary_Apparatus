<template>
    <div class="missionTime">直到
        <Time :time-value="timeValue" time-rule="date"></Time>
    </div>
</template>

<script setup lang='ts'>
import Time from '@/components/global/time.vue';
import { reactive } from 'vue';
    const {time} = defineProps<{time:any}>()
    const timeValue = reactive({
        unit:"date",
        number:time
    })
</script>

<style scoped lang='scss'>
    .missionTime{
        width: 100%;
        max-height: 1rem;
        display: flex;
    }
</style>