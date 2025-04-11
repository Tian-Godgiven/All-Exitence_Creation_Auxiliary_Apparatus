<template>
    <div class="initialApp">
        <div class="title">欢迎使用本软件！</div>
        <div class="inner">
            <p>本软件的github地址：
                <a href="https://github.com/Tian-Godgiven/All-Exitence_Creation_Auxiliary_Apparatus">
                    万物构造辅助装置 by Tian天恩
                </a>
            </p>
            <p>
                这是一个<b>免费</b>并且<b>开源</b>的软件!
            </p>
            <p>
                它可以在一定程度上帮助你构建世界观，管理不同事物的设定，同时在文本创作的过程中使用这些事物。
            </p>
            <p>
                如果你对这个软件的内容或功能存在任何意见、建议，亦或者在使用过程中遭遇任何问题，请通过上方链接中的联系方式告知我！
            </p>
            <br>
            
            <Button class="createNewProject" @click="createNewProject" name="创建新项目" :icon="null">
                点击创建你的新项目
            </Button>
        </div>
    </div>
</template>

<script setup lang='ts'>
    import { createNewProject } from '@/hooks/project/project';
    import Button from '../global/Button.vue';
</script>

<style scoped lang='scss'>
    @use "@/static/style/rightPage.scss";
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

		font-size: $midFontSize;
		color: $textColor;

        text-align: center;
    }
    .inner{
        height: calc(100% - 110px);
		overflow: auto;
		width: 100%;
        >p{
            text-indent: 2em;
            margin: 0;
        }
    }
    .createNewProject{
        display: flex;
        margin:0 auto;
        justify-content: center;
        align-items: center;
        width: 60%;
        border:3px solid black;
        border-radius: 20px;
        padding: 20px;
    }
</style>