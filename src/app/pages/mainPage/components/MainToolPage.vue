<template>
    <section
        ref="toolPageRef"
        class="mainToolPage"
        aria-modal="true"
        role="dialog"
        tabindex="-1"
        @keydown.stop
        @pointerdown.stop
        @wheel.stop
    >
        <header class="topBar">
            <div class="title">{{ toolPage.name }}</div>
            <div v-if="toolPage.actions?.length" class="actions">
                <Button
                    v-for="action in toolPage.actions"
                    :key="action.name"
                    :name="action.name"
                    :icon="action.icon"
                    @click="action.click"
                />
            </div>
            <Button name="关闭" icon="closePopUp" @click="closeMainToolPage" />
        </header>
        <div class="content">
            <component :is="toolPage.component" v-bind="toolPage.props" />
        </div>
    </section>
</template>

<script setup lang="ts">
import { nextTick, onMounted, useTemplateRef } from "vue"
import Button from "@/components/global/button.vue"
import { closeMainToolPage, MainToolPage } from "@/hooks/pages/mainPage/toolPage"

const { toolPage } = defineProps<{ toolPage: MainToolPage }>()
const toolPageRef = useTemplateRef("toolPageRef")

onMounted(async () => {
    await nextTick()
    toolPageRef.value?.focus()
})
</script>

<style scoped lang="scss">
.mainToolPage{
    position: absolute;
    inset: 0;
    z-index: 2;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background-color: $bgColor;
    outline: none;
    .topBar{
        height: 56px;
        flex: 0 0 auto;
        display: flex;
        align-items: center;
        padding: 0 16px 0 24px;
        border-bottom: 1px solid $bgColor70;
        .title{
            flex: 1;
            font-size: 1.1rem;
        }
        .actions{
            display: flex;
            gap: 4px;
        }
        .button{
            width: 40px;
            height: 40px;
            padding: 10px;
        }
    }
    .content{
        position: relative;
        min-height: 0;
        flex: 1;
        overflow: auto;
    }
}

@media (min-width: 900px){
    .mainToolPage .topBar{
        height: 52px;
    }
}
</style>
