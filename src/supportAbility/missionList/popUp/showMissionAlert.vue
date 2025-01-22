<template>
    <div>
        <div>{{ info }}</div>
        <MissionVue :mission="mission"></MissionVue>
    </div>
</template>

<script setup lang='ts'>
    import MissionVue from '../components/mission.vue';
    import { Mission } from '../missionList';
    const {props} = defineProps<{props:any}>()
    const {mission,info=""}:{mission:Mission,info?:string} = props
</script>

<style scoped lang='scss'>

</style>