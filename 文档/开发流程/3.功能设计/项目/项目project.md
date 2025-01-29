[toc]

## 定义

项目是用户操作的基础，所有的用户数据几乎都存在于项目中

## 方法/操作

### 创建项目

创建一个优先与项目同名的项目文件夹，内容参见下方

### 删除项目

删除对应的项目文件夹

### 重命名项目

更换项目的名称，注意：同时也会修改项目文件夹的名称

## 数据结构

项目本身可以视作一个文件夹，其存储在`@appLocalData/data/projects`当中，项目文件夹的名称优先为项目名称，在重名的情况下会在后方添加数字

项目内包含3个部分：

~~~
/projectName:项目文件夹本身
	/data:集中存放与项目整体有关的数据，内容参见下方
	/all-exitence.json:万物文件，参见万物数据结构
	/all-article.json:文本文件，参见文章数据结构
	/projectInfo.json:项目信息文件,内容参见下方
~~~

### 项目信息文件 projectInfo.json

保存了项目有关信息的json文件

~~~
pathName:string //项目文件夹的路径名称
name:string //项目名称
time:date //项目创建时间
info:string //项目简介
lastTarget:{from,target,type} //记录该项目在切换前显示的目标，若为空则会显示第一个事物对象
~~~

### 项目数据 data

~~~
/data
	/setting.json : 与该项目关联设置信息,辅助功能的设置也包含在其中
	/inputSuggestionList.json : 与该项目关联的输入提示表
	/quickDraft.json : 与该项目关联的暂记版对象，参见辅助功能
~~~

