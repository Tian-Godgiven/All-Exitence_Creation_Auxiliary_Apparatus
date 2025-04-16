<template>
    <div class="alert">
        <div class="info">{{ item.info }}</div>
        <div class="buttons" v-if="item.confirm != null">
            <div class="button" @click="clickButton(item.confirm)">确认</div>
            <div class="button" @click="clickQuit()">取消</div>
        </div>
        <FinalButtons :buttons="buttons"/>
    </div>
</template>

<script setup lang='ts'>
    import { AlertItem } from '@/hooks/alert';
import { closePopUp, PopUp } from '@/hooks/pages/popUp';
import FinalButtons from '@/app/stacks/popUp/FinalButtons.vue';
    const {props,popUp} = defineProps<{props:{item:AlertItem},popUp:PopUp}>()
    const {item} = props

    //所有按钮
    const buttons = function(){
        const buttonList = []
        //先看确认和取消
        if(item.confirm){
            buttonList.push({
                click:item.confirm,
                name:"确认"
            })
        }
        if(item.quit){
            buttonList.push({
                click:item.quit,
                name:"取消"
            })
        }
        //再加其他按钮
        if(item.buttons){
            buttonList.push(...item.buttons)
        }
        return buttonList
    }()

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
.alert{
    .info{
        white-space: pre-wrap;
    }
    .buttons{
        flex-wrap: wrap;
    }
}
</style>