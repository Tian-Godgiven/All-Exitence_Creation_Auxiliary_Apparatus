[toc]

# 可移动列表`<draggableList>`

传入一个数组，生成一个竖向列表，列表中的通过拖动节点node以改变位置列表项的顺序，同时也会改变列表中相应元素的排列顺序

支持插槽，传入的内容将作为每个node的内容，插槽回传`element`和`index`

~~~
<draggableListVue 
	:list = "" //用于node的列表
	@dragEnd="" //拖拽开始和结束事件
	v-slot="{element:value,index}" //插槽回传的值和index,value可以重命名>
	//插槽内容，尽量用一个单独的div
    <div>
    </div>
</draggableListVue>
~~~

可配置项

1.拖拽事件



