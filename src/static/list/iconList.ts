export type Icon = keyof typeof iconList;

export const iconList:Record<string,string>= {
    "close":"",//叉号
    "check":"check",//勾号
    "add":"plus",//加号
    "sub":"sub",//减号
    "delete":"delete-bin",//删除，垃圾桶
    //上下左右箭头
    "leftArrow":"arrowLeft",
    "rightArrow":"arrowRight",
    "upArrow":"arrowUp",
    "downArrow":"arrowDown",

    "missionList":"missionList",//任务列表
    "canlendar":"calendar",//日历
    "handSave":"saveFile",//保存文件
    "showLeft":"showLeft",//显示左侧页面
    "showRight":"showRight",//显示右侧页面
    "rightUp":"rightUp",//右侧页面抬升
    "quickDraft":"quickDraft",//暂记版
    "timeLine":"",//时间线←
    "backMain":"backMain",//返回主页面

    "time":"time",
    "repeat":"repeat",
    "eyeShow":"eyeShow",//眼睛显示
    "eyeHide":"eyeHide",//眼睛隐藏
    "showFloat":"showFloat",//显示悬浮窗
    "hideFloat":"hideFloat",//隐藏悬浮窗
    "manage":"manageMode",//管理模式
    "collapse":"collapse",//缩小箭头
    "shrink":"shrink",//缩小窗口
    
}


