import { toRaw } from "vue";
import { nowAllArticles } from "../all-articles/allArticles";
import { nowAllExitence } from "../all-exitence/allExitence";
import { writeFileAtPath } from "../fileSysytem";
import { nowProjectPath } from "./projectData";
import { emit, emitTo, listen } from "@tauri-apps/api/event";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { getCurrentWebview } from "@tauri-apps/api/webview";

//每隔10秒保存一次当前项目
export function startAutoSave(){
    setInterval(async ()=>{
        await saveProject()
        console.log("已自动保存")
    },10000)
}

//窗口切换前保存一次当前项目

export async function startQuitSave(){
    //向main发送事件
    await emit("tauri://destroyed")

    const currentWebview = getCurrentWebview()
    console.log("事件开始了的")
    currentWebview.listen("tauri://blur",async()=>{
        console.log("有弹出的")
        // await saveProject()
    })
    currentWebview.listen("tauri://close-requested",async()=>{
        console.log("有关闭的")
        // await saveProject()
    }) 
}






//保存当前项目中的数据
async function saveProject(){
    //当前项目的路径
    const projectPath = "projects/"+ nowProjectPath.value
    //当前万物
    const allExitence = nowAllExitence
    console.log("当前万物：",allExitence)
    await writeFileAtPath(projectPath,"all-exitence.json",JSON.stringify(toRaw(allExitence)))
    //文章
    const allArticles = nowAllArticles
    await writeFileAtPath(projectPath,"all-articles.json",JSON.stringify(toRaw(allArticles)))
    //项目设置
    
}