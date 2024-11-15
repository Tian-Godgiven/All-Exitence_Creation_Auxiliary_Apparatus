#### showType属性值的显示方式

| showType | 介绍                                                         | 支持的valueType                                |
| -------- | ------------------------------------------------------------ | ---------------------------------------------- |
| none     | 无样式，属性值直接显示在那里。<br />date, multi , status默认为该样式 | date(默认),multi(默认),status(默认),string,num |
| downLine | 在属性值下方存在的一根线条。<br />string , num , exitence默认为该样式 | string(默认) ,num(默认), date, multi, status   |
| inputBox | 属性值被包裹在输入框内，                                     | string,num,date,multi                          |
| range    | 通过拖动改变数字大小                                         | range(默认)，num(要求设定最大值，最小值和步长) |
| vertical | 将多个属性值横向排列，彼此留有间隙                           | exitence(默认)                                 |
| horizen  | 将多个属性值竖向排列，彼此留有间隙                           | exitence                                       |
| choiceV  | 将可选值的选项横向排列                                       | choose(默认)                                   |
| choiceH  | 将可选值的选项竖向排列                                       | choose                                         |
| select   | 点击后弹出的下拉选项框，最高高度为500rpx，不会超过弹出页面底部 | choose                                         |
| swich    | 切换时左右滑动的开关                                         | bool(默认)，单选且选项数量为2的choose          |
| turnOn   | 切换时选中或失效的开关                                       | bool，单选且选项数量为2的choose                |
