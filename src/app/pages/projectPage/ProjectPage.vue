<template>
<div class="projectPage" ref="projectRef">
    <div class="projectInfo">
        <ProjectInfo v-for="project in projectList" :project="project"></ProjectInfo>
    </div>
    <div class="bottom">
        <div class="createProject" @click="createNewProject">创建新项目</div>
    </div>
</div>
</template>

<script setup lang='ts'>
    import { changePageMask, ifShowProject} from '@/hooks/pages/pageChange';
    import { createNewProject, nowProjectList } from '@/hooks/project/project';
    import ProjectInfo from './components/ProjectInfo.vue';
    import { computed, useTemplateRef, watch } from 'vue';
    import gsap from 'gsap';

    const projectRef = useTemplateRef("projectRef")
    //显示与隐藏该页面的动画
    watch(ifShowProject,()=>{
        if(!projectRef.value)return;
        if(ifShowProject.value){
            gsap.to(projectRef.value,{
                y:"0%",
                duration:0.5,
                ease:"power2.inOut",
                onUpdate:()=>{
                    const yPercent = gsap.getProperty(projectRef.value, "y") as number
                    changePageMask((1-yPercent/100),()=>{
                        ifShowProject.value = false
                    })
                },
            })
        }
        else{
            gsap.to(projectRef.value,{
                y:"100%",
                duration:0.5,
                ease:"power2.inOut",
                onUpdate:()=>{
                    const yPercent = gsap.getProperty(projectRef.value, "y") as number
                    changePageMask((1-yPercent/100))
                },
            })
        }
    })
        
    const projectList = computed(()=>{
        return nowProjectList.value
    })

</script>

<style scoped lang='scss'>
    .projectPage{
        position: fixed;
        bottom: 0;
        height: 80%;
        width: 100%;
        background-color: black;
        z-index: 2;
        overflow: hidden;
        transform: translate(0,100%);
        .bottom{
            position: absolute;
            bottom: 0;
            height: 200px;
            width: 100px;
            color: white;
        }
    }
</style>