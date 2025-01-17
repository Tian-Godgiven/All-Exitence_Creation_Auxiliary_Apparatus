import { addToRightPage } from "@/data/list/rightAbilityList"
import { createDirByPath, createFileToPath, readFileFromPath } from "@/hooks/fileSysytem"
import { showPopUp } from "@/hooks/pages/popUp"
import { nanoid } from "nanoid"
import { reactive, shallowRef } from "vue"
import MissionList from "./missionList.vue"
import EditMission from "./editMission.vue"

export class Mission{
    constructor(
        public title:string,//任务标题
	    public inner:any,//任务内容
	    public timeLimit:Date | null, //限时时间，若为null则表示不限时
	    public repeatable:boolean, //是否可重复
	    public repeatTime:number, //已重复次数
	    public state: "doing"|"completed"|"failed", //当前状态:正在执行，已完成，失败
	    public tags: string[], //标签
        public __key: string = nanoid() //key值
    ){}
}

//初始化任务列表系统
export const nowMissionList = reactive<Mission[]>([])
export async function initMissionList(){
    const path = "supportAbility/missionList"
    const missionList = await readFileFromPath(path,"missionList.JSON")
    //读取任务列表文件
    if(missionList){
        Object.assign(nowMissionList,missionList)
    }
    //若不存在则创建空任务列表
    else{
        await createDirByPath("supportAbility","missionList")
        await createFileToPath(path,"missionList.JSON",JSON.stringify([]))
    }

    //向右侧页面添加按键
    addToRightPage({
        name:"任务列表",
        click:()=>showMissionListPopUp(),
        iconName:"missionList"
    })
}

//显示任务列表弹窗
export function showMissionListPopUp(){
    showPopUp({
        "vue":shallowRef(MissionList),
        buttons:null,
        mask:true
    })
}

//创建任务
export function createNewMission(){
    //弹出创建新任务弹窗
    showPopUp({
        vue:shallowRef(EditMission),
        mask:true,
        buttons:[],
        props:{
            mission:null,
        },
        returnValue(newMission:Mission){
            //将其添加到任务列表中
            nowMissionList.push(newMission)
        }
    })
}