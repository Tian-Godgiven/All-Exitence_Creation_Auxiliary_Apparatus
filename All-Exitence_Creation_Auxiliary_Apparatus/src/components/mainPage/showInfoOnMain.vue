<template>
    <div class="container">
        <initialProjectVue v-if="target == 'project'"></initialProjectVue>
		<initialAppVue v-else-if="target == 'app'"></initialAppVue>
        <div v-else>这是一个错误页面，通常情况下是因为跳转到了一个意外的初始化页面</div>
    </div>
</template>

<script setup lang='ts'>
    //分为两种：软件初始页面和项目初始页面
    import initialAppVue from './initialApp.vue';
    import initialProjectVue from './initialProject.vue';
    const {target} = defineProps(["target"])
    

</script>

<style scoped lang='scss'>
    @use "@/static/style/mainPage.scss";
    .container{
        @extend .targetContainer;
    }
</style>