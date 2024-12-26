import { appSetting } from "../appSetting";
import { createDirByPath, createFileToPath } from "../fileSysytem";
import { moveToProject } from "./projectData";

//软件启动时，初始化项目系统
export async function initProject(){
    //打开上一次的项目文件
    const lastProjectPath = appSetting?.lastProjectPath
    //若为空，则创建空项目
    if(!lastProjectPath){
        await createProject("未命名项目")
    }
    //否则移动到上一次打开的项目文件
    else{
        moveToProject(lastProjectPath)
    }
}

//创建一个项目
export async function createProject(name:string){
    //创建项目名称的项目文件夹
    const pathName = await createDirByPath("projects",name)
    const projectPath = `projects/${pathName}`

    //创建项目数据结构
    await createProjectData()
    //创建项目信息，万物，文本初始化文件
    await createFileToPath(projectPath,"projectInfo.json",JSON.stringify(
        {
            name,
            pathName,
            time:Date.now()
        }
    ))
    await createFileToPath(projectPath,"all-Exitence.json",JSON.stringify(
        {
            types:[]
        }
    ))
    await createFileToPath(projectPath,"all-Articles.json",JSON.stringify(
        {
            chapters:[],
            article:[]
        }
    ))

    //移动到当前项目
    moveToProject(pathName)

    //创建数据部分
    async function createProjectData(){
        //创建data文件夹
        await createDirByPath(projectPath,"data")
        const projectDataPath = projectPath + "/data" 
        //创建基础设置
        //1.项目输入建议列表
        await createFileToPath(projectDataPath,"inputSuggestionList.json",JSON.stringify([]))
    }
}

