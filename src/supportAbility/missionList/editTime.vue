<template>
    <div>
        <div>编辑时间</div>
        <div class="buttons">
            <Button @click="confirm" name="确认">确认</Button>
            <Button @click="closePopUp(popUp)" name="取消">取消</Button>
        </div>
    </div>
   
</template>

<script setup lang='ts'>
    import { closePopUp, PopUp } from '@/hooks/pages/popUp';
    import Button from '@/components/global/button.vue';
    import { ref } from 'vue';
    import { cloneDeep } from 'lodash';
    const {popUp,returnValue,props={}} = defineProps<{popUp:PopUp,returnValue:(arg0:any[])=>void,props:any}>()
    const {time=null} = props

    const tmpTime = ref(cloneDeep(time)) 

    function confirm(){
        returnValue(tmpTime.value)
        closePopUp(popUp)
    }

</script>

<style scoped lang='scss'>

</style>