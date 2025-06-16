import { showAlert } from "../alert";
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
    //待完成：测试阶段未开启自动保存
    // setInterval(async ()=>{
    //     saveAll()
    // },10000)
}

//软件退出前保存一次当前项目
export async function startQuitSave(){
    
}

// 只会在tauri刷新时调用
// window.onbeforeunload = function() {
//     showAlert({
//         info:"关闭吗",
//         "confirm":()=>{
//             console.log("确认关闭")
//         }
//     })
//     return false;
// }; 

