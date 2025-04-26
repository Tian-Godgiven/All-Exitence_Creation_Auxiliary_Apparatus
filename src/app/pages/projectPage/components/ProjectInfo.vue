<template>
    <div class="projectInfo" @click="clickMoveProject">
        <div class="name">{{ project.name }}</div>
        <div class="info">{{ project?.info }}</div>
        <Button name="编辑" @click="editProjectInfo(project)"></Button>
        <Button name="删除" @click="deleteProject(project)"></Button>
    </div>
</template>

<script setup lang='ts'>

import { hidePage } from '@/hooks/pages/pageChange';
import { deleteProject, moveToProject, editProjectInfo, ProjectInfo } from '@/hooks/project/project';
import Button from '@/components/global/Button.vue';
    const {project} = defineProps<{project:ProjectInfo}>()
    //点击切换到项目
    function clickMoveProject(){
        moveToProject(project.pathName)
        //把项目页面藏起来
        hidePage('project')
    }

</script>

<style scoped lang='scss'>
.projectInfo{
    box-sizing: border-box;
    width: 100%;
    margin:5px;
}
</style>