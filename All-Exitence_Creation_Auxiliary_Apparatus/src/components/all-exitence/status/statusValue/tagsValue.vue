<template>
    <div class="tagsValue">
        <div class="tag" v-for="tag in tags">
            {{  tag }}
        </div>
        <div class="addTag tag" v-if="ifAddTag">
            <downLineInputVue placeholder="新标签" v-model="newTag"/>
            <div @click="addTag">+</div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import downLineInputVue from '@/components/other/input/downLineInput.vue';
import { isArray } from 'lodash';
import { computed, ref } from 'vue';
    let tags:any[]

    const {status,statusSetting} = defineProps(["status","statusSetting"])

    const model = defineModel<any>()

    if(!status){
        tags = model.value
    }else{
        tags = status.value
    }
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
        if(!status){
            model.value.push(newTag.value)
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