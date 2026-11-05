<template>
<div class="projectPage" :class="{desktopShowing: ifShowProject}" ref="projectRef">
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
import { computed, onBeforeUnmount, onMounted, useTemplateRef, watch } from 'vue';
    import gsap from 'gsap';
    import Button from '@/components/global/button.vue';
import BottomPanel from './components/BottomPanel.vue';
import { isDesktopLayout } from '@/hooks/pages/pageChange';

    const projectRef = useTemplateRef("projectRef")
    function closeOnOutsidePointerDown(event: PointerEvent){
        if(!ifShowProject.value)return
        const target = event.target
        if(!(target instanceof Element))return
        if(projectRef.value?.contains(target))return
        ifShowProject.value = false
    }
    onMounted(()=>document.addEventListener("pointerdown", closeOnOutsidePointerDown, true))
    onBeforeUnmount(()=>document.removeEventListener("pointerdown", closeOnOutsidePointerDown, true))
    //显示与隐藏该页面的动画
    watch(ifShowProject,()=>{
        if(!projectRef.value)return;
        if(isDesktopLayout()){
            gsap.to(projectRef.value, {
                opacity: ifShowProject.value ? 1 : 0,
                duration: 0.2,
                ease: "power2.inOut",
                onStart:()=>{
                    if(ifShowProject.value){
                        disableChangePage()
                        showMask(()=>{
                            ifShowProject.value = false
                        },0)
                    }
                },
                onComplete:()=>{
                    if(!ifShowProject.value){
                        hideMask()
                        enableChangePage()
                    }
                }
            })
            return
        }
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

@media (min-width: 900px){
    .projectPage{
        top: 50%;
        bottom: auto;
        left: 50%;
        width: min(560px, calc(100vw - 48px));
        height: min(560px, calc(100vh - 96px));
        max-height: calc(100vh - 96px);
        z-index: 6;
        border-radius: 8px;
        transform: translate(-50%, -50%);
        opacity: 0;
        pointer-events: none;
        .inner{
            height: calc(100% - 56px);
            overflow: auto;
            padding-top: 12px;
        }
        .bottom{
            position: absolute;
            height: 56px;
            :deep(svg.bottomPanel){ display: none; }
            :deep(.title){
                top: 50%;
                left: 20px;
                font-size: 1.25rem;
            }
            .button{
                top: 50%;
                left: auto;
                right: 16px;
                width: 32px;
                height: 32px;
                padding: 8px;
                border-radius: 6px;
                transform: translateY(-50%);
                box-shadow: none;
            }
        }
        &.desktopShowing{ pointer-events: auto; }
    }
}
</style>
