<template>
<div class="unit">
    <DownLineInput 
        :style="{ width: getUnitWidth() }"
        class="unitValue" 
        @focus="onFocus"
        @blur="onBlur"
        v-model="displayValue">
    </DownLineInput>
    <slot></slot>
</div>
</template>

<script setup lang='ts'>
    import { ref, watchEffect } from 'vue';  
    import DownLineInput from '@/components/other/input/downLineInput.vue';
    import { translateTimeNumFormat } from '@/supportAbility/customTime/translateTime';
    type Unit = {value:number,name:string}
    type NumFormat = "阿拉伯数字"|"简体中文数字"|"繁体中文数字"
    const {unit,format} = defineProps<{unit:Unit,format:NumFormat}>()   
    const emits = defineEmits(["change"]) 
    //显示在输入框中的内容
    const displayValue = ref<string|number>(translateTimeNumFormat(unit.value,format))
    //修改数符时同步修改内容
    watchEffect(()=>{
        displayValue.value = translateTimeNumFormat(unit.value,format)
    })
    //聚焦输入框时把这个值转换回数字
    function onFocus(){
        displayValue.value = unit.value
    }
    //失去聚焦时改回numFormat指定的数符
    function onBlur(){
        displayValue.value = translateTimeNumFormat(unit.value,format)
    }
    //计算宽度
    function getUnitWidth(){
        if(format == "阿拉伯数字"){
            return `${unit.value.toString().length+1}ch`
        }
        else{
            return `${unit.value.toString().length+1}em`
        }
        
    }
</script>

<style scoped lang='scss'>
.unit{
    display: flex;
    .unitValue{
        flex:1 1 auto;
        min-width: 1em;
        text-align: right;
        margin-right: 5px;
    }
    .unitName{
        flex-shrink: 0;
    }
}
</style>