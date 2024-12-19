<template>
    <div class="createExitence">
        <div>名称：
            <downLineInputVue placeholder="输入事物名称" v-model="name"/>
        </div>
        <div>标签：
            <tagsValueVue v-model="tags"/>
        </div>
        
        <div class="buttons">
            <div class="button" @click="confirm">确认</div>
            <div class="button" @click="closePopUp(popUp)">取消</div>
        </div>
    </div>
</template>

<script setup lang='ts'>
    import { reactive, ref, toRaw } from 'vue';
    import downLineInputVue from '@/components/other/input/downLineInput.vue';
    import { closePopUp } from '@/hooks/popUp';
    import { addExitence } from '@/hooks/all-exitence/allExitence';
    import tagsValueVue from '@/components/popUps/all-exitence/status/statusValue/tagsValue.vue';
    const {props, popUp, returnValue} = defineProps(["props","popUp","returnValue"])
    const name = ref("")
    const tags = reactive([])
    const type = props.type

    //确认创建
    function confirm(){
        const exitence = addExitence(type,name.value,toRaw(tags))
        closePopUp(popUp)
        returnValue(exitence)
    }
</script>

<style scoped lang='scss'>
    @use "@/static/style/components/popUpButtons.scss";
    .buttons{
        @extend .buttons
    }
</style>