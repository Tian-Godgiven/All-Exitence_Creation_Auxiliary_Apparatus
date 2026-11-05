<template>
<Button class="projectInfo" @click="clickMoveProject">
    <div class="top">
        <div class="name">{{ project.name }}</div>
        <div class="buttons">
            <Button icon="edit" name="编辑" @click="editProjectInfo(project)"></Button>
            <Button icon="delete" name="删除" :disabled="isActionPending(`project-delete:${project.__key}`)" :loading="isActionPending(`project-delete:${project.__key}`)" @click="deleteProject(project)"></Button>
        </div>
    </div>
    <div class="info">{{ project?.info }}</div>
</Button>
</template>

<script setup lang='ts'>
    import { hidePage } from '@/hooks/pages/pageChange';
    import { deleteProject, moveToProject, editProjectInfo, ProjectInfo } from '@/hooks/project/project';
    import Button from '@/components/global/button.vue';
    import { isActionPending } from '@/hooks/app/pendingAction';
    const {project} = defineProps<{project:ProjectInfo}>()
    //点击切换到项目
    async function clickMoveProject(){
        await moveToProject(project.pathName)
        //把项目页面藏起来
        hidePage('project')
    }

</script>

<style scoped lang='scss'>
.projectInfo{
    box-sizing: border-box;
    width: 100%;
    padding: 10px 20px;
    flex-direction: column;
    align-items: unset;
    .top{
        height: 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .name{
            flex-grow: 1;
			min-width: 0;
            font-size: 1.4rem;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
        }
        .buttons{
            display: flex;
            height: 100%;
            gap:10px;
            >.button{
                height: 100%;
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
