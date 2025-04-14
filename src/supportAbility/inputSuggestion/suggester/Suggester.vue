<template>
    <div class="suggester" 
        v-show="ifShow" 
        ref="container"
        :style="css">
        <div class="suggestionItem" v-for="item in content" 
            @click="itemClick(item)">
            <div class="text">{{ item.text }}</div>
            <div class="info">{{ item.info }}</div>
        </div>
    </div>
</template>

<script setup lang='ts'>
    import managePx from '@/api/managePx';
    import { ifShow,content,positionCSS, hideInputSuggestion, inputSuggestionEvent, clickSuggestionItem, SuggestionItem} from '@/supportAbility/inputSuggestion/suggester/inputSuggestion';
    import { computed, onMounted, onUnmounted, ref } from 'vue';
    const css = computed(()=>{
        //如果left会使其超出，则左移这个差值
        let left
        const width = managePx(350)
        const maxWidth = managePx(750)
        const distant =  (positionCSS.value.left + width) - maxWidth
        if(distant > 0){
            left = positionCSS.value.left - distant - 12 + "px"
        }
        else{
            left = positionCSS.value.left - 5 + "px"
        }
        const top = positionCSS.value.top + "px"
        return {left,top}
    })
    // 点击一个输入提示组件
    function itemClick(item:SuggestionItem){
        //触发其点击事件
        clickSuggestionItem(item)
        //隐藏输入提示
        hideInputSuggestion()
        //返回一个输入提示影响
        inputSuggestionEvent.value()
    }
//点击之外的部分隐藏
    const container = ref()
    function clickEvent(event:any){
        if(container.value && !container.value.contains(event.target)){
            hideInputSuggestion()
        }
    }
    onMounted(()=>{
        document.addEventListener("click",clickEvent)
    })
    onUnmounted(()=>{
        document.removeEventListener('click',clickEvent)
    })
</script>

<style scoped lang='scss'>
    .suggester{
        background-color: $bgColor;
        box-sizing:content-box;
        border: 3px solid black;
        padding: 10px;
        position: fixed;
        width: 350px;
        max-height: 700px;
        z-index: 200;
        overflow: auto;
        user-select: none !important;
        .suggestionItem{
            width: 100%;
            max-height: 200px;
            overflow: auto;
            user-select: none !important;
            .text{
                font-size: 1rem;
            }
            .info{
                margin-left: 20px;
                flex-direction: row-reverse;
                color: rgb(82, 82, 82);
                font-size: 0.8rem;
            }
        }
    }
</style>