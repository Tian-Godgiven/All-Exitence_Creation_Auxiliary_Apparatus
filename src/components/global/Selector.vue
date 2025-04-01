<template>
<ElSelect
    @change="emits('change')"
    v-model="model"
    :placeholder="placeholder">
    <ElOption
        v-for="item in itemList"
        :key="item.value"
        :label="item.label"
        :value="item.value"/>
</ElSelect>
</template>

<script setup lang='ts'>
    import { ElSelect,ElOption } from 'element-plus';
import { computed } from 'vue';
    const model = defineModel<any>()
    const {list,placeholder="请选择"} = defineProps<{
        list:false|{value:any,label:string}[],
        placeholder?:string
    }>()
    const emits = defineEmits(["change"])
    const itemList = computed(()=>{
        if(list)return list;
        return []
    })

</script>

<style scoped lang='scss'>

</style>