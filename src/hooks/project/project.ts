import { reactive, ref, toRaw } from "vue";
import { appSetting, changeAppSetting } from "../app/appSetting";
import { createDirByPath, createFileToPath, deleteAtPath, ifExists, readDirAsArray, readFileFromPath, renameToAtPath, writeFileAtPath } from "../fileSysytem";
import { showPopUp } from "../pages/popUp";
import { showAlert } from "../alert";
import { hidePage } from "../pages/pageChange";
import { getShowOnMainInfo, showLastTargetOnMain, showTargetOnMain } from "../pages/mainPage/showOnMain";
import { supportAbilityList } from "@/static/list/supportAbilityList";
import { nowAllExitence } from "../all-exitence/allExitence";
import { nowAllArticles } from "../all-articles/allArticles";
import { changeNowAllExitence } from "../all-exitence/allExitence"
import { changeNowAllArticles } from "../all-articles/allArticles"
import { Type } from "@/class/Type"

//项目上一次访问的目标
export type ProjectLastTarget = 
    {from:string,targetKey:string,type:"exitence"}|//事物
    {from:string[],targetKey:string,type:"article"}|//或是文章
    {from:null,targetKey:"app"|"project",type:"info"}
//项目信息
export type ProjectInfo = {
    name:string,
    pathName:string,
    time:Date | number,
    info?:string,
    lastTarget:ProjectLastTarget|null //该项目在切换前主页面所显示的对象的信息
}

//app中所有项目列表
export const nowProjectList = ref<ProjectInfo[]>([])
//当前显示的项目的文件夹路径，注意其只包含其文件夹的名称
export const nowProjectPath = ref<string|null>(null)
//当前显示的项目信息
export const nowProjectInfo = reactive<ProjectInfo>(
    {name:"",lastTarget:null,pathName:"",time:0}
)

//初始化当前项目，读取项目列表
export async function initProject(){
    //打开上一次的项目文件
    const lastProjectPath = appSetting?.lastProjectPath
    const tmp = await ifExists("projects",lastProjectPath)
    //若为空或该项目不存在则显示软件初始页面
    if(!lastProjectPath || !tmp){
        onNoProject()
    }
    //否则移动到上一次打开的项目文件
    else{
        moveToProject(lastProjectPath)
    }
    //读取app中存储的项目路径列表
    const projectPathList:string[] = await readDirAsArray("data","projects")
    //依次获取项目信息
    nowProjectList.value = await Promise.all(projectPathList.map(async (projectPath: string) => {
        return await readFileFromPath(`projects/${projectPath}`, "projectInfo.json") as ProjectInfo
    }))
}
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
//读取项目信息，在主页面上显示指定内容

//保存当前项目
export async function saveProject(){
    if(!nowProjectPath.value){return false}
    try{
        //当前项目的路径
        const projectPath = "projects/"+ nowProjectPath.value
        //当前万物
        const allExitence = nowAllExitence
        await writeFileAtPath(projectPath,"all-exitence.json",toRaw(allExitence))
        //文章
        const allArticles = nowAllArticles
        await writeFileAtPath(projectPath,"all-articles.json",toRaw(allArticles))
        //保存项目数据
        await saveProjectData()
        //保存项目信息
        await saveProjectInfo()
        //项目设置
    }
    catch(err){
        alert(err)
        console.error(err)
        return false
    }
    return true
}
//保存当前项目信息，在保存项目和切换项目时触发
export async function saveProjectInfo(){
    //记录项目当前主页面的内容:切换项目or保存项目
    if(!nowProjectInfo?.pathName){return false}//在项目初始化时，也会尝试进行一场记录，此时跳过
    //获取主页面信息
    const showOnMainInfo = getShowOnMainInfo()
    //写进项目信息中
    if(showOnMainInfo){
        nowProjectInfo.lastTarget = showOnMainInfo
    }
    //将项目信息写入
    await writeFileAtPath(`projects/${nowProjectInfo.pathName}`,"projectInfo.json",nowProjectInfo)
}
//保存当前项目数据
async function saveProjectData(){
    // const dataPath = projectPath+"/data"
    
}


//不存在任何项目时的页面
export function onNoProject(){
    showTargetOnMain({
        type:"info",
        target:"app"
    })
    nowProjectPath.value = null
    nowProjectInfo.name = "点击此处创建新项目"
}
//项目内不存在任何数据时的页面
export function onNoContent(){
    showTargetOnMain({
        type:"info",
        target:"app"
    })
}

//从项目A移动到项目B，记录项目A的信息，读取项目B的信息
export async function moveToProject(projectPath:string){
    //记录旧项目此时的信息
    await saveProjectInfo()
    //同步新项目的数据
    const tmp = await syncProject(projectPath)
    //同步数据成功
    if(tmp){
        //在主页面上显示新项目上一次显示的内容
        showLastTargetOnMain(nowProjectInfo.lastTarget)
        //记录新项目为上一次打开的项目
        changeAppSetting("lastProjectPath",projectPath)
    }
    else{
        //同步失败，认为该项目已不存在，弹出提示后移动到初始页面
        onNoProject()
        showAlert({
            "info":"同步项目信息失败，该项目可能已经被删除！",
            "confirm":()=>{}
        })
    }
}
//移动到下一个项目，通常用于当前项目已经不存在的情况
export function moveToNextProject(index:number){
    //如果此时已经没有其他项目了，则显示软件初始页面
    if(nowProjectList.value.length == 0){
        onNoProject()
    }
    else{
        const nextProject = nowProjectList.value[index]
        moveToProject(nextProject.pathName)
    }
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
        time:Date.now(),
        lastTarget:null
    }
    await createFileToPath(projectPath,"projectInfo.json",JSON.stringify(projectInfo))
    await createFileToPath(projectPath,"all-exitence.json",JSON.stringify(
        {
            types:[]
        }
    ))
    await createFileToPath(projectPath,"all-articles.json",JSON.stringify(
        {
            chapters:[],
            articles:[]
        }
    ))

    //向项目列表中添加本项目
    nowProjectList.value.push(projectInfo)

    //移动到当前项目
    await moveToProject(pathName)
    //隐藏项目页面
    hidePage('project')

    //创建数据部分
    async function createProjectData(){
        //创建data文件夹
        await createDirByPath(projectPath,"data")
        //创建基础设置
    
        //辅助功能的同步创建事件
        for (const ability of supportAbilityList) {
            if(ability.createProject){
                const func =  ability.createProject
                await func(projectPath)
            }
        }
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

// 更新指定项目的信息，同时也会尝试更新项目的文件夹名称
async function updateProject(projectInfo:ProjectInfo,newName:string,newInfo:string){
    //覆盖原本的信息
    projectInfo.name = newName;
    projectInfo.info = newInfo;
    //尝试使用newName更新项目文件夹的名称
    const newPathName = await renameToAtPath("projects",projectInfo.pathName,newName)
    projectInfo.pathName = newPathName
    //保存上述内容
    await writeFileAtPath(`projects/${projectInfo.pathName}`,
        "projectInfo.json",projectInfo)
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
export async function deleteProject(projectInfo:ProjectInfo){
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
            if(nowProjectInfo.pathName == projectInfo.pathName){
                moveToNextProject(index)
            }
        }
    })
}




 
