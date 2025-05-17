<template>
<div class="boxInput"  >
    <div ref="boxRef" @pointerdown.stop @click.stop="clickBox" class="text" 
        :class="ifPlaceholder?'placeholder':''" 
        v-show="!ifInputMode">
        {{ text }}
    </div>
    <div class="inputContainer" v-if="ifInputMode" @click.stop>
        <MultiLineInput 
            class="input"
            v-model="value"
            :type="type"
            @input="onInput"
            @focus="onFocus"
            @blur="onBlur"
            ref="inputRef" 
            :placeholder="placeholder"/>
        <Button @click="clearInput" class="clearButton" 
            icon="close" 
            color="white"
            v-if="clear && ifInputMode" v-show="toString(value).length>0">
        </Button>
    </div>
</div>
</template>

<script setup lang='ts'>
    import { toString } from 'lodash';
    import Button from '@/components/global/Button.vue';
    import { computed, nextTick, ref, useTemplateRef } from 'vue';
    import MultiLineInput from '../textArea/MultiLineInput.vue';
    const value = defineModel<string|number>({
        default:""
    })
    const {placeholder="",preventClick=false,switchInput=true,handInputMode=null,type,clear} = defineProps<{
        placeholder?:string,
        preventClick?:boolean,//若为true则阻止点击事件传播
        switchInput?:boolean,//若为true则允许在输入和纯文本间切换
        handInputMode?:boolean,//手动切换输入模式,优先级更高
        type?:"number"|"string",
        clear?:boolean//清空按键
    }>()

    const boxRef = useTemplateRef("boxRef")
    const inputRef = useTemplateRef("inputRef")
    //点击box切换到输入模式，并开始监听点击到外部，点击到外部切换到文本模式，并解除监听
    const listener = (event:MouseEvent)=>{
        // 如果点击的是 box 以外的地方，切换回文本模式
        if (!boxRef.value || !boxRef.value.contains(event.target as Node)) {
            inputMode.value = false;
            document.removeEventListener("click", listener);
        }
    }
    function clickBox(event:MouseEvent){
        if(!switchInput)return;
        if(preventClick){
            event.stopPropagation()
        }
        //切换到输入模式
        inputMode.value = true
        document.addEventListener("click",listener)
    }

    //输入模式
    const inputMode = ref(switchInput===true?false:true)
    //当前是否为输入模式
    const ifInputMode = computed(()=>{
        let control:boolean
        //手动控制的输入模式
        if(handInputMode !== null){
            control = handInputMode
        }
        control = inputMode.value
        //为true时聚焦到输入框
        nextTick(()=>{
            if(inputRef.value){
                inputRef.value.focusInput()
            }
        })
        return control
    })

    //当前是否显示placeholder
    const ifPlaceholder = ref(false)
    const text = computed(()=>{
        if(toString(value.value).trim() == ""){
            ifPlaceholder.value = true
            return placeholder
        }
        ifPlaceholder.value = false
        return value.value
    })

    //事件
    const emits = defineEmits(["focus","blur","input"])
    function onFocus(){
        //允许切换
        if(switchInput){
            inputMode.value = true
        }
        emits('focus',value.value)
    }
    function onBlur(){
        if(switchInput){
            inputMode.value = false
        }
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
    .boxInput{
        position: relative;
        height: 100%;
        width: 100%;
        min-width: 1rem;
    }
    .text{
        display: inline;
        word-break: break-all;
        width: fit-content;
        @include textMaxLine(1);
        &.placeholder{
            text-decoration-color: rgb(125, 125, 125)!important;
            color:rgb(125, 125, 125)!important;
        }
    }
    .inputContainer{
        display: inline-flex;
        max-width: 100%;
        .input{
            box-sizing: border-box;
            height: 100%;
            width: 100%;
            padding: 5px 15px;
            border-radius: 10px;
            border: none;
            outline: none;
            &:focus{
                box-shadow: 0px 2px 10px rgb(0, 81, 255);
            }
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
    }
    
</style>