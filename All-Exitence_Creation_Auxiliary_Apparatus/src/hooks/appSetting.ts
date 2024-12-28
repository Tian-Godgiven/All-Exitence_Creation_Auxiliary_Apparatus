import { reactive, toRaw} from "vue"
import { readFileFromPath, writeFileAtPath } from "./fileSysytem"

//控制软件的全局设置文件
export const appSetting = reactive<any>({})

//软件启动时，初始化全局设置对象
export async function initAppSetting(){
    const tmp = await readFileFromPath("data","appSetting.json")
    Object.assign(appSetting,tmp)
}

//改变软件设置的指定属性
export async function changeAppSetting(key:string,value:string|boolean|null){
    appSetting[key] = value
    //记录本次改变
    await writeFileAtPath("data","appSetting.json",toRaw(appSetting))
}