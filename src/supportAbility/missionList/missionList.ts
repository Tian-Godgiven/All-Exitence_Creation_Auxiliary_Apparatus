import { addToRightPage } from "@/hooks/pages/rightPage"
import { createDirByPath, createFileToPath, readFileFromPath, writeFileAtPath } from "@/hooks/fileSysytem"
import { showPopUp } from "@/hooks/pages/popUp"
import { reactive, ref, shallowRef } from "vue"
import MissionList from "./popUp/missionList.vue"
import { showAlert } from "@/hooks/alert"
import { showQuickInfo } from "@/api/showQuickInfo"
import ShowMissionAlert from "./popUp/showMissionAlert.vue"

export type Mission = { 
    title:string,//任务标题
    inner:any,//任务内容
    startTime:number, //任务开始时间
    planTime:number | null, //预计结束时间
    endTime:number, //任务结束时间
    timeLeft:number | null, //距离任务结束的剩余时间，若为null则表示无限时
    repeatable:boolean, //是否可重复
    repeatTime:number, //已重复次数
    state: MissionState, //当前状态:正在执行，已完成，失败
    tags: string[], //标签
    __key: string,
}
export type MissionState = "doing" | "completed" | "failed"

//初始化任务列表系统
export const nowMissionList = reactive<{
    doing:Mission[],
    completed:Mission[],
    failed:Mission[]
}>({
    doing:[{
        "title":"测试任务",
        "inner":"内容",
        "startTime":0,
        "endTime":0,
        "planTime":null,
        "timeLeft":null,
        "tags":["标签1","标签2"],
        "repeatable":false,
        "repeatTime":0,
        "__key":"001",
        "state":"doing",
    }],
    completed:[],
    failed:[]
})
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
        await createFileToPath(path,"missionList.JSON",JSON.stringify(nowMissionList))
    }

    //打开计时器
    startMissionListTimeout()

    //向右侧页面添加按键
    addToRightPage({
        name:"任务列表",
        click:()=>showMissionListPopUp(),
        iconName:"missionList"
    })
}

//保存任务列表
export async function saveMissionList(){
    await writeFileAtPath("supportAbility/missionList","missionList.json",nowMissionList)
}

//显示任务列表弹窗
export function showMissionListPopUp(){
    showPopUp({
        "vue":shallowRef(MissionList),
        buttons:null,
        mask:true
    })
}

//显示编辑任务面板
export const ifShowEditMission = ref(false)
export const editTarget = ref<Mission|null>(null)
export let editMissionReturn:(newMission:Mission|false)=>void = ()=>{}
export function showEditMission(mission:Mission|null,returnValue:(newMission:Mission|false)=>void){
    showMissionListPopUp()
    //显示编辑任务页面
    ifShowEditMission.value = true 
    //传入mission
    editTarget.value = mission
    //传入回调函数
    editMissionReturn = returnValue
}

//切换管理模式
export const manageMode = ref(false)
export function switchManageMode(bool?:boolean){
    if(bool != undefined){
        manageMode.value = bool
    }
    else{
        manageMode.value = !manageMode.value
    }
}

//编辑并创建新任务
export function createNewMission(){
    showEditMission(null,(newMission)=>{
        if(newMission){
            //改变状态为doing
            changeMissionState(newMission,"doing")
        }
    })
}

//删除任务
export function deleteMission(mission:Mission){
    showAlert({
        'info':`删除此任务？`,
        confirm:()=>{
            const index = nowMissionList[mission.state].indexOf(mission)
            nowMissionList[mission.state].splice(index,1)
        }
    })
}

//修改任务状态
function changeMissionState(mission:Mission,newState:MissionState){
    //从原本的数组中移除
    const oldArr = nowMissionList[mission.state]
    const index = oldArr.indexOf(mission)
    //新任务不需要移除
    if(index != -1){
        oldArr.splice(index,1)
    }
    //添加到新数组的开头
    nowMissionList[newState].unshift(mission)
    //修改状态
    mission.state = newState
    //如果状态为结束，则设定其结束时间
    const now = Date.now()
    if(newState == "failed" || newState == "completed"){
        mission.endTime = now
    }
    //若状态为开始，则设定其开始时间和预计结束时间
    else if(newState == "doing"){
        const oldStartTime = mission.startTime
        mission.startTime = now
        //如果预计时间不为0，则还会重新安排任务时间
        if(mission.planTime){
            if(oldStartTime == 0){
                mission.timeLeft = mission.planTime - now
            }
            else{
                mission.timeLeft = mission.planTime - oldStartTime
            }
            mission.planTime = now + mission.timeLeft
        }
    }
}

//修改任务内容，成功修改时，修改任务的state
export function editMission(mission:Mission){
    showEditMission(mission,(newMission)=>{
        if(newMission){
            Object.assign(mission,newMission)
        }
    })

}

//结算任务
export function finishMission(mission:Mission){
    //该任务是否到时了
    let ifMissionOnTime = false 
    if(mission.timeLeft && mission.timeLeft <=0){
        ifMissionOnTime = true
    }

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
            "buttonName":`${ifMissionOnTime?"延长十分钟……！":"还没有"}`,
            func:()=>{
                if(ifMissionOnTime && mission.timeLeft){
                    mission.timeLeft += 60000
                    showQuickInfo("加油哦！")
                }
            }
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
    changeMissionState(mission,"completed")
}

//任务失败
export async function failMission(mission:Mission){
    //再次挑战？
    const result = await tryAgain(mission)
    console.log(result)
    if(!result){
        changeMissionState(mission,"failed")
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
                //修改任务状态，重复次数+1
                changeMissionState(mission,"doing")
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

//再次开始任务
export function tryAgain(mission:Mission){
    return new Promise((resolve)=>{
        showAlert({
            info:"再次挑战？",
            confirm:null,
            buttons:[{
                "buttonName":"再来！",
                func:()=>{
                    changeMissionState(mission,"doing")
                    //编辑任务内容,成功时修改为doing
                    editMission(mission)
                    resolve(true)
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

//任务定时器
export function startMissionListTimeout(){
    //每分钟更新一次
    setInterval(()=>{
        console.log("更新了")
        //更新列表中所有正在进行的任务的时间
        nowMissionList.doing.forEach((mission)=>{
            updateMissionTime(mission)
        })
    },60000)
}

//更新任务的剩余时间，若剩余时间较少则进行提示，为0则进行结算
function updateMissionTime(mission:Mission){
    if(mission.timeLeft && mission.timeLeft>0){
        //更新剩余时间，将其减少1分钟=6000，不小于0
        if(mission.timeLeft < 60000){
            mission.timeLeft = 0
        }
        else{
            mission.timeLeft -= 60000
        }
        //少于10分钟
        const missionTitle = mission.title==""?"未命名任务":mission.title
        if(mission.timeLeft < 660000 && mission.timeLeft > 600000){
            showAlert({
                info:`距离任务${missionTitle}结束还有10分钟`,
                confirm:null,
                buttons:[
                    {"buttonName":"查看任务",func:()=>{showMissionAlert(mission)}},
                    {"buttonName":"我知道了",func:()=>{}}
                ]
            })
        }
        //小于0时显示结算弹窗
        else if(mission.timeLeft <=0 ){
            showMissionAlert(mission,"任务时间到，请结算任务！")
        }
    }
}

//显示指定任务信息的弹窗
function showMissionAlert(mission:Mission,info?:string){
    showPopUp({
        vue:shallowRef(ShowMissionAlert),
        buttons:null,
        mask:true,
        props:{
            mission,
            info
        },
        size:{
            height:"auto"
        }
    })
}