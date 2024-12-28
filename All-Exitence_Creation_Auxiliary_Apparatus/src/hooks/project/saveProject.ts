import { toRaw } from "vue";
import { nowAllArticles } from "../all-articles/allArticles";
import { nowAllExitence } from "../all-exitence/allExitence";
import { writeFileAtPath } from "../fileSysytem";
import { nowProjectPath } from "./projectData";

//每隔10秒保存一次当前项目
export function startAutoSave(){
    setInterval(async ()=>{
        const tmp = await saveProject()
        if(tmp){
            console.log("已自动保存")
        }
    },10000)
}

//软件退出前保存一次当前项目
export async function startQuitSave(){
    
}


//保存当前项目中的数据
async function saveProject(){
    if(!nowProjectPath.value){
        return false
    }
    //当前项目的路径
    const projectPath = "projects/"+ nowProjectPath.value
    //当前万物
    const allExitence = nowAllExitence
    await writeFileAtPath(projectPath,"all-exitence.json",JSON.stringify(toRaw(allExitence)))
    //文章
    const allArticles = nowAllArticles
    await writeFileAtPath(projectPath,"all-articles.json",JSON.stringify(toRaw(allArticles)))
    //项目设置

    return true
    
}