import { reactive, ref, shallowReactive } from "vue"
import { readFileFromPath,writeFileAtPath } from "../fileSysytem"
import { changeNowAllExitence } from "../all-exitence/allExitence"
import { changeNowAllArticles } from "../all-articles/allArticles"

//当前项目的文件夹路径
export const nowProjectPath = ref<string|null>(null)
//当前项目的信息
export const nowProjectInfo = reactive<any>({name:"",lastTarget:null})
//项目中的输入提示表
export const projectInputSuggestionList = shallowReactive([])

//同步当前项目的数据
export async function syncProject(projectPath:string){
    try{
        //修改当前项目路径
        nowProjectPath.value = projectPath
        //真实路径
        projectPath = `projects/${projectPath}`
        const dataPath = `${projectPath}/data`

        //修改当前的项目设置
        //1.项目输入提示表
        const inputSuggestionList = await readFileFromPath(dataPath,"inputSuggestionList.json")
        Object.assign(projectInputSuggestionList,inputSuggestionList)

        //修改当前的项目信息
        const tmp = await readFileFromPath(projectPath,"projectInfo.json")
        Object.assign(nowProjectInfo,tmp)

        //修改当前的万物和文章
        let nowAllExitence = await readFileFromPath(projectPath,"all-exitence.json")
        changeNowAllExitence(nowAllExitence)
        const nowAllArticles = await readFileFromPath(projectPath,"all-articles.json")
        changeNowAllArticles(nowAllArticles)
        return true
    }
    catch(err){
        //找不到指定路径，说明该项目已经不存在
        return false
    }
    
}

//实时保存当前项目信息，不参与自动保存
export async function saveProjectInfo(){
    //将项目信息写入
    await writeFileAtPath(`projects/${nowProjectInfo.pathName}`,"projectInfo.json",nowProjectInfo)
}
