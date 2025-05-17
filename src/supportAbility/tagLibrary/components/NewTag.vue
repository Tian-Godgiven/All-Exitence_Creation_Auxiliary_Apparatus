<template>
<div class="newTag" ref="divRef" @pointerdown.stop>
    <DownLineInput placeholder="新标签" v-model="newTag"/>
    <div @click="addTag">+</div>
</div>
</template>

<script setup lang='ts'>
    import { onMounted, ref, useTemplateRef } from 'vue';
import { addTagToGroup, TagGroup } from '../tagLibrary';
import DownLineInput from '@/components/other/input/downLineInput.vue';
    const {tagGroup} = defineProps<{
        tagGroup:TagGroup,
    }>()
    const mode = defineModel<boolean>({default:false})
    //新tag的输入内容
    const newTag = ref("")

    //点击切换为输入模式,点击到外部换回去
    const divRef = useTemplateRef("divRef")
    const listener = (event:MouseEvent)=>{
        if(divRef.value && !divRef.value.contains(event.target as Node)){
            mode.value = false;
            newTag.value = ""
            document.removeEventListener("click",listener)
        }
    }
    onMounted(()=>{
        newTag.value = ""
        document.addEventListener("click",listener)
    })
    //添加tag
    function addTag(){
        addTagToGroup(tagGroup,newTag.value)
        newTag.value = ""
    }
</script>

<style scoped lang='scss'>
.newTag{
        min-width: 50px;
        border:3px solid black;
        padding: 5px 10px;
        margin: 5px 5px;
        max-width: 200px;
        display: flex;
    }
</style>