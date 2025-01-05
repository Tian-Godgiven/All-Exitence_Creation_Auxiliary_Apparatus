import { toRaw } from "vue";
import { nowAllArticles } from "../all-articles/allArticles";
import { nowAllExitence } from "../all-exitence/allExitence";
import { writeFileAtPath } from "../fileSysytem";
import { nowProjectPath, projectInputSuggestionListData } from "./projectData";
import { saveGlobalInputSuggestion } from "../app/globalInputSuggestion";

export async function saveAll(){
    //保存项目
    const tmp = await saveProject()
    //保存全局输入建议
    await saveGlobalInputSuggestion()
    if(tmp){
        console.log("已完成保存")
    }
}

//每隔10秒保存一次当前项目
export function startAutoSave(){
    // setInterval(async ()=>{
    //     saveAll()
    // },10000)
}

//软件退出前保存一次当前项目
export async function startQuitSave(){
    
}


//保存当前项目中的数据
async function saveProject(){
    if(!nowProjectPath.value){
        return false
    }
    try{
        //当前项目的路径
        const projectPath = "projects/"+ nowProjectPath.value
        //当前万物
        const allExitence = nowAllExitence
        await writeFileAtPath(projectPath,"all-exitence.json",JSON.stringify(toRaw(allExitence)))
        //文章
        const allArticles = nowAllArticles
        await writeFileAtPath(projectPath,"all-articles.json",JSON.stringify(toRaw(allArticles)))
        //保存项目data
        await saveProjectData(projectPath)
        //项目设置
    }
    catch(err){
        alert(err)
        console.error(err)
        return false
    }


    return true
    
}

//自动保存项目数据
async function saveProjectData(projectPath:string){
    const dataPath = projectPath+"/data"
    //1.保存项目输入提示表
    const list = toRaw(projectInputSuggestionListData)
    await writeFileAtPath(dataPath,"inputSuggestionList.json",list)
}