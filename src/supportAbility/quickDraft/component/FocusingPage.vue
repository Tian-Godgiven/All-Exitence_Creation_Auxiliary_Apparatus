<template>
    <div class="focusingPage" 
        v-if="quickDraftItem != null" 
        v-show="ifFocusing">
        <div class="topButtons">
            <Button 
                :icon="index == 0? 'leftArrow-disabled':'leftArrow'" 
                name="上一暂记对象" 
                @click="focusLastItem"/>
            <Button 
                icon="backMain" 
                name="管理页面" 
                @click="showManagePage"/>
            <Button 
                v-if="float"
                icon="collapse" 
                name="折叠悬浮窗" 
                @click="fold"/>
            <Button 
                :icon="index == nowQuickDraft.length-1? 'rightArrow-disabled':'rightArrow'" 
                name="下一暂记对象" 
                @click="focusNextItem"/>
        </div>
        <Button class="createNewButton" 
            icon="add" 
            name="创建新暂记对象" 
            @click="createNewItem"/>
        <div class="times">
            <Time class="time" :value="timeValue" rule="date" unit-from="year" unit-end="day" linker="/" :show-unit="false"></Time>
            <Time class="time" :value="timeValue" rule="date" unit-from="hour" unit-end="minute" linker=":" :show-unit="false"></Time>
        </div>
        <TextArea class="inner"
            placeholder="无内容"
            @focus="quickDraftItem.time = Date.now()"
            :input-support="true"
            input-suggestion-list="all"
            v-model="quickDraftItem.inner">
        </TextArea>
    </div>
</template>

<script setup lang='ts'>
    import { computed, reactive } from 'vue';
    import { addQuickDraftItem, createQuickDraftItem, focusingItem, ifFocusing, nowQuickDraft } from '../quickDraft';
    import TextArea from '@/components/other/textArea/textArea.vue';
    import Time from '@/components/global/time.vue';
    import Button from '@/components/global/button.vue';
    const {float = false,foldFloatWindow=()=>{}} 
        = defineProps<{float?:boolean,foldFloatWindow?:()=>void}>() 
    const index = computed(()=>{
        if(!focusingItem.value)return null;
        return nowQuickDraft.indexOf(focusingItem.value)
    })
    const quickDraftItem = focusingItem
    const timeValue = computed(()=>{
        const tmp = reactive({
            number:0,
            rule:"date"
        })
        if(focusingItem.value){
            tmp.number = focusingItem.value.time
        }
        else{
            tmp.number = 0
        }
        return tmp
    })
    //聚焦到上一个暂记对象
    function focusLastItem(){
        if(index.value == null || index.value == 0)return;
        const newFocusingItem = nowQuickDraft[index.value-1]
        focusingItem.value = newFocusingItem
    }
    //聚焦到下一个暂记对象
    function focusNextItem(){
        if(index.value == null || index.value == nowQuickDraft.length-1)return;
        const newFocusingItem = nowQuickDraft[index.value+1]
        focusingItem.value = newFocusingItem
    }
    //折叠悬浮窗
    function fold(){
        foldFloatWindow()
    }
    //创建并聚焦到新的暂记版,使得新暂记版在当前暂记版之后
    function createNewItem(){
        const newItem = createQuickDraftItem()
        if(index.value==null)return;
        //将其位置放到到当前index之后
        addQuickDraftItem(newItem,index.value+1)
        //聚焦到该暂记版
        focusingItem.value = newItem
    }
    //显示管理页面
    function showManagePage(){
        //收起暂记版，弹出弹窗
        if(float){
            
        }
        //切换至弹窗
        else{
            ifFocusing.value = false
        }
    }
</script>

<style scoped lang='scss'>
    @use "@/static/style/global.scss" as global;

    .focusingPage{
        background-color: global.$bgColor;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        box-sizing: border-box;
        padding: 20px;
        z-index: 2;
        .topButtons{
            height: 60px;
            display: flex;
            >div{
                width: 60px;
                height: 60px;
            }
        }
        .createNewButton{
            position: absolute;
            right: 50px;
            bottom: 100px;
            width: 90px;
            height: 90px;
            box-shadow: 0 0 5px 5px rgb(77, 77, 77);
            border-radius: 50%;
            z-index: 999;
        }
        .times{
            display: flex;
            color: rgb(101, 101, 101);
            gap: 10px;
        }
        .inner{
            height: calc(100% - 60px);
        }
    }
</style>