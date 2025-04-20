<template>
    <div class="alert">
        <div class="info">{{ item.info }}</div>
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
        const buttonList:{
            click:()=>void,
            name:string
        }[] = []
        //有设置按钮
        if(item.buttons){
            const list = item.buttons.map(button=>{
                return {
                    click:()=>clickButton(button.click),
                    name:button.name
                }
            })
            buttonList.push(...list)
        }
        //否则看确认和取消
        else{
            if(item.confirm != null){
                buttonList.push({
                    click:()=>clickButton(item.confirm),
                    name:"确认"
                })
            }
            //取消默认存在，除非设置为null
            if(item.quit!==null){
                buttonList.push({
                    click:()=>clickQuit(),
                    name:"取消"
                })
            }
        }
        
        
        return buttonList
    }()

    //点击任意一个按钮最终都会关闭弹窗
    function clickButton(func:(()=>void)|null){
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