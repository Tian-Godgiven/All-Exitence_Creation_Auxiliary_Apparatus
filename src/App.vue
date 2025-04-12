<template>
<div class="app">
    <!-- 主页面 -->
    <MainPage/>
    <!-- 项目管理页面 -->
    <ProjectPage/>
    <!-- 左侧页面-->
    <LeftPage/>
    <!-- 右滑页面 -->
    <RightPage/>

    <!-- 弹窗层 -->
	  <PopUpStacks/>
    <!-- 浮窗层 -->
    <FloatWindows/>
    <!-- 页面遮罩层 -->
	  <PageMask/>
</div>
</template>

<script setup lang="ts">
import { initApp } from "./hooks/app/app";
import { initProject } from "./hooks/project/project";
import { startAutoSave } from "./hooks/project/saveProject";
import MainPage from "@/app/pages/MainPage.vue"
import ProjectPage from "@/app/pages/ProjectPage.vue";
import LeftPage from "@/app/pages/LeftPage.vue";
import RightPage from "@/app/pages/RightPage.vue";
import PageMask from '@/app/pages/PageMask.vue';
import FloatWindows from "@/app/stacks/FloatWindowsStacks.vue";
import PopUpStacks from "@/app/stacks/popUp/PopUpStacks.vue";
// 初始化应用程序
initApp().then(()=>{
    //初始化项目
    initProject()
})

//开始自动保存
startAutoSave()

</script>

<style scoped>
  html{
    font-size: 16px;
  }
  body{
    :deep(.el-cascader-menu){
      min-width: auto !important;
    }
  }
  .app{
    width: 100vw;
    height: 100vh;
    z-index: 0;
  }
  
</style>
