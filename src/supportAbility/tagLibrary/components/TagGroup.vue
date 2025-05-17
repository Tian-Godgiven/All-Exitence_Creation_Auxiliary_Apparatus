<template>
<LongTap :long-tap class="tagGroup" :key="tagGroup.__key">
<SwitchExpand :no-wave="true">
    <template #title>
        <div class="top">
            <BoxInput 
                :prevent-click="true"
                placeholder="未命名" 
                class="title" 
                :switch-input="true" 
                v-model="tagGroup.label">
            </BoxInput>
            <Button class="addTag" icon="add" @click="addTag"></Button>
        </div>
    </template>
    <template #inner>
        <div class="tagContainer" v-if="(tagGroup.tags.length != 0)||addNewTag">
            <TagDiv v-for="tag in tagGroup.tags" :tag :tag-group></TagDiv>
            <NewTag v-if="addNewTag" :tagGroup v-model="addNewTag"></NewTag>
        </div>
        <Nocontent v-if="(tagGroup.tags.length == 0) && !addNewTag"></Nocontent>
    </template>
</SwitchExpand>
</LongTap>
</template>

<script setup lang='ts'>
import { createTagGroup, deleteTagGroup, TagGroup } from '../tagLibrary';
import TagDiv from './TagDiv.vue';
import LongTap from '@/components/other/LongTap.vue';
import { showControlPanel } from '@/hooks/controlPanel';
import BoxInput from '@/components/other/input/BoxInput.vue';
import SwitchExpand from '@/components/other/SwitchExpand.vue';
import NewTag from './NewTag.vue';
import { ref } from 'vue';
import Button from '@/components/global/Button.vue';
import Nocontent from '@/components/global/NoContent.vue';
    const {tagGroup,index} = defineProps<{tagGroup:TagGroup,index:number}>()
    //长按
    const longTap = function(){
        showControlPanel({
            option:[{
                text:"删除",
                click:()=>{
                    deleteTagGroup(tagGroup)
                }
            },{
                text:"在下方新增标签组",
                click:()=>{
                    createTagGroup("未命名标签组",index+1)
                }
            },{
                text:"在上方新增标签组",
                click:()=>{
                    createTagGroup("未命名标签组",index)
                }
            }]
        })
    }
    //显示新增标签
    const addNewTag = ref(false)
    function addTag(){
        addNewTag.value = !addNewTag.value
    }
</script>

<style scoped lang='scss'>
.tagGroup{
    margin: 15px 0;
    box-shadow: 0 0 10px rgb(107, 107, 107);
    border-radius: 10px;
    .top{
        width: 100%;
        display: flex;
        .addTag{
            width: 50px;
            height: 50px;
        }
    }
    .tagContainer{
        display: flex;
        flex-wrap: wrap;
        gap:5px 10px;
        padding: 9px;
    }
}

</style>