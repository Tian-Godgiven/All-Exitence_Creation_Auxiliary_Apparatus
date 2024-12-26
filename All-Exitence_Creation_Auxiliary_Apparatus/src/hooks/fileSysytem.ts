import { BaseDirectory, exists, mkdir, create,  readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { initProject } from "./project/project";
import { initAppSetting } from "./appSetting";

const appData = {baseDir:BaseDirectory.AppLocalData}
//软件启动，初始化文件系统
export async function initFileSystem(){
    //检查是否已经存在需求的data文件夹
    const ifData = await exists('data',appData)
    if(!ifData){
        //初始化数据文件夹
        await mkdir("data",appData)
        //初始化软件设置文件
        const appSettingFile = {
            lastProjectPath : null
        }
        await createFileToPath("data","appSetting.json",JSON.stringify(appSettingFile))
        //初始化用户项目文件夹
        await mkdir("data/projects",appData)
    }

    //初始化软件设置
    await initAppSetting()
    //初始化项目
    await initProject()
}

//创建指定路径的文件夹
export async function createDirByPath(path:string,dirName:string){
    //判断该路径下是否存在重名
    let ifExists = await exists(getPath(path,dirName),appData)
    let newDirName 
    let i = 1
    //存在重名则不断添加数字
    while(ifExists){
        newDirName = dirName + "_" + i
        ifExists = await exists(`data/${path}/${newDirName}`,appData)
        i+=1
    }
    //初始化数据文件夹
    await mkdir(`data/${path}/${dirName}`,appData)
    //返回新的文件夹名称
    return newDirName || dirName
}

//创建指定路径的文件,添加指定内容
export async function createFileToPath(path:string,fileName:string,inner?:string){
    const file = await create(getPath(path,fileName),appData)
    //向其中添加内容
    if(inner){
        const encoder = new TextEncoder();
        const data = encoder.encode(inner);
        file.write(data)
    }
    
    return file
}

//读取指定文件的内容，返回JSON.parse处理后的内容
export async function readFileFromPath(path:string,fileName:string,ifJSON:boolean=true){
    const content = await readTextFile(getPath(path,fileName), appData);
    //读取文件
    if(ifJSON && content){
        console.log("返回的是应该是一个对象")
        return JSON.parse(content)
    }
    console.log("返回的不是一个对象:",ifJSON,content)
    return content
    
}

//写指定内容覆盖到目标文件
export async function writeFileAtPath(path:string,fileName:string,content:Object|string){
    const filePath = getPath(path,fileName)
    const stringContent = JSON.stringify(content)
    await writeTextFile(filePath,stringContent,appData)
}

//获取文件路径
export function getPath(path:string,name:string):string{
    if(path == "data"){
        return `data/${name}`
    }
    return `data/${path}/${name}`
}