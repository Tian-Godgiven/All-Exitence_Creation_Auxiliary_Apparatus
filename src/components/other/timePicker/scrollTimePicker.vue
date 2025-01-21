<template>
    <div class="picker">
        <VueScrollPicker :options="hours" v-model="time.hour" />
        <VueScrollPicker :options="minutes" v-model="time.minute" />
    </div>
</template>
<script lang="ts" setup>
import { watch, Reactive } from 'vue'
import { VueScrollPicker } from 'vue-scroll-picker';

    const {time} = defineProps<{time:Reactive<{hour:number,minute:number}>}>()
    console.log(time.hour)
    const emits = defineEmits(["onChange"])

    const hours = Array.from({ length: 24 }, (_, index) => String(index).padStart(2, '0'))
    const minutes = Array.from({ length: 60 }, (_, index) => String(index).padStart(2, '0'))

    //监听值变化
    watch(()=>time,()=>{
        emits("onChange",time.hour,time.minute)
    },{deep:true})


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