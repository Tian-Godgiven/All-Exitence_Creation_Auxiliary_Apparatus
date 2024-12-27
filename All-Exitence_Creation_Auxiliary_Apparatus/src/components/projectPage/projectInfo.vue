<template>
    <div class="projectInfo" @click="clickMoveProject">
        <div class="name">{{ name }}</div>
        <div class="info">{{ info }}</div>
        <div class="edit" @click="clickEdit">编辑</div>
        <div class="delete" @click="clickDelete">删除</div>
    </div>
</template>

<script setup lang='ts'>

import { hidePage } from '@/hooks/pages/pageChange';
import { deleteProject, moveToProject, editProjectInfo } from '@/hooks/project/project';
import { computed } from 'vue';
    const {project} = defineProps(["project"])
    const name = computed(()=>{
        return project.name
    })
    const info = computed(()=>{
        return project?.info
    })
    //点击切换到项目
    function clickMoveProject(){
        const path = project.pathName
        moveToProject(path)
        //把项目页面藏起来
        hidePage('project')
    }
    //点击删除项目
    function clickDelete(event:any){
        event.stopPropagation();
        deleteProject(project)
    }
    //点击编辑项目
    function clickEdit(event:any){
        event.stopPropagation();
        editProjectInfo(project)
    }
</script>

<style scoped lang='scss'>
    .projectInfo{
        box-sizing: border-box;
        width: 100%;
        border: 3px solid white;
        color:white;
        margin:5px;
    }
</style>