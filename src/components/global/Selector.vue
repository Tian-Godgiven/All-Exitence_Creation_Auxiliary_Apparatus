<template>
<ElSelect
    @change="emits('change')"
    v-model="model"
    :placeholder="placeholder">
    <ElOption
        v-for="item in list"
        :key="item.value"
        :label="item.label"
        :value="item.value"/>
</ElSelect>
</template>

<script setup lang='ts'>
    import { ElSelect,ElOption } from 'element-plus';
    const model = defineModel<any>()
    const {list,placeholder="请选择"} = defineProps<{
        list:{value:any,label:string}[],
        placeholder?:string
    }>()
    const emits = defineEmits(["change"])

</script>

<style scoped lang='scss'>

</style>