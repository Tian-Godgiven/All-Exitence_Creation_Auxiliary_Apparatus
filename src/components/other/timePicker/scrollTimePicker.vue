<template>
    <div class="timePicker">
        <VueScrollPicker :options="hours" v-model="hour" />
        <VueScrollPicker :options="minutes" v-model="minute" />
    </div>
</template>
<script lang="ts" setup>
import { onMounted, Ref, ref,watch } from 'vue'
import { VueScrollPicker } from 'vue-scroll-picker';
    const {hour=ref(0),minute=ref(0)} = defineProps<{hour:Ref<number>,minute:Ref<number>}>()
    const emits = defineEmits(["onChange"])

    const hours = Array.from({ length: 24 }, (_, index) => String(index).padStart(2, '0'))
    const minutes = Array.from({ length: 60 }, (_, index) => String(index).padStart(2, '0'))

    //监听值变化
    watch([hour,minute],()=>{
        emits("onChange",hour.value,minute.value)
    })


</script>
<style scoped lang="scss">
.timePicker {
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