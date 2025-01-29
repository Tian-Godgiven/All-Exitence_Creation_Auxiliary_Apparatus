输出可拖拽对象：getDraggable
输出可放置对象：getDroppable

输出拖拽放置对象：getCombine

~~~
getCombine({
	element,dragHandle,getData,canDrop,idle,dragState,}:{
    element:HTMLElement,
    dragHandle:HTMLElement,
    getData:()=>Record<string, any>,
    idle:DragState,
    dragState:Ref<DragState>,
    canDrop:(source:any)=>boolean
})
~~~

预览对象

~~~
<Teleport v-if="dragState.type=='preview'" :to="dragState.container">
    <div class="chapterShadow">{{ article.title }}</div>
</Teleport>
~~~

线条

~~~
<Indicator v-if="dragState.type === 'be-dragging-edge' 
    && dragState.edge!=null" :edge="dragState.edge"
    gap="0px" />
~~~

