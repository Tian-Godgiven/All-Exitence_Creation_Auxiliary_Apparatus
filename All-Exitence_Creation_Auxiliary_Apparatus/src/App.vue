<template>
  <mainPage/>
</template>

<script setup lang="ts">
import mainPage from "./pages/mainPage.vue";

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
