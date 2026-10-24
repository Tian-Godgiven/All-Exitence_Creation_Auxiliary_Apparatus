import { reactive } from "vue"
import { tauriAppRepository } from "@/repository/tauriAppRepository"
import type { AppData } from "@/repository/types"

//控制软件的全局设置文件
export const appSetting = reactive<any>({})

//软件启动时，初始化全局设置对象
export async function initAppSetting(){
    const app = await tauriAppRepository.initializeApp()
    Object.assign(appSetting, app.settings, {lastProjectKey: app.lastProjectKey})
}

//改变软件设置的指定属性
export async function changeAppSetting(key:string,value:unknown){
    appSetting[key] = value
    const settings = {...appSetting}
    const lastProjectKey = typeof settings.lastProjectKey === "string" ? settings.lastProjectKey : null
    delete settings.lastProjectKey
    const app:AppData = {
        formatVersion:1,
        lastProjectKey,
        settings,
    }
    await tauriAppRepository.saveApp(app)
}
