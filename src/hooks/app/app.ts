import { initAppSetting } from "./appSetting"
import { supportAbilityList } from "@/static/list/supportAbilityList"
import { ref } from "vue"

export const testInfo1 = ref<string>("")
export function testInfo(info:string|Object[],clear:boolean=true){
    let string = ""
    for(let i of info){
        if(typeof i == "string"){
            string+=i
        }
        else{
            string+= JSON.stringify(i)
        }
    }
    if(clear){
        testInfo1.value = ""
    }
    testInfo1.value += string
}
//初始化应用程序
export async function initApp(){
    await initAppSetting()
    await initSupportAbility()
}

//初始化辅助功能
async function initSupportAbility(){
    const names = new Set<string>()
    for(const ability of supportAbilityList){
        if(names.has(ability.name)) throw new Error(`辅助功能注册名称重复：${ability.name}`)
        names.add(ability.name)
    }
    for(const ability of supportAbilityList){
        await ability.init()
    }
}

//应用程序保存
export async function saveApp(){
    for(const ability of supportAbilityList){
        if(ability.save){
            await ability.save(null)
        }
    }
}

//响应辅助功能
export function callSupportAbility(name:string){
    const tmp = supportAbilityList.find(ability=>ability.name == name)
    if(tmp?.call){
        tmp.call()
    }
}
