<template>
    <div class="initialApp">
        <div class="title">欢迎使用本软件！</div>
        <div class="inner">
            <div>本软件的github地址：
                <a href="https://github.com/Tian-Godgiven/All-Exitence_Creation_Auxiliary_Apparatus">
                    万物构造辅助装置 by Tian天恩
                </a>
                <br>
                这是一个<b>免费</b>并且<b>开源</b>的软件<br>
                它可以在一定程度上帮助你构建世界观，管理不同事物的设定，同时使用这些事物进行文本创作<br>
                如果它能帮到你，那就再好不过了！如果你对这个软件的内容有任何意见、建议，亦或者在使用过程中存在任何问题，请通过上方链接中的联系方式联系我！
            </div>
            <div @click="createNewProject">点击这个按钮创建你的新项目</div>
        </div>
    </div>
</template>

<script setup lang='ts'>
    import { createNewProject } from '@/hooks/project/project';

</script>

<style scoped lang='scss'>
    @use "@/static/style/rightPage.scss";
    @use "@/static/style/global.scss" as global;
    .title{
		padding-top:40px;
        min-height: 70px;
		width: 100%;
		font-weight: bold;
		display: flex;
		align-items: center;
		justify-content: center;

		word-break: break-all;
		word-wrap: break-word;

		font-size: global.$midFontSize;
		color: global.$textColor;

        text-align: center;
    }
    .inner{
        height: calc(100% - 110px);
		overflow: auto;
		width: 100%;
    }
</style>