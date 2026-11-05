<template>
<div class="settings">
    <label><input v-model="showInLeft" type="checkbox">显示项目总览到左侧文章列表</label>
    <label><input v-model="showByDefault" type="checkbox">新项目默认显示到左侧</label>
</div>
</template>
<script setup lang="ts">
import { computed } from "vue"
import { appSetting, changeAppSetting } from "@/hooks/app/appSetting"
import { nowProjectOverview } from "./projectOverview"
const showInLeft = computed({ get: () => nowProjectOverview.showInLeft, set: value => { nowProjectOverview.showInLeft = value } })
const showByDefault = computed({ get: () => appSetting.projectOverviewAutoShow !== false, set: value => { void changeAppSetting("projectOverviewAutoShow", value) } })
</script>
<style scoped lang="scss">
.settings{display:flex;width:min(360px,80vw);flex-direction:column;gap:14px}.settings label{display:flex;align-items:center;gap:8px}
</style>
