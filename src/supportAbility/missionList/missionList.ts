import { addToRightPage } from "@/data/list/rightAbilityList"
import { createDirByPath, createFileToPath, readFileFromPath } from "@/hooks/fileSysytem"
import { showPopUp } from "@/hooks/pages/popUp"
import { reactive, shallowRef } from "vue"
import MissionList from "./popUp/missionList.vue"
import CreateMission from "./popUp/createMission.vue"
import { showAlert } from "@/hooks/alert"
import { showQuickInfo } from "@/api/showQuickInfo"

export type Mission = { 
    title:string,//任务标题
    inner:any,//任务内容
    startTime:number,
    timeLimit:number | null, //限时时间，若为null则表示不限时
    repeatable:boolean, //是否可重复
    repeatTime:number, //已重复次数
    state: "doing"|"completed"|"failed", //当前状态:正在执行，已完成，失败
    tags: string[], //标签
    __key: string,
}

//初始化任务列表系统
export const nowMissionList = reactive<Mission[]>([{
    "title":"测试任务",
    "inner":"内容",
    "startTime":0,
    "tags":["标签1","标签2"],
    "repeatable":false,
    "repeatTime":0,
    "__key":"001",
    "state":"doing",
    "timeLimit":null,
}])
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
        vue:shallowRef(CreateMission),
        mask:true,
        buttons:[],
        props:{
            mission:null,
        },
        returnValue(newMission:Mission){
            //将其添加到任务列表中
            newMission.startTime = Date.now()
            nowMissionList.push(newMission)
        }
    })
}

//删除任务
export function deleteMission(mission:Mission){
    showAlert({
        'info':`删除此任务？`,
        confirm:()=>{
            const index = nowMissionList.indexOf(mission)
            nowMissionList.splice(index,1)
        }
    })
}

//结算任务
export function finishMission(mission:Mission){
    showAlert({
        "info":"已完成该任务？",
        "confirm":null,
        "buttons":[{
            "buttonName":"已完成！",
            func:()=>{
                //再来一次？
                if(mission.repeatable){
                    repeatMission(mission)
                }
                else{
                    completeMission(mission)
                }
            }
        },{
            "buttonName":"还没有！",
            func:()=>{}
        },{
            "buttonName":"失败了……！",
            func:()=>{
                failMission(mission)
            }
        }]
    })
    
}

//完成任务
export function completeMission(mission:Mission){
    //修改任务状态，重复次数+1
    showQuickInfo("好耶————！")
    if(mission.repeatable){
        mission.repeatTime +=1
    }
    mission.state = "completed"
    
}

//任务失败
export async function failMission(mission:Mission){
    //再次挑战？
    const result = await tryAgain(mission)
    if(!result){
        mission.state = "failed"
    }
}

//重复任务
export function repeatMission(mission:Mission){
    showAlert({
        info:"再来一次？",
        confirm:null,
        buttons:[{
            'buttonName':"好！",
            func:()=>{
                //修改任务状态，重复次数+1，确认时间
                mission.state = "doing";
                mission.repeatTime += 1;
                //编辑任务内容
                editMission(mission)
            }
        },{
            'buttonName':'不了！',
            func:()=>{showQuickInfo(
                "可以在已完成任务中再来一次哦！"
            )}
        }]
    })
}

//重新开始
export function tryAgain(mission:Mission){
    return new Promise((resolve,reject)=>{
        showAlert({
            info:"再次挑战？",
            confirm:null,
            buttons:[{
                "buttonName":"再来！",
                func:()=>{
                    resolve(true)
                    mission.state = "doing"
                    //编辑任务内容
                    editMission(mission)
                }
            },{
                "buttonName":"算了……！",
                func:()=>{
                    resolve(false)
                    showQuickInfo("没关系的哦————！")
                }
            }]
        })
    })
}

//编辑任务
export function editMission(mission:Mission){

}