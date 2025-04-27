<template>
<div class="controlPanel">
    <div class="title" v-if="control.title">{{control.title}}</div>
    <div class="inner">
        <Button class="option" v-for="option in control.option"  @click="clickControl(option)">
            {{ option.text }}
        </Button>
    </div>
</div>
</template>

<script setup lang='ts'>
    import { Control } from '@/hooks/controlPanel';
import { closePopUp } from '@/hooks/pages/popUp';
import Button from '@/components/global/Button.vue';
    const {props,popUp,returnValue} = defineProps(["props","popUp","returnValue"])
    const {control}:{control:Control} = props
    //点击控制面板的项目
    function clickControl(option:Control["option"][0]){
        //获取返回值
        const value = option.click()
        if(returnValue){
            returnValue(value)
        } 
        //关闭控制面板
        closePopUp(popUp)
    }
</script>

<style scoped lang='scss'>
.controlPanel{
    .title{
        padding: 0 10px;
        font-size: $fontSize20;
    }
    .inner{
        padding: 10px 0;
        .option{
            font-size: 1rem;
            padding: 5px 20px;
            font-style: italic;
        }
    }
    
}
</style>