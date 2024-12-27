<template>
    <div class="editProjectInfo">
        <div class="name">
            <downLineInputVue
                v-model="name"
                placeholder="项目名称(必填)"
            ></downLineInputVue>
        </div>
        <div class="info">
            <downLineInputVue
                v-model="info"
                placeholder="项目信息"
            ></downLineInputVue>
        </div>
        <div class="buttons">
            <div class="button" @click="confirm">确认</div>
            <div class="button" @click="closePopUp(popUp)">取消</div>
        </div>
    </div>
</template>

<script setup lang='ts'>
    import { ref } from 'vue';
    import downLineInputVue from '@/components/other/input/downLineInput.vue';
import { closePopUp } from '@/hooks/pages/popUp';
import { showQuickInfo } from '@/api/showQuickInfo';
    const {props={project:{name:"",info:""}},returnValue,popUp} = defineProps(["props","returnValue","popUp"])
    const {project} = props 
    const name = ref(project.name)
    const info = ref(project.info)

    //项目名称不得为空
    function confirm(){
        if(name.value == "" || !name.value){
            showQuickInfo("项目名称不得为空")
            return false
        }
        returnValue(name.value,info.value)
        closePopUp(popUp)
    }
</script>

<style scoped lang='scss'>
    @use "@/static/style/components/popUpButtons.scss";
    .editProjectInfo{
        width: 100%;
        .buttons{
            @extend .buttons
        }
    }
</style>