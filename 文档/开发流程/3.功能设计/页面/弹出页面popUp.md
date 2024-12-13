[toc]

# 弹窗popUp

`components/mainPage/popUp.vue`
`hooks/popUp.vue`

显示在主页面最上层的页面
弹窗显示时会使得mask遮罩层显示

## 结构

~~~
popUpList = [popUp] //当前显示的弹窗列表
~~~

popUp对象接口

~~~ts
{
	name?:string, //弹窗的标题名称,默认为无
	buttons:Button[], //弹窗中，需要在右上角显示的按钮以及这些按钮的点击事件
	props?:{}, //弹窗的组件中需要使用的数据
	vueName?:string, //弹窗对应的vue对象名称
	vue?:any, //弹窗中显示的vue组件
	mask:boolean, //是否显示遮罩层
	returnValue?:(T:any)=> any, //用于在弹窗中使用的返回回调事件
	index?:number, //弹窗的位置，一般来说不需要设置,
	size?:{ //弹窗的尺寸，默认为650rpx，80%（最大）
		width?:string,
		height?:string,
	}
}
~~~

button对象接口

~~~
{
	name:string //按键的名称，在没有icon时显示名称
	click:function //按键的点击事件
	icon?:string //按键的图标url地址
}
~~~

## 数据

弹窗的内部组件会获得如下props

~~~
props:{} //在弹窗创建时给出的props参数
returnValue:function //弹窗创建给出的回调函数returnValue
popUp:PopUp //这个弹窗对象本身，主要用于内部控制弹窗
~~~



## 方法

### 显示一个弹窗

showPopUp(popUp)

要求输入一个popUp对象，对象将会被渲染到最上层，并且显示mask
mask的z-index会被设置为 5+index

### 隐藏一个弹窗

hidePopUp(popUp?)

选择输入一个popUp对象，将其从列表中删除
如果不输入指定对象，则会删除列表中最末尾的元素
当maskI
