<template>
<div class="downLineInput">
    <input 
        :placeholder="placeholder"
        class="input"
        v-model="value"
        :type="type"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur" />
    <Button @click="clearInput" class="clearButton" 
        icon="close" 
        icon-size="16px"
        color="white"
        v-if="clear" v-show="toString(value).length>0">
    </Button>
    <div class="downLine" :class="ifFocusing? 'focusing':null" ></div>
</div>
</template>

<script setup lang='ts'>
    import { ref } from 'vue';
    import Button from '@/components/global/button.vue';
    import { toString } from 'lodash';

    const value = defineModel<string|number>({
        default:""
    })
    const {placeholder="",type,clear} = defineProps<{
        placeholder?:string,
        type?:"number"|"string",
        clear?:boolean//清空按键
    }>()
    const emits = defineEmits(["focus","blur","input"])
    const ifFocusing = ref(false)
    function onFocus(){
        ifFocusing.value = true
        emits('focus',value.value)
    }
    function onBlur(){
        ifFocusing.value = false
        emits('blur',value.value)
    }
    function onInput(){
        emits('input',value.value)
    }
    function clearInput(){
        value.value = ""
    }
</script>

<style scoped lang='scss'>
    .downLineInput{
        position: relative;
        width: 100%;
    }
    .input{
        flex:inherit;
        text-align: inherit;
        width: 100%;
        padding: 0;
        border: none;
        outline: none;
        font-size: inherit;
    }
    .clearButton{
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-45%);
        height: 50%;
        border-radius: 50%;
        aspect-ratio: 1;
        background-color: $bgColor70;
        display: flex;
        padding: 3px;
        box-sizing: border-box;
        align-items: center;
        justify-content: center;
    }
    .downLine{
        position: relative;
        bottom: 3px;
        height: 3px;
        width: 100%;
        background-color: #8aa1a1;
    }
    .downLine.focusing{
        background-color: black;
    }
    @media (min-width: 900px){
        .downLineInput{
            width: min(100%, 420px);
            min-height: 36px;
        }
        .input{
            min-height: 35px;
            padding-right: 24px;
        }
        .clearButton{
            top: calc(50% - 1px);
            width: 18px;
            height: 18px;
            padding: 1px;
            transform: translateY(-50%);
        }
        .downLine{
            bottom: 1px;
            height: 1px;
        }
    }
</style>
