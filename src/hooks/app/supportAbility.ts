import { toRaw } from "vue"
import { readFileFromPath, tryReadFileAtPath, writeFileAtPath } from "../fileSysytem"

/**
 * 辅助功能在同步项目时使用的通用函数
 * @param spName 辅助功能名称（英语）
 * @param projectPath 项目路径，在syncProject时会传入哦
 * @param noFileContent? 当没有找到对应文件时，创建同名文件时其中的内容，若不传入则不创建同名文件
 */
export async function supportAbilitySyncProject(
    spName:string,projectPath:string,noFileContent?:Object|string|(()=>(Object|string))
){
    const fileName = spName + ".json"
    const path = projectPath +"/data"//统一存储在data文件内
    if(noFileContent===undefined){
        //读取文件并返回
        return await readFileFromPath(path,fileName,true)
    }
    else{
        return await tryReadFileAtPath(path,fileName,true,noFileContent)
    }
}

/**
 * 辅助功能在将内容保存到项目中时使用的通用函数
 * @param spName 辅助功能名称
 * @param projectPath 项目路径
 * @param content 保存内容
 */
export async function supportAbilitySaveProject(
    spName:string,projectPath:string|null,content:any
){
    if(!projectPath)return;
    const dataPath = projectPath + "/data"
    const fileName = spName + ".json"
    //内容可能还有响应式
    const file = toRaw(content)
    await writeFileAtPath(dataPath,fileName,file)
}