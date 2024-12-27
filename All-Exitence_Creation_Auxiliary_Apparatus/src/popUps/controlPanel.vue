<template>
    <div class="controlPanel">
        <div class="controlItem" 
            v-for="controlItem in control" 
            @click="clickControl(controlItem)">
            {{ controlItem.text }}
        </div>
    </div>
</template>

<script setup lang='ts'>
    import { closePopUp } from '@/hooks/pages/popUp';
    const {props={control:[]},popUp,returnValue} = defineProps(["props","popUp","returnValue"])
    const {control} = props
    //点击控制面板的项目
    function clickControl(controlItem:any){
        if(controlItem.click){
            const value = controlItem.click()
            if(returnValue){
                returnValue(value)
            } 
            closePopUp(popUp)
        }
    }
</script>

<style scoped lang='scss'>

</style>