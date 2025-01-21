<template>
    <div class="picker">
        <VueScrollPicker :options="years" v-model="time.year" @update:model-value="onChange" />
        <VueScrollPicker :options="months" v-model="time.month" @update:model-value="onChange"/>
        <VueScrollPicker :options="days" v-model="time.day" @update:model-value="onChange"/>
    </div>
</template>
<script lang="ts" setup>
import { computed, Reactive } from 'vue'
import { VueScrollPicker } from 'vue-scroll-picker';

    const {time} = defineProps<{time:Reactive<{year:number,month:number,day:number}>}>()
    const emits = defineEmits(["onChange"])

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
        const lastDay = new Date(time.year, time.month, 0).getDate()
        return Array.from({ length: lastDay }, (_, index) => index + 1)
    })

    function onChange(){
        emits("onChange")
    }
 
</script>
<style scoped lang="scss">
.picker {
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