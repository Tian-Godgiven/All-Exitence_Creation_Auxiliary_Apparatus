import { BaseDirectory, exists, mkdir, create,  readTextFile, writeTextFile, readDir, remove, rename } from "@tauri-apps/plugin-fs";


export const appData = {baseDir:BaseDirectory.AppLocalData}

//返回指定路径的文件或文件夹是否存在
export async function ifExists(path:string,name:string):Promise<boolean>{
    let ifExists = await exists(getPath(path,name),appData)
    return ifExists
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
        ifExists = await exists(getPath(path,newDirName),appData)
        i+=1
    }
    //存在重名时使用新名称
    if(newDirName){dirName = newDirName}
    //初始化数据文件夹
    await mkdir(getPath(path,dirName),appData)
    //返回新的文件夹名称
    return newDirName || dirName
}

//删除指定路径的文件夹,设定deleteNotEmpty为true才可以删除非空文件夹
export async function deleteAtPath(path:string,name:string,deleteNoEmpty:boolean=false){
    await remove(getPath(path,name),{...appData,recursive:deleteNoEmpty})
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
export async function readFileFromPath(path:string,fileName:string,ifJSON:boolean=true)
:Promise<false | string | Record<string,any>>{
    try{
        const content = await readTextFile(getPath(path,fileName), appData);
        //读取文件
        if(ifJSON && content){
            return JSON.parse(content)
        }
        return content
    }
    catch(err){
        console.error(err)
        return false
    }
}

//读取指定文件夹的内容，返回其中的文件名称组成的数组
export async function readDirAsArray(path:string,dirName:string){
    const dirPath = getPath(path,dirName)
    const dirInfo = await readDir(dirPath,appData)
    const infoArray = dirInfo.reduce((arr:any,value:any)=>{
        arr.push(value.name)
        return arr
    },[])
    return infoArray
}

//写指定内容覆盖到目标文件
export async function writeFileAtPath(path:string,fileName:string,content:Object|string){
    const filePath = getPath(path,fileName)
    const stringContent = JSON.stringify(content)
    await writeTextFile(filePath,stringContent,appData)
}

//尝试读取指定文件，失败时创建指定内容文件
export async function tryReadFileAtPath(path:string,fileName:string,ifJSON:boolean=true,content:Object|string|(()=>Object|string)){
    try{
        const content = await readTextFile(getPath(path,fileName), appData);
        //读取文件
        if(ifJSON && content){
            return JSON.parse(content)
        }
        return content
    }
    catch(err){
        let inner
        if(content instanceof Function){
            inner = content()
        }
        else{
            inner = content
        }
        await createFileToPath(path,fileName,JSON.stringify(inner))
        return inner
    }
}

//重命名指定的文件/文件夹，当名称重复时会尝试修改这个名称并返回新的名称
export async function renameToAtPath(path:string,oldName:string,newName:string){
    const newPath = getPath(path,newName)
    //判断该路径下是否存在新名称的重名
    let ifExists = await exists(newPath,appData)
    let newnewName 
    let i = 1
    //存在重名则不断添加数字
    while(ifExists){
        newnewName = newName + "_" + i
        const newnewPath = getPath(path,newnewName)
        ifExists = await exists(newnewPath,appData)
        i+=1
    }
    //存在重名时使用新名称
    if(newnewName){newName = newnewName}
    //重命名这个文件夹
    await rename(getPath(path,oldName),getPath(path,newName),{newPathBaseDir:BaseDirectory.AppLocalData,oldPathBaseDir:BaseDirectory.AppLocalData})
    //返回新的文件夹名称
    return newName
}

//获取文件路径
export function getPath(path:string,name:string):string{
    if(path == "data"){
        return `data/${name}`
    }
    return `data/${path}/${name}`
}