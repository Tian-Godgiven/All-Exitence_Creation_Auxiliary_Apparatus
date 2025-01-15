<template>
    <mainPage/>
</template>

<script setup lang="ts">
import { initApp } from "./hooks/app/app";
import { initProject } from "./hooks/project/project";
import { startAutoSave } from "./hooks/project/saveProject";
import mainPage from "./pages/mainPage.vue";



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
  
</style>
