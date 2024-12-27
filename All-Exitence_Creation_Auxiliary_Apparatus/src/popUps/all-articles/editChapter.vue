<template>
    <div class="editChapter">
        <div>向{{ position }}插入该章节</div>
        <downLineInputVue v-model="name" placeholder="输入章节名称"/>
        <div class="buttons">
            <div @click="confirm" class="button">确认</div>
            <div @click="closePopUp(popUp)" class="button">取消</div>
        </div>
    </div>
</template>

<script setup lang='ts'>
    import { computed, ref } from 'vue';
    import downLineInputVue from '@/components/other/input/downLineInput.vue';
    import { closePopUp } from '@/hooks/pages/popUp';

    const {props={chapter:{name:""},positionChapter:null},popUp,returnValue} = defineProps(["props","popUp","returnValue"])
    const {chapter,positionChapter} = props 
    const name = ref(chapter.name)

    const position = computed(()=>{
        if(!positionChapter){
            return "文章底部"
        }
        else{
            return positionChapter.name + "中"
        }
    })

    function confirm(){
        returnValue(name.value)
        closePopUp(popUp)
    }
</script>

<style scoped lang='scss'>

</style>