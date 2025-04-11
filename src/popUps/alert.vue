<template>
    <div class="alert">
        <div class="info">{{ item.info }}</div>
        <div class="buttons" v-if="item.confirm != null">
            <div class="button" @click="clickButton(item.confirm)">确认</div>
            <div class="button" @click="clickQuit()">取消</div>
        </div>
        <div class="buttons">
            <div class="button" @click="clickButton(button.func)" v-for="button in item.buttons">
                {{ button.buttonName }}
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
    import { AlertItem } from '@/hooks/alert';
import { closePopUp, PopUp } from '@/hooks/pages/popUp';
    const {props,popUp} = defineProps<{props:{item:AlertItem},popUp:PopUp}>()
    const {item} = props

    //点击任意一个按钮
    function clickButton(func:()=>void){
        if(func){
            func()
        }
        closePopUp(popUp)
    }

    //点击了取消
    function clickQuit(){
        if(item.quit){
            item.quit()
        }
        closePopUp(popUp)
    }

    
</script>

<style scoped lang='scss'>
    @use "@/static/style/components/popUp.scss";
    .alert{
        .info{
            white-space: pre-wrap;
        }
        .buttons{
            flex-wrap: wrap;
            @extend .finalButtons
        }
    }
</style>