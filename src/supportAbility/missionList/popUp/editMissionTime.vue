<template>
    <div class="missionTimeout">
        <div class="inner">
            <div class="timeout">
                <TimeOutPicker v-model.number="tmpTime" :start-time="now"></TimeOutPicker>
            </div>
            <div class="clock">直到：
                <DatePicker v-model.number="tmpTime"></DatePicker>
                <TimePicker v-model.number="tmpTime"></TimePicker>
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
    import Button from '@/components/global/Button.vue';
    import { Ref, ref } from 'vue';
    import { cloneDeep } from 'lodash';
    import DatePicker from '@/components/other/timePicker/DatePicker.vue';
    import TimePicker from '@/components/other/timePicker/TimePicker.vue';
    
    import TimeOutPicker from '@/components/other/timePicker/TimeOutPicker.vue';
    const {popUp,returnValue,props={}} = defineProps<{popUp:PopUp,returnValue:(a:number,b:number)=>void,props:any}>()
    let {planTime,limitTime} = props
    let time
    const now = Date.now()
    if(planTime){
        time = planTime
    }
    else if(limitTime){
        time = now + limitTime
    }
    else{
        time = now
    }
    //显示的时间：优先显示planTime
    const tmpTime:Ref<number> = ref(cloneDeep(time)) 
    function confirm(){
        //返回tmpTime和时间差值
        returnValue(tmpTime.value,tmpTime.value-now)
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