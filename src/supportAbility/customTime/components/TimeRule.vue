<template>
<div class="timeRule">
    <div>{{ rule.name }}</div>
    <div>
        <div class="unit" v-for="unit in rule.units">
            {{getUnitInner(unit)}}
        </div>
    </div>
    <div>{{ rule.numFormat }}</div>
    <div class="buttons">
        <slot></slot>
    </div>
</div>
</template>

<script setup lang='ts'>
    import { CustomTimeRule, CustomTimeRuleUnit } from '../customTime';
    const {rule} = defineProps<{rule:CustomTimeRule}>();
    function getUnitInner(unit:CustomTimeRuleUnit){
        if(unit.target == false){
            return `${unit.name} = 最小单位`
        }
        else{
            return `${unit.name} = ${unit.equal} ${unit.target}`
        }
    }
</script>

<style scoped lang='scss'>
.timeRule{
    display: grid;
    grid-template-columns: 1fr 2fr 1fr 0.4fr;
    gap: 5px;
}
</style>