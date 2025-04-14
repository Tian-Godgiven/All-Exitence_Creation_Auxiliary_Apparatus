import { reactive, ref } from "vue"
import { readFileFromPath,writeFileAtPath } from "../fileSysytem"
import { changeNowAllExitence } from "../all-exitence/allExitence"
import { changeNowAllArticles } from "../all-articles/allArticles"
import { Type } from "@/class/Type"
import { supportAbilityList } from "@/static/list/supportAbilityList"
import { ProjectInfo } from "./project"

//当前项目的文件夹路径，注意其只包含其文件夹
export const nowProjectPath = ref<string|null>(null)
//当前项目的信息
export const nowProjectInfo = reactive<ProjectInfo>(
    {name:"",lastTarget:null,pathName:"",time:0}
)
 
//同步当前项目的数据
export async function syncProject(projectPath:string){
    try{
        //修改当前项目路径
        nowProjectPath.value = projectPath
        //项目路径
        projectPath = `projects/${projectPath}`

        //同步项目设置
        

        //修改当前的项目信息
        const tmp = await readFileFromPath(projectPath,"projectInfo.json")
        Object.assign(nowProjectInfo,tmp)

        //修改当前的万物和文章
        let nowAllExitence = await readFileFromPath(projectPath,"all-exitence.json") as {types:Type[]}
        changeNowAllExitence(nowAllExitence)
        const nowAllArticles = await readFileFromPath(projectPath,"all-articles.json")
        changeNowAllArticles(nowAllArticles)

        //同步辅助功能
        supportAbilityList.forEach(ability=>{
            if(ability.syncProject){
                ability.syncProject(projectPath)
            }
        })

        return true
    }
    catch(err){
        console.error(err)
        //找不到指定路径，说明该项目已经不存在
        return false
    }
    
}

//实时保存当前项目信息，不参与自动保存
export async function saveProjectInfo(){
    //将项目信息写入
    await writeFileAtPath(`projects/${nowProjectInfo.pathName}`,"projectInfo.json",nowProjectInfo)
}
