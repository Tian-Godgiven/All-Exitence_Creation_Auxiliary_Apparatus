import { saveProject } from "../project/project";
import { saveApp } from "./app";

export async function saveAll(){
    //保存项目
    const tmp = await saveProject()
    //保存App
    await saveApp()
    if(tmp){
        console.log("已完成保存")
    }
}

//每隔10秒保存一次当前项目
export function startAutoSave(){
    setInterval(async ()=>{
        saveAll()
    },10000)
}

//软件退出前保存一次当前项目
export async function startQuitSave(){
    
}


