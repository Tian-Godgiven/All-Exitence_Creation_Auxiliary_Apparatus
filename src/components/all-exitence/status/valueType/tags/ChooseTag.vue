<template>
<div class="chooseTag">
    <div class="separateLine"></div>
    <div class="inputTag">
        <DownLineInput placeholder="搜索或创建标签" :clear="true" v-model="input"></DownLineInput>
        <Button @click="addNewTag" icon="add"></Button>
        <Button @click="showTagLibrary" icon="tagLibrary"></Button>
    </div>
    <div class="separateLine"></div>
    <div class="tagLibrary">
        <SwitchExpand class="tagGroup" v-for="tagGroup in tags">
            <template #title>
                <div>{{ tagGroup.label }}</div>
            </template>
            <template #inner>
                <div class="tags">
                    <div class="tag" @click="chooseTag(tag.label)" v-for="tag in tagGroup.tags">
                        {{ tag.label }}
                    </div>
                </div>
            </template>
        </SwitchExpand>
        <NoContent v-if="tags.length==0" placeholder="无可选标签">
        </NoContent>
    </div>
</div>
</template>

<script setup lang='ts'>
    import Button from '@/components/global/Button.vue';
import NoContent from '@/components/global/NoContent.vue';
import DownLineInput from '@/components/other/input/downLineInput.vue';
import { callSupportAbility } from '@/hooks/app/app';
import { getTagLibrary } from '@/supportAbility/tagLibrary/tagLibrary';
import { computed, ref } from 'vue';
import SwitchExpand from '@/components/other/SwitchExpand.vue';
    const {addTag,chosenTags} = defineProps<{
        addTag:(newTag:string)=>void,
        chosenTags:string[]
    }>()
    //输入搜索内容
    const input = ref("")
    //创建新的tag
    function addNewTag(){
        if(input.value.trim() != ""){
            addTag(input.value)
            input.value = ""
        }
    }
    //显示标签库
    function showTagLibrary(){
        callSupportAbility("tagLibrary")
    }
    //获取标签库内容
    const tagLib = getTagLibrary()
    //筛选其中包含搜索内容且没有被选中的部分
    const tags = computed(()=>{
        const string = input.value
        //遍历标签库
        return tagLib.flatMap(tagGroup=>{
            const tagList = tagGroup.tags.flatMap(tag=>{
                if(tag.label.includes(string)&&!chosenTags.includes(tag.label)){
                    return tag
                }
                return []
            })
            if(tagList.length>0){
                return {
                    label:tagGroup.label,
                    __key:tagGroup.__key,
                    tags:tagList
                }
            }
            return []
        })
    })
    //选择了某个tag
    function chooseTag(tag:string){
        addTag(tag)
    }
</script>

<style scoped lang='scss'>
.chooseTag{
    .inputTag{
        display: flex;
        width: 80%;
        .button{
            flex-shrink: 0;
            width: 50px;
            height: 50px;
        }
    }
    .tagLibrary{
        .tagGroup{
            .tags{
                margin-left: 20px;
                flex-wrap: wrap;
                gap: 5px 10px;
                display: flex;
                .tag{
                    height: fit-content;
                    position: relative;
                    padding: 5px 15px;
                    border-radius: 10px;
                    background-color: $bgColor40;
                    color: white;
                }
            }
        }
    }
}
.separateLine{
    margin: 10px;
    height: 3px;
	background-color: $bgColor80;
}
</style>