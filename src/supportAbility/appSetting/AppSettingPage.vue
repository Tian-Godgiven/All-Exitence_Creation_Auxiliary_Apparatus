<template>
<section class="appSettingPage">
    <div class="settings">
        <section class="settingSection">
            <h1>软件设置</h1>
            <label class="settingGroup settingToggle">
                <span>深色模式</span>
                <input v-model="darkMode" type="checkbox">
            </label>
        </section>
        <section class="settingSection">
            <h1>编辑器设置</h1>
            <div class="settingGroup">
                <h2>字体</h2>
                <Selector v-model="fontFamily" :list="editorFontOptions" />
            </div>
            <div class="settingGroup">
                <h2>字号</h2>
                <div class="fontSizeInput">
                    <input :value="fontSize" type="number" min="10" max="72" step="1" @change="fontSize = Number(($event.target as HTMLInputElement).value)">
                    <span>px</span>
                </div>
            </div>
        </section>
    </div>
    <div class="fontPreview" :style="previewStyle">滚滚长江东逝水</div>
</section>
</template>

<script setup lang="ts">
import { computed } from "vue"
import Selector from "@/components/global/Selector.vue"
import { appSetting, changeAppSetting } from "@/hooks/app/appSetting"
import { editorFontOptions, getEditorFontFamily, normalizeEditorFontSize } from "./editorTypography"
const darkMode = computed({
    get: () => appSetting.darkMode === true,
    set: value => { void changeAppSetting("darkMode", value) },
})
const fontFamily = computed({
    get: () => typeof appSetting.editorFont === "string" ? appSetting.editorFont : "microsoft-yahei",
    set: value => { void changeAppSetting("editorFont", value) },
})
const fontSize = computed({
    get: () => normalizeEditorFontSize(appSetting.editorFontSize),
    set: value => { void changeAppSetting("editorFontSize", normalizeEditorFontSize(value)) },
})
const previewStyle = computed(() => ({ fontFamily: getEditorFontFamily(fontFamily.value), fontSize: `${fontSize.value}px` }))
</script>

<style scoped lang="scss">
.appSettingPage{
    width: min(900px, 100%);
    padding: 24px;
    display: flex;
    align-items: flex-start;
    gap: 48px;
}
.settings{
    width: min(360px, 100%);
}
.settingSection{
    display: flex;
    flex-direction: column;
    gap: 4px;
    + .settingSection{ margin-top: 28px; }
    h1{ margin: 0 0 4px; font-size: $fontSize40; font-weight: normal; }
}
.settingGroup{
    display: grid;
    grid-template-columns: 72px minmax(0, 1fr);
    align-items: center;
    gap: 16px;
    min-height: 58px;
    border-bottom: 1px solid $bgColor70;
    h2{ margin: 0; font-size: $fontSize20; font-weight: normal; }
}
.settingToggle{
    cursor: pointer;
    > span{ font-size: $fontSize20; }
    input{ width: 18px; height: 18px; margin: 0; accent-color: $buttonColor; }
}
.fontPreview{
    min-width: 0;
    padding: 12px 0;
    line-height: 1.5;
    overflow-wrap: anywhere;
}
.fontSizeInput{
    display: flex;
    align-items: center;
    gap: 8px;
    input{
        width: 100%;
        height: 36px;
        padding: 0 10px;
        color: inherit;
        background: $bgColor;
        border: 1px solid $inputBorderColor;
        outline: none;
        &:focus{ border-color: $buttonColor; }
    }
    span{ color: $previewText; }
}
@media (max-width: 899px){
    .appSettingPage{ padding: 16px; flex-direction: column; gap: 20px; }
    .settings{ width: 100%; }
}
</style>
