[toc]

# 属性设置

保存为一个对象，对象内容为：`{name:value}`
其中name包括如下，请注意不得重名：

~~~
{
	chooseNum:[min,max],该属性的可选数量的最大最小值
	choice:[{value,*default}]该属性valueType为choose时的选项数组，若default为true则该选为默认选项
	range:该属性valueType为range时的范围数组：[min,max,step],
}
~~~



# 属性值设置项

`data/list/settingBoxOptions.ts`

对属性值进行设置的各个设置项

## 设置项表结构

设置项在表中的结构：

| key     | value              | 条件         | 介绍                                                         |
| ------- | ------------------ | ------------ | ------------------------------------------------------------ |
| name    | string             | 必须         | 该设置项的关键字                                             |
| *value  | null \|\| any      |              | 该设置项的值，存在时其值为默认值，具体类型和值由type决定，参见下方[设置项类型表] |
| text    | string             | 必须         | 该设置项的介绍文本                                           |
| type    | string             | 必须         | 该设置项的类型，参见下方[设置项类型表]                       |
| *select | function           |              | 决定是否渲染该设置项的函数                                   |
| *check  | function           |              | 判断设置项获取的值是否符合要求的函数                         |
| *inputs | string[]           | type==input  | 会根据数组内元素个数生成多个string输入框，每个输入框前面还会有一段对应元素内容的文本 |
| *choice | 选项数组或function | type==choose | 用于组成选项，这些选项需要可以直接被定义在此处，也可以通过方法来获得status中的choice值 |

### `select:function({})`函数

函数要求传入一个至少具备`{valueType:string, showType:string}`的对象作为参数  
若需要渲染该设置项，则在对应的条件后返回true，否则均不会渲染该设置项  
若不设置此项，则该设置项在任何条件下**均会渲染**

### check:function(value) 函数

在用户点击确定时，调用该函数，若返回值为true，则判断该设置正确  
参数统一为value，但其中的值和结构由设置项type决定，参见下方[设置项类型表]  
若不设置此项，则认为该设置项可以接受任何值，请在确保设置项的值在可控范围内（例如bool类型）时进行这类简化

### *inputs 多项输入框

在渲染设置项时，同时渲染的多个输入框，用于输入设置项需要的内容。
输入框的数量由inputs的元素项数决定，统一接受字符串内容
在渲染的输入框前，还会放置inputs中的string元素，例：

~~~
text : "这个属性需要："：
inputs : ["输入A"，"输入B"]
~~~

实际渲染结果为：

~~~
这个属性需要：输入A[  输入框   ] 输入B[  输入框  ]
~~~

### *choice 选项

可以直接在该属性内定义格式为{value:string,text:string}的对象数组，若改选项为空，则会使用status对象内部的choice属性

## 设置项类型表

不同的属性项有不同的类型，这个类型决定了该属性项的显示方式，同时此表也列出了在该类型下可用的参数，这些参数会在check中被使用

| type   | value类型 | check参数类型 | 介绍                                                         |
| ------ | --------- | ------------- | ------------------------------------------------------------ |
| turnOn | bool      | bool          | 在文本后的一个复选框样式的选项                               |
| input  | string[]  | string[]      | 在文本后的n个输入框，具体内容参见上表inputs键，参数则是这些输入框当中依次输入的值的数组 |
| choose | string[]  | string[]      | 在文本后显示一个选择栏，选项内容参见上表的choice键。其中value和check参数分别是默认选中，和已选中的选项的{value，text}值的数组。 |



## 属性设置项内容

标题前半部分为设置项的value，后半部分为text

### hoverBox 聚焦显示输入框

type类型：turnOn  
值类型-默认值：bool : false  
条件：none  

当该属性值被点击，进行修改时，是否显示时聚焦输入框

### exitenceBox 事物包围框

type类型：input2  
值类型-默认值：string[] : ["[" , "]"]  
条件：none  

在该属性值中包含事物时，这个事物在显示时，其左右两侧的边框，数组的第一个元素为左侧边框，第二个元素为右侧边框，默认由[]包裹
例如：

~~~
"aaabbb[", "]cccddd"
~~~

~~~
aaabbb[小明]cccddd和aaabbb[小王]cccddd是好朋友！
~~~

### exitenceSeparator 事物间隔

type类型：input1  
值类型与默认值：sting:","  
条件：valueType为exitence，并且showType为vertical

事物对象在横向连续显示时，相互之间的间隙内容。  
例如：

~~~
"，abc"
~~~

~~~
参与人：[小明]，abc[小王]，abc[小李]
~~~

### 单位 unit

|                   |        |                             |                     |                                                              |
| ----------------- | ------ | --------------------------- | ------------------- | ------------------------------------------------------------ |
|                   |        |                             |                     |                                                              |
|                   |        |                             |                     |                                                              |
|                   |        |                             |                     |                                                              |
|                   |        |                             |                     |                                                              |
| possibleChoiceNum | input2 | {max:num:1,<br />min:num:1} | valueType == choose | 可选数量，包括最大数量和最小数量，其中num可以为max表示总选项数 |
|                   |        |                             |                     |                                                              |

