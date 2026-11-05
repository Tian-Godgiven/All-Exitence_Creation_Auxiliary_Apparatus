<template>
    <main class="manual">
        <section><h3>创建与编辑</h3><p>双击画布空白处创建普通文本节点并立即输入。双击节点进入编辑，左键拖动节点调整位置。</p></section>
        <section><h3>画布与连线</h3><p>中键或右键拖动画布可平移，滚轮缩放。按住节点右键并拖到另一节点可建立连线；右键点击连线可删除。</p></section>
        <section><h3>便签标记</h3><p>普通节点右键选择“标记为便签”，即可使用富文本、颜色与尺寸调整。便签右键可改色或取消便签标记，内容和连线都会保留。</p></section>
        <section><h3>快速删除</h3><p>按住 Alt 后右键划过节点或连线，松开即可切割删除命中的内容。删除节点会同时删除其关联线。</p></section>
        <section><h3>其他操作</h3><p>右键点击节点可转换、删除或移入项目。普通节点的大小随文字自动变化；便签右下角可拖动缩放。</p></section>
    </main>
</template>

<style scoped lang="scss">
.manual { display: flex; max-width: 500px; flex-direction: column; gap: 14px; }.manual section { padding-bottom: 12px; border-bottom: 1px solid $bgColor70; }.manual section:last-child { padding-bottom: 0; border-bottom: 0; }.manual h3 { margin: 0 0 5px; font-size: 1rem; }.manual p { margin: 0; color: $previewText; line-height: 1.65; }
</style>
