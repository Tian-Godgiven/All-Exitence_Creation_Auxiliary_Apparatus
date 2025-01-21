<template>
    <div class="missionTimeout">
        <div class="inner">
            <div class="timeout">
                <TimeOutPicker v-model.number="tmpTime" :start-time="now"></TimeOutPicker>
            </div>
            <div class="clock">直到：
                <DatePicker v-model="tmpTime"></DatePicker>
                <TimePicker v-model="tmpTime"></TimePicker>
            </div>
        </div>
        <div class="finalButtons">
            <Button @click="confirm" name="确认">确认</Button>
            <Button @click="closePopUp(popUp)" name="取消">取消</Button>
        </div>
    </div>
   
</template>

<script setup lang='ts'>
    import { closePopUp, PopUp } from '@/hooks/pages/popUp';
    import Button from '@/components/global/button.vue';
    import { Ref, ref } from 'vue';
    import { cloneDeep } from 'lodash';
    import DatePicker from '@/components/other/timePicker/DatePicker.vue';
    import TimePicker from '@/components/other/timePicker/TimePicker.vue';
    
    import TimeOutPicker from '@/components/other/timePicker/TimeOutPicker.vue';
    const {popUp,returnValue,props={}} = defineProps<{popUp:PopUp,returnValue:(a:number)=>void,props:any}>()
    let {time} = props
    const now = Date.now()
    if(!time){
        time = now
    }

    const tmpTime:Ref<number> = ref(cloneDeep(time)) 
        console.log(new Date(tmpTime.value))
    function confirm(){
        returnValue(tmpTime.value)
        closePopUp(popUp)
    }

</script>

<style scoped lang='scss'>
@use "@/static/style/popUp.scss";
.inner{
    .clock{
        display: flex;
    }
}
.finalButtons{
    @extend .finalButtons;
    
    
}
</style>