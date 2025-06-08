<template>
<div class="projectPage" ref="projectRef">
    <div class="inner">
        <ProjectInfo v-for="project in projectList" :project="project"></ProjectInfo>
    </div>
    
    <div class="bottom">
        <BottomPanel></BottomPanel>
        <Button @click="createNewProject" icon="add" color="white"></Button>
    </div>
    
</div>
</template>

<script setup lang='ts'>
    import { disableChangePage, enableChangePage, hideMask, ifShowProject, showMask} from '@/hooks/pages/pageChange';
    import { createNewProject, nowProjectList } from '@/hooks/project/project';
    import ProjectInfo from './components/ProjectInfo.vue';
    import { computed, useTemplateRef, watch } from 'vue';
    import gsap from 'gsap';
    import Button from '@/components/global/Button.vue';
import BottomPanel from './components/BottomPanel.vue';

    const projectRef = useTemplateRef("projectRef")
    //显示与隐藏该页面的动画
    watch(ifShowProject,()=>{
        if(!projectRef.value)return;
        if(ifShowProject.value){
            gsap.to(projectRef.value,{
                y:"0%",
                duration:0.5,
                ease:"power2.inOut",
                onStart:()=>{
                    disableChangePage()
                    showMask(()=>{
                        ifShowProject.value = false
                    },0)
                }
            })
        }
        else{
            gsap.to(projectRef.value,{
                y:"105%",
                duration:0.5,
                ease:"power2.inOut",
                onComplete:()=>{
                    hideMask()
                    enableChangePage()
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
    height: 65%;
    width: 100%;
    z-index: 2;
    overflow: hidden;
    background-color: rgb(243, 243, 243);
    border-top-left-radius: 30px;
    border-top-right-radius: 30px;
    transform: translate(0,105%);
    box-shadow: $groundShadow;
    .inner{
        width: 100%;
        padding-top: 30px;
        box-sizing: border-box;
    }

    .bottom{
        position: fixed;
        bottom: 0;
        height: 150px;
        width: 100%;
        .button{
            position: absolute;
            top:0;
            left: calc(80% - 70px);
            transform: translateY(-50%);
            box-sizing: border-box;
            padding: 30px;
            border-radius: 50%;
            background-color: $antiBgColor;
            height: 140px;
            width: 140px;
            box-shadow: $groundShadow;
        }
    }
    
}
</style>