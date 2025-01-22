<template>
    <div>
        <div>该任务的限时时间到了，请结算任务！</div>
        <MissionVue :mission="mission"></MissionVue>
    </div>
</template>

<script setup lang='ts'>
    import MissionVue from '../components/mission.vue';
    import { Mission } from '../missionList';
    const {props} = defineProps<{props:any}>()
    const mission:Mission = props.mission
</script>

<style scoped lang='scss'>

</style>