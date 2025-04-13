<template>
<div class="abilityGroup">
    <div class="title">{{ name }}</div>
    <div class="container">
        <Ability v-for="ability in list" :ability></Ability>
    </div>
    
</div>
</template>

<script setup lang='ts'>
    import { RightAbility } from '@/static/list/rightAbilityList';
    import Ability from './Ability.vue';
    const {list,name} = defineProps<{list:RightAbility[],name:string}>()
</script>

<style scoped lang='scss'>
.abilityGroup{
    .title{

    }
    .container{
        display: flex;
    }
}
</style>