<template>
    <div class="projectPage" :style="{height:pageHeight}" projectPage>
        <div class="projectInfo">
            <projectInfoVue v-for="project in projectList" :project="project"></projectInfoVue>
        </div>
        <div class="bottom">
            <div class="createProject" @click="createNewProject">创建新项目</div>
        </div>
        
    </div>
</template>

<script setup lang='ts'>
    import { projectShowHeight } from '@/hooks/pages/pageChange';
    import { createNewProject, nowProjectList } from '@/hooks/project/project';
    import projectInfoVue from '@/components/projectPage/projectInfo.vue';
    import { computed } from 'vue';
    
    const pageHeight = computed(()=>{
        return projectShowHeight.value + "px"
    }) 
    
    const projectList = computed(()=>{
        return nowProjectList.value
    })

</script>

<style scoped lang='scss'>
    .projectPage{
        position: absolute;
        bottom: 0;
        max-height: 80%;
        width: 100%;
        background-color: black;
        z-index: 2;
        overflow: hidden;
        .bottom{
            position: absolute;
            bottom: 0;
            height: 200px;
            width: 100px;
            color: white;
        }
    }
</style>