export type Icon = keyof typeof iconList;

export const iconList:Record<string,string>= {
    "close":"close",//叉号
    "deleteX":"deleteX",//圆中的空心叉号
    "check":"check",//勾号
    "add":"plus",//加号
    "addNew":"addCube",//方块包围的加号
    "sub":"sub",//减号
    "delete":"delete-bin",//删除，垃圾桶
    //上下左右箭头
    "leftArrow":"arrowLeft",
    "rightArrow":"arrowRight",
    "upArrow":"arrowUp",
    "downArrow":"arrowDown",
    "handSave":"saveFile",//保存文件
    "showLeft":"showLeft",//显示左侧页面
    "showRight":"showRight",//显示右侧页面
    "rightUp":"rightUp",//右侧页面抬升
    "backMain":"backMain",//返回主页面
    "closePopUp":"closePopUp",//关闭弹窗,圆包围的x号

    "time":"time",//时钟
    "timer":"timer",//计时器
    "repeat":"repeat",//无限重复
    "eyeShow":"eyeShow",//眼睛显示
    "eyeHide":"eyeHide",//眼睛隐藏
    "showFloat":"showFloat",//显示悬浮窗
    "hideFloat":"hideFloat",//隐藏悬浮窗
    "manage":"manageMode",//管理模式
    "collapse":"collapse",//缩小箭头
    "shrink":"shrink",//缩小窗口
    "search":"search",//搜索

    "expand":"expandDown",//向下箭头，表示展开中
    "unexpand":"expandRight",//向→箭头，表示收起中
    "allFold":"allFold",//折叠全部

    "edit":"edit",//编辑
    "setting":"setting",//设置
    "showOnMain":"showOnMain",//在主页面显示

    "addContainer":"addContainer",//添加分组or章节
    "addContent":"addContent",//添加事物or文章
    "dragHandle":"dragHandle",//拖动手柄

    "missionList":"missionList",//任务列表
    "calendar":"calendar",//日历
    "quickDraft":"quickDraft",//暂记版
    "timeLine":"timeLine",//时间线
    "customTime":"customTime",//自定义时间
    "tagLibrary":"tagLibrary",//标签库

    "article":"article",//文章
    "exitence":"exitence",//事物

    "more":"more",//显示更多
    
}


