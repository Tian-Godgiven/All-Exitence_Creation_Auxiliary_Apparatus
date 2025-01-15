<template>
    <div class="container">
        <input 
        :placeholder="placeholder"
        class="input"
        v-model="value"
        :type="type"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur" />
        <div class="downLine" :class="ifFocusing? 'focusing':null" ></div>
    </div>
    
</template>

<script setup lang='ts'>
import { ref } from 'vue';

    const value = defineModel()
    const {placeholder,type} = defineProps(['placeholder','type'])
    const emits = defineEmits(["blur","input"])
    const ifFocusing = ref(false)
    function onFocus(){
        ifFocusing.value = true
    }
    function onBlur(){
        ifFocusing.value = false
        emits('blur',value.value)
    }
    function onInput(){
        emits('input',value.value)
    }
</script>

<style scoped lang='scss'>
    .container{
        width: 100%;
    }
    .input{
        width: 100%;
        padding: 0;
        border: none;
        outline: none;
        font-size: inherit;
    }
    .downLine{
        position: relative;
        top: -3px;
        height: 3px;
        width: 100%;
        background-color: #8aa1a1;
    }
    .downLine.focusing{
        background-color: black;
    }
</style>