<template>
    <div class="editChapter">
        <div>{{ title }}</div>
        <downLineInputVue class="chapterName" v-model="name" placeholder="输入章节名称"/>
        <div class="buttons">
            <div @click="confirm" class="button">确认</div>
            <div @click="closePopUp(popUp)" class="button">取消</div>
        </div>
    </div>
</template>

<script setup lang='ts'>
    import { ref } from 'vue';
    import downLineInputVue from '@/components/other/input/downLineInput.vue';
    import { closePopUp } from '@/hooks/pages/popUp';
    import { showQuickInfo } from '@/api/showQuickInfo';

    const {props,popUp,returnValue} = defineProps(["props","popUp","returnValue"])
    const {chapter={name:""},title=null} = props 
    const name = ref(chapter.name)

    //确认创建文章
    function confirm(){
        //验证文章名是否为空
		if(name.value == ""){
			showQuickInfo("文章名不可为空")
			return false
		}
        returnValue(name.value)
        closePopUp(popUp)
    }
</script>

<style scoped lang='scss'>
@use "@/static/style/popUp.scss";
    .chapterName{
			position: relative;
			margin-top:auto;
			font-size: 1.4rem;
			width: 550px;
			height: 60px;
		}
    .buttons{
        @extend .finalButtons;
    }
</style>