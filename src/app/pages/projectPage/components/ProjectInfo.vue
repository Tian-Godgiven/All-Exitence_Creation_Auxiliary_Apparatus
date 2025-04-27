<template>
<Button class="projectInfo" @click="clickMoveProject">
    <div class="top">
        <div class="name">{{ project.name }}</div>
        <div class="buttons">
            <Button icon="edit" name="编辑" @click="editProjectInfo(project)"></Button>
            <Button icon="delete" name="删除" @click="deleteProject(project)"></Button>
        </div>
    </div>
    <div class="info">{{ project?.info }}</div>
</Button>
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
    padding: 0 20px;
    padding-bottom: 20px;
    .top{
        height: 2rem;
        display: flex;
        align-items: center;
        .name{
            flex-grow: 1;
            font-size: 1.4rem;
        }
        .buttons{
            display: flex;
            height: 100%;
            >.button{
                width: 45px;
                height: 100%;
                margin: 0 10px;
            }
        }
    }
    .info{
        word-break: break-all;
        word-wrap: break-word;
        width: 100%;
        color: $previewText;
    }
}
</style>