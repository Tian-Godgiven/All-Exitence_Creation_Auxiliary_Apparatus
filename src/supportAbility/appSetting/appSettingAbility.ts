import type { SupportAbilitySignUpItem } from "@/static/list/supportAbilityList"
import { openMainToolPage } from "@/hooks/pages/mainPage/toolPage"
import { addToRightPage } from "@/hooks/pages/rightPage"
import AppSettingPage from "./AppSettingPage.vue"

export const appSettingSignUpItem: SupportAbilitySignUpItem = {
    name: "appSetting",
    init: () => addToRightPage({ key: "app-setting", name: "设置", icon: "setting", click: showAppSettingPage }),
    call: () => openMainToolPage({ name: "设置", component: AppSettingPage }),
}

function showAppSettingPage(){
    openMainToolPage({ name: "设置", component: AppSettingPage })
}
