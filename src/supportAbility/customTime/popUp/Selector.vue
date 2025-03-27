<template>
    <div class="timeSelector">
        <div class="timeRules">全局可用
            <div class="dateRule">
                <div>现实时间</div>
                <div>年，月，日，时，分，秒</div>
                <div>阿拉伯数字</div>
                <Button @click="selectRule('date')" name="选择"></Button>
            </div>
            <TimeRuleVue v-for="rule in customTimeLib" :key="rule.__key" :rule="rule">
                <Button @click="selectRule(rule)" name="选择"></Button>
            </TimeRuleVue>
        </div>
    </div>
</template>

<script setup lang='ts'>
    import TimeRuleVue from '../components/TimeRule.vue';
    import Button from '@/components/global/Button.vue';
    import { customTimeLib, type TimeRule } from '../customTime';
import { closePopUp, PopUp } from '@/hooks/pages/popUp';
    const {popUp,returnValue} = defineProps<{popUp:PopUp,returnValue:(selector:TimeRule)=>void}>()
    function selectRule(rule:TimeRule){
        //返回TimeRule的__key或者"date"
        returnValue(rule)
        closePopUp(popUp)
    }

</script>

<style scoped lang='scss'>
.timeSelector{
    .timeRules{
        .dateRule{
            display: grid;
            grid-template-columns: 1fr 2fr 1fr 0.4fr;
        }
    }
}
</style>