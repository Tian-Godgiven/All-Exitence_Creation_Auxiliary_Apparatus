import { ref } from "vue";
import { appSetting, changeAppSetting } from "../appSetting";
import { createDirByPath, createFileToPath, deleteAtPath, readDirAsArray, readFileFromPath, renameToAtPath, writeFileAtPath } from "../fileSysytem";
import { showPopUp } from "../pages/popUp";
import { syncProject } from "./projectData";
import { showAlert } from "../alert";
import { hidePage } from "../pages/pageChange";

interface ProjectInfo{
    name:string,
    pathName:string,
    time:Date | number,
    info?:string
}

export const nowProjectList = ref<any>([])
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

    //读取所有的项目列表
    const projectList = await readDirAsArray("data","projects")
    //依次获取项目信息
    nowProjectList.value = await projectList.reduce(async (arr: any[], projectPath: string) => {
        const currentArr = await arr; // 等待上一个循环的 Promise 完成，确保 `arr` 是一个数组
        const projectInfo = await readFileFromPath(`projects/${projectPath}`, "projectInfo.json");
        currentArr.push(projectInfo); // 将新的 `projectInfo` 添加到数组中
        return currentArr; // 返回更新后的数组
    }, Promise.resolve([])); // 初始值为一个 resolved 的空数组
}

//移动到指定项目
export async function moveToProject(projectPath:string){
    //同步项目数据
    await syncProject(projectPath)
    //记录当前项目为上一次打开的项目
    changeAppSetting("lastProjectPath",projectPath)
}

//创建一个项目
export async function createProject(name:string,info:string=""){
    //创建项目名称的项目文件夹
    const pathName = await createDirByPath("projects",name)
    const projectPath = `projects/${pathName}`

    //创建项目数据结构
    await createProjectData()
    //创建项目信息，万物，文本初始化文件
    const projectInfo:ProjectInfo = {
        name,
        pathName,
        info,
        time:Date.now()
    }
    await createFileToPath(projectPath,"projectInfo.json",JSON.stringify(projectInfo))
    await createFileToPath(projectPath,"all-Exitence.json",JSON.stringify(
        {
            types:[]
        }
    ))
    await createFileToPath(projectPath,"all-Articles.json",JSON.stringify(
        {
            chapters:[],
            articles:[]
        }
    ))

    //向项目列表中添加本项目
    nowProjectList.value.push(projectInfo)

    //移动到当前项目
    moveToProject(pathName)
    //隐藏项目页面
    hidePage('project')

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

//通过弹窗输入信息创建一个新项目
export async function createNewProject(){
    //创建弹窗并获得返回值
    showPopUp({
        vueName:"createProject",
        buttons:[],
        mask:true,
        size:{
            height:"auto"
        },
        returnValue:(name:string,info:string)=>{
            createProject(name,info)
        }
    })
}

// 更新一个项目的名称和简介信息，同时也会尝试更新项目的文件夹名称
async function updateProject(projectInfo:ProjectInfo,newName:string,newInfo:string){
    //覆盖原本的信息
    projectInfo.name = newName;
    projectInfo.info = newInfo;
    //尝试使用newName更新项目文件夹的名称
    const newPathName = await renameToAtPath("projects",projectInfo.pathName,newName)
    projectInfo.pathName = newPathName
    //将项目信息写入
    await writeFileAtPath(`projects/${projectInfo.pathName}`,"projectInfo.json",projectInfo)
}

//通过弹窗编辑项目的名称和简介信息
export function editProjectInfo(projectInfo:ProjectInfo){
    showPopUp({
        vueName:"editProject",
        buttons:[],
        mask:false,
        size:{
            height:"auto"
        },
        props:{
            project:projectInfo
        },
        returnValue:async(name,info)=>{
            updateProject(projectInfo,name,info)
        }
    })
}

//删除一个项目
export async function deleteProject(projectInfo:{
    name: string;
    pathName: string;
    [key: string]: any; 
}){
    //提示是否删除指定项目
    showAlert({
        "info":`是否删除项目:${projectInfo.name}\n项目路径：data/projects/${projectInfo.pathName}`,
        "confirm":async()=>{
            //删除指定path的项目
            await deleteAtPath("projects",projectInfo.pathName,true)
            //从当前列表中移除它
            const index = nowProjectList.value.indexOf(projectInfo)
            nowProjectList.value.splice(index,1)
            //如果当前项目就是它，则跳到列表中的下一个项目
            const nextProject = nowProjectList.value[index]
            moveToProject(nextProject.pathName)
        }
    })

}