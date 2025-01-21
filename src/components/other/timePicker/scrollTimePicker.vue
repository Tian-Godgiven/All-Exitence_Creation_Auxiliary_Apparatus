<template>
    <div class="picker">
        <VueScrollPicker :options="hours" v-model="time.hour" @update:model-value="onChange"/>
        <VueScrollPicker :options="minutes" v-model="time.minute" @update:model-value="onChange"/>
    </div>
</template>
<script lang="ts" setup>
import { Reactive } from 'vue'
import { VueScrollPicker } from 'vue-scroll-picker';

    const {time} = defineProps<{time:Reactive<{hour:number,minute:number}>}>()
    const emits = defineEmits(["onChange"])

    const hours = Array.from({ length: 24 }, (_, index) => String(index).padStart(2, '0'))
    const minutes = Array.from({ length: 60 }, (_, index) => String(index).padStart(2, '0'))

    function onChange(){
        emits("onChange",time.hour,time.minute)
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