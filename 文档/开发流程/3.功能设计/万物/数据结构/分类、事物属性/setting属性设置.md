[toc]

# 属性设置 setting

一个对象，对象内容可能包括如下键值对，请注意新增的设置不得与其重名：

| 键        | 值                 | valueType       | 含义                         |
| --------- | ------------------ | --------------- | ---------------------------- |
| chooseNum | num[min,max]       | choose / select | 该属性的可选数量的最大最小值 |
| choices   | string[]           | choose / select | 选项文本数组                 |
| range     | num[min,max,step]  | range           | 范围数组                     |
| switch    | string[left,right] | swicth          | 分别是左侧和右侧的文本       |
| radio     | sting              | radio           | 显示在灯开关左侧的文本       |



# 属性值设置项 settingOption

`data/list/setStatusOptionsList.ts`对属性值进行设置的各个设置项

## 设置项表结构

设置项在表中的结构：

| key          | value              | 条件         | 介绍                                                         |
| ------------ | ------------------ | ------------ | ------------------------------------------------------------ |
| name         | string             | 必须         | 该设置项的关键字                                             |
| value        | null \|\| any      |              | 该设置项的值，存在时其值为默认值，具体类型和值由type决定，参见下方[设置项类型表] |
| text         | string             | 必须         | 该设置项的介绍文本                                           |
| type         | string             | 必须         | 该设置项的类型，参见下方[设置项类型表]                       |
| select       | function:bool      |              | 判断是否渲染该设置项的函数                                   |
| confirmValue | function:bool      |              | 判断设置项获取的值是否符合要求的函数                         |
| *inputs      | string[]           | type==input  | 会根据数组内元素个数生成多个string输入框，每个输入框前面还会有一段对应元素内容的文本 |
| *choices     | 选项数组或function | type==choose | 用于组成选项，这些选项需要可以直接被定义在此处，也可以通过方法来获得status中的choice值 |

### `select:function(status)=>bool `函数

函数将传入该status属性对象作为参数  
若需要渲染该设置项，则在对应的条件后返回true，否则均不会渲染该设置项  
若不设置此项，则该设置项在任何条件下**均会渲染**

### `confirmValue:function(value)` 函数

在用户点击确定时，调用该函数，若返回值为true，则判断该设置正确  
参数统一为value，但其中的值和结构由设置项type决定，参见下方[设置项类型表]  
若不设置此项，则认为该设置项可以接受任何值，请在确保设置项的值在可控范围内（例如bool类型）时进行这类简化

### *inputs 多项输入框

在渲染设置项时，同时渲染的多个输入框，用于输入设置项需要的内容。
输入框的数量由inputs的元素项数决定，统一接受字符串内容
在渲染的输入框前，还会放置inputs中的string元素，例：

~~~
setting:{
	text : "这个属性需要："：
	inputs : ["输入A"，"输入B"]
}
~~~

实际渲染结果为：

~~~
这个属性需要：输入A[  输入框   ]
			输入B[  输入框   ]
~~~

### *choices 选项

可以直接在该属性内定义格式为`{value:string,text:string}`的对象数组，若该选项为空，则会使用`status[setting][choices]`属性作为选项

## 设置项类型表

不同的属性项有不同的类型，这个类型决定了该属性项的显示方式，同时此表也列出了在该类型下可用的参数，这些参数会在confirmValue函数中被使用

| type       | value类型 | confirmValue的参数类型 | 介绍                                                         |
| ---------- | --------- | ---------------------- | ------------------------------------------------------------ |
| checkBox   | bool      | bool                   | 在文本text后显示一个复选框的选项                             |
| input      | string    | string                 | 在文本后的单个输入框                                         |
| multiInput | string[]  | string[]               | 在文本后的n个输入框，具体内容参见上表inputs键，参数则是这些输入框当中依次输入的值的数组 |
| choose     | string    | string                 | 在文本后显示一个选择栏，选项内容参见上表的choices键。其中value和confirmValue的参数分别是默认选中，和已选中的选项的value |



## 属性设置项内容

| name text                        | type                             | value       | select条件            | 内容                                                 |
| -------------------------------- | -------------------------------- | ----------- | --------------------- | ---------------------------------------------------- |
| hoverBox 聚焦显示输入框          | checkBox                         | false       | valueType == inputBox | 当该属性值被点击，进行修改时，是否显示时聚焦输入框   |
| exitenceBox 事物包围框           | input2:["事物左侧:","事物右侧:"] | ["[" , "]"] | 无                    | 该属性值中出现事物对象时，出现在事物对象两侧的内容   |
| unit 单位                        | input1                           | null        | 无                    | 出现在属性值末尾的单位内容                           |
| chooseByRadio 使用灯开关表达选项 | checkBox                         | false       | valueType == choose   | choose类型的值使用灯开关在选项前方，而非使用checkBox |
| chooseDirection 选项排列方向     | choose:["竖向","横向"]           | "横向"      | valueType == choose   | 选项按照竖向or横向排列                               |
| insteadOfName 取代属性名         | input1                           | null        | 无                    | 输入内容会取代该属性名占位显示                       |
|                                  |                                  |             |                       |                                                      |
