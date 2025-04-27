<template>
<div>
<svg class="bottomPanel" fill="inherit" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <mask id="the_mask">
        <!-- 白色像素下的所有内容都将可见 -->
        <rect x="0" :y="y" width="100%" height="100%" fill="white" />
        <!-- 黑色像素下的所有内容都将不可见 -->
        <circle cx="80%" :cy="y" r="40" fill="black" stroke="transparent" stroke-width="2"/>
        <!-- 圆角左 -->
        <path xmlns="http://www.w3.org/2000/svg" fill="black" 
            :d="`M ${leftPosi} ${y} 
                A 10 10 0 0 1 ${leftPosi+10} ${y+10} 
                L ${leftPosi+10} ${y} 
                Z`" />
        <!-- 圆角右 -->
        <path xmlns="http://www.w3.org/2000/svg" fill="black" 
            :d="`M ${rightPosi} ${y} 
                L ${rightPosi} ${y+10} 
                A 10 10 0 0 1 ${rightPosi+10} ${y} 
                Z`" />
    </mask>
    <!-- 绘制矩形 -->
    <rect x="0" :y="y" width="100%" height="100%" :fill="color" mask="url(#the_mask)"/>
</svg>
<div class="title">
    项目列表
</div>
</div>

</template>

<script setup lang='ts'>
    //屏幕宽度
    const width = window.innerWidth
    //圆角所在的位置
    const leftPosi = (width*0.8 - 50)+1
    const rightPosi = (width*0.8 + 40)-1
    //图形所在的高度
    const y = 0
    //颜色
    const color = "white"
</script>

<style scoped lang='scss'>
.bottomPanel{
    filter: drop-shadow(rgb(56, 56, 56) 0px 0px 15px)
}
.title{
    position: absolute;
    top: 50%;
    left: 30px;
    font-size: $fontSize20;
    transform: translateY(-50%);
}
</style>