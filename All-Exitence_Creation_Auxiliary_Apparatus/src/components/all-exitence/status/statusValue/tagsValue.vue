<template>
    <div class="tagsValue">
        <div @dblclick="clickDeleteTag(tag,index)" class="tag" v-for="tag,index in tags">
            {{ tag }}
        </div>
        <div class="addTag tag" v-if="ifAddTag">
            <downLineInputVue placeholder="新标签" v-model="newTag"/>
            <div @click="addTag">+</div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import downLineInputVue from '@/components/other/input/downLineInput.vue';
import { showAlert } from '@/hooks/alert';
import { isArray } from 'lodash';
import { computed, ref } from 'vue';

    const {status,statusSetting} = defineProps(["status","statusSetting"])
    let tags = status.value
    //添加新标签
    const ifAddTag = computed(()=>{
        if(!statusSetting || statusSetting.tagsAdd == null){
            return true
        }
        return statusSetting.tagsAdd
    })
    const newTag = ref("")
    function addTag(){
        if(newTag.value == ""){
            return false
        }
        else{
            //防呆
            if(!isArray(status.value)){
                status.value = []
                tags = status.value
            }
            status.value.push(newTag.value)
        }
        
        newTag.value = ""
    }
    //双击删除
    function clickDeleteTag(tag:string,index:number){
        showAlert({
            "info":`删除标签${tag}？`,
            "confirm":()=>{
                status.value.splice(index,1)
            }
        })
    }
</script>

<style scoped lang='scss'>
    .tagsValue{
        display: flex;
        flex-wrap: wrap;
        .tag{
            min-width: 50px;
            border:3px solid black;
            padding: 5px 10px;
            margin: 5px 5px;
        }
        .addTag{
            max-width: 200px;
            display: flex;
        }
    }
</style>