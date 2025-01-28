<template>
    <div class="focusingPage" v-if="quickDraftItem != null" v-show="ifFocusing">
        <div class="topButtons">
            <Button 
                :class="index == 0?'disabled':''"
                icon="leftArrow" 
                name="上一暂记对象" 
                @click="focusLastItem"/>
            <Button icon="leftArrow" name="管理页面" @click="ifFocusing = false"/>
            <Button icon="fold" name="收起暂记版" @click="foldQuickDraft"/>
            <Button 
                :class="index == nowQuickDraft.length ? 'disabled':''"
                icon="rightArrow" 
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
    const index = computed(()=>{
        if(!focusingItem.value)return null;
        return nowQuickDraft.indexOf(focusingItem.value)
    })
    const quickDraftItem = focusingItem
    const timeValue = computed(()=>{
        const tmp = reactive({
            number:0,
            unit:"date"
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
        if(index.value == null || index.value == nowQuickDraft.length)return;
        const newFocusingItem = nowQuickDraft[index.value+1]
        focusingItem.value = newFocusingItem
    }
    //收起暂记版
    function foldQuickDraft(){

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
            width: 60px;
            height: 60px;
        }
    }
</style>