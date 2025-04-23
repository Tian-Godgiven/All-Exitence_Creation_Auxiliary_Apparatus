<template>
<TargetContainer :if-info="false">
    <template #title>
        {{ title[target] }}
    </template>
    <template #inner>
        <div v-if="target=='project'">
            <p>向→滑动展开操作页面<br>
                点击操作页面左上方的按钮，可以在[万物]与[文章]模式中进行切换
            </p>
            <p>如果你需要删除操作页面中的某一项，请长按以唤醒操作面板</p>
            <p>点击上方的项目名称，可以管理与切换不同的项目</p>
            <p>向←滑动，或点击右下角按钮显示各类辅助功能</p>
            <p>你可以随时通过[右上角的三个点点]→[操作教程]查看本页面</p>
            <p>更多更详细的操作指南请参见<a href="https://github.com/Tian-Godgiven/All-Exitence_Creation_Auxiliary_Apparatus">github页面</a>
                中的[操作指南]
            </p>
        </div>
        <div v-else-if="target=='app'">
            <p>本软件的github地址：
                <a href="https://github.com/Tian-Godgiven/All-Exitence_Creation_Auxiliary_Apparatus">
                    万物构造辅助装置 by Tian天恩</a>
            </p>
            <p>这是一个<b>免费</b>并且<b>开源</b>的软件!</p>
            <p>它可以在一定程度上帮助你构建世界观，管理不同事物的设定，同时在文本创作的过程中使用这些事物。</p>
            <p>如果你对这个软件的内容或功能存在任何意见、建议，亦或者在使用过程中遭遇任何问题，请通过上方链接中的联系方式告知我！</p>
            <br>
            <Button class="createNewProject" @click="createNewProject" name="创建新项目" :icon="null">
                点击创建你的新项目
            </Button>
        </div>
        <div v-else>这是一个错误页面，通常情况下是因为跳转到了一个意外的初始化页面</div>
    </template>
</TargetContainer>
</template>

<script setup lang='ts'>
    import { createNewProject } from '@/hooks/project/project';
    import TargetContainer from './TargetContainer.vue';
    import Button from '@/components/global/Button.vue';

    const {target} = defineProps<{
        target:"app"|"project"
    }>()

    //分为两种：软件初始页面和项目初始页面
    const title = {
        app:"欢迎使用本软件！",
        project:"开始你的创造"
    }

</script>

<style scoped lang='scss'>
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