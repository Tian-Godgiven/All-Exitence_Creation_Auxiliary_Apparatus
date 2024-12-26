import { reactive, ref, shallowReactive } from "vue"
import { readFileFromPath } from "../fileSysytem"
import { changeAppSetting } from "../appSetting"
import { changeNowAllExitence } from "../all-exitence/allExitence"
import { changeNowAllArticles } from "../all-articles/allArticles"

//当前项目的文件夹路径
export const nowProjectPath = ref("")
//项目中的输入提示表
export const projectInputSuggestionList = shallowReactive([])

//移动到指定项目
export async function moveToProject(projectPath:string){
    //要求该项目存在
    nowProjectPath.value = projectPath
    //同步项目数据
    await syncProject(projectPath)
    //记录当前项目为上一次打开的项目
    changeAppSetting("lastProjectPath",projectPath)
}

//同步到当前项目中
async function syncProject(projectPath:string){
    try{
        projectPath = `projects/${projectPath}`
        const dataPath = `${projectPath}/data`

        //修改当前的项目设置
        //1.项目输入提示表
        const inputSuggestionList = await readFileFromPath(dataPath,"inputSuggestionList.json")
        Object.assign(projectInputSuggestionList,inputSuggestionList)

        //修改当前的万物和文章
        const nowProjectInfo = await readFileFromPath(projectPath,"projectInfo.json")
        let nowAllExitence = await readFileFromPath(projectPath,"all-exitence.json")
        changeNowAllExitence(nowAllExitence)
        const nowAllArticles = await readFileFromPath(projectPath,"all-articles.json")
        changeNowAllArticles(nowAllArticles)
    }catch(err){
        console.log(err)
        return false
    }
    
}

