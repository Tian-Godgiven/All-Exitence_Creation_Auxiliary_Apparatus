[toc]

# 整体架构

## 概述

文本编辑系统基于 `contenteditable` + 手动 DOM 操作实现，没有使用第三方富文本编辑器库。核心特点是在文本中支持嵌入可点击跳转的事物引用（jumpDiv）。

## 数据模型

文章内容存储为自定义的混合数组，非 HTML 也非 Markdown：

```typescript
type TextAreaContent = string | JumpData

// 存储示例：
["今天", "角色A", "\n", "去了", {type:"exitence", text:"王都", target:["typeKey","exitenceKey"]}, "。"]
```

- 纯文本 → `string`
- 换行 → `"\n"`
- 事物引用 → `JumpData` 对象（点击可跳转到事物详情）

## 三层转换

数据在三种表示之间转换，相关函数位于 `hooks/expression/textAreaContent.ts`：

```
文件内容 (TextAreaContent[])         ← JSON 存储
    ↕  translateToFileContent / translateToFrontEndContent
前端 DOM (Text节点 / BR / jumpDiv)   ← 用户看到的
    ↕  translateToTextContent
纯文本 (string)                      ← 搜索、预览使用
```

## 跳转 Div（JumpData）

在文本中嵌入的可点击事物引用，相关文件位于 `supportAbility/inputSuggestion/suggester/jumpDiv.ts`：

- DOM 中表现为 `contenteditable="false"` 的 `<span class="jumpDiv">`
- 通过 `WeakMap<HTMLElement, JumpData>` 将跳转数据绑定到 DOM 元素
- 全局 `document.addEventListener("click")` 捕获点击事件并跳转

## 输入建议

用户在 textArea 打字时实时匹配建议（事物名称、别名等），选中后自动补全为 jumpDiv。

建议来源分两层：
- 全局列表（`globalInputSuggestionList`）：跨项目
- 项目列表（`projectInputSuggestionList`）：项目内事物

匹配支持：事物名称、别名（nickName）、手动自定义关键词（manual）

# 已知问题与风险

## 1. contenteditable 的浏览器兼容性

`contenteditable` 在不同浏览器/Android WebView 版本上行为差异大：
- 换行时不同浏览器可能插入 `<br>`、`<div>` 或 `<p>`
- 中文输入法的 composition 事件处理容易出问题
- 复制粘贴可能带入意外的 HTML 结构

当前 `translateToFileContent` 中有一些兼容处理（判断 BR、Text、HTMLElement），但难以覆盖所有边界情况。**需在多种 Android 设备上充分测试。**

## 2. 光标操作脆弱

`cursorAbility.ts` 手动操作 `Selection` 和 `Range`。部分操作假设 `startContainer` 是文本节点且 offset 是字符偏移，但当光标位于 jumpDiv 旁边时，`startContainer` 可能是元素节点，`startOffset` 是子节点索引。移动端输入法的虚拟键盘进一步增加了不可控性。

## 3. 没有撤销/重做支持

手动 DOM 操作（插入 jumpDiv、删除内容）会破坏浏览器原生的 undo 栈。用户按撤销可能得到意外结果。

## 4. jumpDiv 数据依赖 WeakMap

```typescript
export const divWeakMap: WeakMap<HTMLElement, JumpData> = new WeakMap
```

如果 DOM 元素被浏览器回收（如 `contenteditable` 内部重排），WeakMap 中的数据也会丢失。保存时会通过 `translateToFileContent` 提取数据，但编辑过程中如果 DOM 被意外重建，jumpDiv 数据会断开。

## 5. 全局 click 事件监听无 cleanup

```typescript
// jumpDiv.ts
document.addEventListener("click", (event) => { ... })
```

在模块加载时注册一次，没有对应的移除逻辑。多编辑器实例或组件销毁重建时可能重复注册。

## 6. 编辑中外部修改被忽略

```typescript
function onFocus() { stopWatch() }  // 聚焦时停止监听 content 变化
function onBlur() { startWatch() }   // 失焦时恢复
```

编辑过程中外部对 content 的修改会被丢弃。如果未来有协作编辑或实时同步需求，需要重新设计同步机制。

## 7. 富文本扩展性受限

当前仅支持纯文本 + jumpDiv。如果未来需要更多富文本能力（加粗、斜体、列表、标题等），在 contenteditable 上改造的成本很高。

# 未来方向

如果需要增强编辑能力，可考虑迁移到 **TipTap**（基于 ProseMirror，Vue 生态友好）：
- 可自定义 Node 类型来实现 jumpDiv
- 自带光标管理、撤销/重做
- 协作编辑支持
- 但迁移成本较大，当前阶段如果功能够用可暂不考虑

# 使用

## 属性

prop属性

~~~
placeholder string 占位符,输入内容为空时显示;
inputSupport bool 是否显示输入辅助,为true时会在输入框聚焦时显示输入辅助，点击不具备InputSupport的区域时会隐藏输入辅助栏
inputSuggestionList InputSuggestionList|"project"|"global"|"all"|null 输入补全列表
mode:"string"|"all"|"disabled" 输入模式，string为纯文本，all为富文本（支持jumpDiv），disabled为只读
~~~

~~~
v-model : 双向绑定的内容值，会在输入时更新
~~~

## 事件

### 失焦事件 blur(content)

在输入栏失去焦点时触发  
若此时无内容则会显示placeholder  
参数为输入的当前内容

### 聚焦事件 focus(content)

在输入栏获得焦点时触发   
若此时已经显示placeholder则会清除placeholder并重新聚焦一次

### 输入事件 input(content, newInput)

在输入栏中进行输入时触发  
随后判断是否进行输入补全提示  
第二个参数为当前输入的新内容

## 暴露方法（defineExpose）

- `focusOnEnd()` — 将光标移动到末尾
- `addDom(domHTML)` — 向光标位置插入 DOM 元素
- `addContent(text)` — 向光标位置插入文本
- `deleteContent(length)` — 删除光标前 n 个字符
- `getContentDom(domClass, getRule)` — 获取内容中指定 class 的 DOM 元素

