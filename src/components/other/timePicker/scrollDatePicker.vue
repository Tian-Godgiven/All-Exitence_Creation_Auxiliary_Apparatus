<template>
    <div class="datePicker">
        <VueScrollPicker :options="years" v-model="currentYear" />
        <VueScrollPicker :options="months" v-model="currentMonth" />
        <VueScrollPicker :options="days" v-model="currentDay" />
    </div>
</template>
<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { VueScrollPicker } from 'vue-scroll-picker';

    const {currentDate=Date.now()} = defineProps<{currentDate:number}>()
    const emits = defineEmits(["onChange"])
    const date = new Date(currentDate)
    const currentYear = ref(date.getFullYear())
    const currentMonth = ref(date.getMonth())
    const currentDay = ref(date.getDate())

    const years = computed(()=>{
        //年份范围
        const currYear = new Date().getFullYear()
        const lastYear = 1980
        return Array.from({ length: currYear - lastYear + 1 }, (_, index) => lastYear + index).reverse()
    })
    const months = computed(()=>{
        return Array.from({ length: 12 }, (_, index) => index+1)
    })
    const days = computed(()=>{
        const lastDay = new Date(currentYear.value, currentMonth.value, 0).getDate()
        return Array.from({ length: lastDay }, (_, index) => index + 1)
    })

    //监听值变化
    watch([currentYear,currentMonth,currentDay],()=>{
        emits("onChange",currentYear.value,currentMonth.value-1,currentDay.value)
    })

</script>
<style scoped lang="scss">
.datePicker {
    display: flex;
    .vue-scroll-picker{
        width: 100%;
        height: 100%;
    }
    :deep(.vue-scroll-picker-item){
        line-height: 1.5rem;
    }
}
</style>