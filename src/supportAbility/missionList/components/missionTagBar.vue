<template>
    <div class="tags">
        <MissionTag v-for="tag in tags" :tag="tag"/>
        <div class="addNewTag" :class="focusing?'focusing':''">
            <DownLineInput class="input" @blur="onBlur" @focus="onFocusing" v-model="newTag" placeholder="输入标签"/>
            <div class="button" @click="addTag">+</div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import DownLineInput from '@/components/other/input/downLineInput.vue';
import MissionTag from './missionTag.vue';
import { ref } from 'vue';

    const {tags} = defineProps<{tags:string[]}>()
    const newTag = ref("")
    function addTag(event:Event){
        event.stopPropagation();
        if(newTag.value != ""){
            console.log(tags)
            tags.push(newTag.value)
            newTag.value = ""
        }
    }
    //聚焦样式
    const focusing = ref(false)
    function onFocusing(){
        focusing.value = true
    }
    function onBlur(){
        focusing.value = false
    }
</script>

<style scoped lang='scss'>
    .tags{
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
        .addNewTag{
            border: 3px solid black;
            width: auto;
            padding: 6px 0;
            display: flex;
            .input{
                padding:0 6px;
                width: 4rem;
            }
            .button{
                padding:0 6px;
                border-left: 3px solid black;
            }
        }
        .addNewTag.focusing{
            box-shadow: 0 0 12px 3px rgb(62, 149, 255);
        }
    }
</style>