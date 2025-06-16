import { reactive, toRaw} from "vue"
import { readFileFromPath, writeFileAtPath } from "../fileSysytem"

//控制软件的全局设置文件
export const appSetting = reactive<any>({})

//软件启动时，初始化全局设置对象
export async function initAppSetting(){
    const tmp = await readFileFromPath("appData","appSetting.json")
    if(!tmp){
        //待完成，在此处创建项目的初始设置对象文件以处理读取项目设置文件失败的情况
    }
    Object.assign(appSetting,tmp)
}

//改变软件设置的指定属性
export async function changeAppSetting(key:string,value:string|boolean|null){
    appSetting[key] = value
    //记录本次改变
    await writeFileAtPath("appData","appSetting.json",toRaw(appSetting))
}