<template>
    <mainPage/>
</template>

<script setup lang="ts">
import { initFileSystem} from "./hooks/fileSysytem";
import { startAutoSave } from "./hooks/project/saveProject";
import mainPage from "./pages/mainPage.vue";


//初始化文件系统
initFileSystem()
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
