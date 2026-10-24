<template>
    <form class="timeLineNameEditor" @submit.prevent="save">
        <label><DownLineInput v-model="name" placeholder="输入时间线名称" /></label>
        <div class="actions"><Button icon="check" name="保存" @click="save" /></div>
    </form>
</template>

<script setup lang="ts">
import { ref } from "vue"
import Button from "@/components/global/button.vue"
import DownLineInput from "@/components/other/input/downLineInput.vue"
import { closePopUp, type PopUp } from "@/hooks/pages/popUp"

const { popUp, props, returnValue } = defineProps<{
    popUp: PopUp,
    props: { name: string },
    returnValue?: (name: string) => void,
}>()
const name = ref(props.name)

function save(){
    returnValue?.(name.value.trim() || "新时间线")
    closePopUp(popUp)
}
</script>

<style scoped lang="scss">
.timeLineNameEditor {
    display: flex;
    width: min(360px, 82vw);
    flex-direction: column;
    gap: 16px;
}

label {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.actions {
    display: flex;
    justify-content: flex-end;
}
</style>
