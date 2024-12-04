[toc]

# 内容

## 输入与显示

其本质上是一个contenteditable的可编辑组件，高度自适应+点击空白区域自动聚焦

## 输入补全

当有效输入内容（即

# 使用

## 属性

prop属性

~~~
placeholder string 占位符,输入内容为空时显示;
inputSupport bool 是否显示输入辅助,为true时会在输入框聚焦时显示输入辅助，点击不具备InputSupport的区域时会隐藏输入辅助栏
checkList [] 输入补全列表，只有给出输入补全列表，才会在该textArea中提供输入补全功能，详见上方输入补全
~~~

~~~
v-model : 双向绑定的内容值，会在输入时更新
~~~

## 方法

~~~
blur : 在输入栏失去焦点时触发，若此时无内容则会显示placeholder
focus : 在输入栏获得焦点时触发，若此时显示placeholder则会清除placeholder并重新聚焦一次
input: 会在输入栏中进行输入时触发，此时还会判断是否进行输入补全提示
~~~

