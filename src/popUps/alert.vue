<template>
    <div class="alert">
        <div class="info">{{ info }}</div>
        <div class="buttons">
            <div class="button" @click="clickConfirm">确认</div>
            <div class="button" @click="clickQuit">取消</div>
        </div>
    </div>
</template>

<script setup lang='ts'>
    import { closePopUp } from '@/hooks/pages/popUp';
    const {props,popUp} = defineProps(["props","popUp"])
    const {info,confirm,quit,buttons} = props
    //点击了确定
    function clickConfirm(){
        if(confirm){
            confirm()
        }
        closePopUp(popUp)
    }

    //点击了取消
    function clickQuit(){
        if(quit){
            quit()
        }
        closePopUp(popUp)
    }

    if(buttons){
        console.log("这个alert有buttons，但是相关功能还未实装")
    }
</script>

<style scoped lang='scss'>
    @use "@/static/style/components/popUpButtons";
    .alert{
        .info{
            white-space: pre-wrap;
        }
        .buttons{
            @extend .buttons
        }
    }
</style>