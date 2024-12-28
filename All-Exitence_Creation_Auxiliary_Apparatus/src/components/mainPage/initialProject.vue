<template>
    <div class="initProject">
        <div class="title">开始你的创造</div>
        <div class="inner">
            <div>向→滑动展开操作页面<br>
                点击操作页面左上方的按钮，可以在[万物]与[文章]模式中进行切换
            </div>
            <div>如果你需要删除操作页面中的某一项，请长按以唤醒操作面板</div>
            <br>
            <div>点击上方的项目名称，可以管理与切换不同的项目</div>
            <br>
            <div>向←滑动，或点击右下角按钮显示各类辅助功能</div>
            <br>
            <div>你可以随时通过[右上角的三个点点]→[操作教程]查看本页面</div>
            <div>更多更详细的操作指南请参见<a href="https://github.com/Tian-Godgiven/All-Exitence_Creation_Auxiliary_Apparatus">github页面</a>
                中的[操作指南]
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
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