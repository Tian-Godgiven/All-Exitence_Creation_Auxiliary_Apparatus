import { exists, mkdir } from "@tauri-apps/plugin-fs"
import { initAppSetting } from "./appSetting"
import { appData, createDirByPath, createFileToPath, ifExists } from "../fileSysytem"
import { initGlobalInputSuggestion } from "./globalInputSuggestion"
import { initSupportAbilityList } from "@/data/list/supportAbilityList"

//初始化应用程序
export async function initApp(){
    //检查是否已经存在需求的data文件夹
    const ifData = await exists('data',appData)
    if(!ifData){
        try{
            //初始化引用的数据文件夹与app数据文件夹
            await mkdir("data",appData)
            await mkdir("data/appData",appData)
            //初始化软件设置文件
            const appSettingFile = {
                lastProjectPath : null
            }
            await createFileToPath("appData","appSetting.json",JSON.stringify(appSettingFile))
            //初始化用户项目文件夹
            await mkdir("data/projects",appData)
        }   
        catch(err){
            console.error(err)
        }
    }

    //初始化软件设置
    await initAppSetting()
    //初始化全局输入建议
    await initGlobalInputSuggestion()
    //初始化辅助功能
    await initSupportAbility()
}

//初始化辅助功能
async function initSupportAbility(){
    //初始化辅助功能文件夹，不存在则创建
    if(!await ifExists("data","supportAbility")){
        await createDirByPath("data","supportAbility")
    }
    //遍历执行列表中的辅助功能初始化项目
    const list = initSupportAbilityList
    list.forEach((ability)=>{
        ability.init()
    })
}