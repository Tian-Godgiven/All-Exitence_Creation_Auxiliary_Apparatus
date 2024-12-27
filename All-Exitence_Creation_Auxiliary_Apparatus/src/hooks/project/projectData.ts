import { reactive, ref, shallowReactive } from "vue"
import { readFileFromPath } from "../fileSysytem"
import { changeNowAllExitence } from "../all-exitence/allExitence"
import { changeNowAllArticles } from "../all-articles/allArticles"

//当前项目的文件夹路径
export const nowProjectPath = ref("")
//当前项目的信息
export const nowProjectInfo = reactive({name:""})
//项目中的输入提示表
export const projectInputSuggestionList = shallowReactive([])

//同步当前项目的数据
export async function syncProject(projectPath:string){
    try{
        //项目路径
        nowProjectPath.value = projectPath

        projectPath = `projects/${projectPath}`
        const dataPath = `${projectPath}/data`

        //修改当前的项目设置
        //1.项目输入提示表
        const inputSuggestionList = await readFileFromPath(dataPath,"inputSuggestionList.json")
        Object.assign(projectInputSuggestionList,inputSuggestionList)

        //修改当前的万物和文章
        const tmp = await readFileFromPath(projectPath,"projectInfo.json")
        Object.assign(nowProjectInfo,tmp)
        let nowAllExitence = await readFileFromPath(projectPath,"all-exitence.json")
        changeNowAllExitence(nowAllExitence)
        const nowAllArticles = await readFileFromPath(projectPath,"all-articles.json")
        changeNowAllArticles(nowAllArticles)
    }catch(err){
        console.error(err)
        return false
    }
    
}

