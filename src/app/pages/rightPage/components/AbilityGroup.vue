<template>
<SwitchExpand class="abilityGroup">
    <template #title>
        {{ name }}
    </template>
    <template #inner>
        <div class="container">
            <Ability v-for="ability in list" :ability></Ability>
        </div>
    </template>
</SwitchExpand>
</template> 

<script setup lang='ts'>
    import { RightAbility } from '@/static/list/rightAbilityList';
    import Ability from './Ability.vue';
import SwitchExpand from '@/components/other/SwitchExpand.vue';
    const {list,name} = defineProps<{list:RightAbility[],name:string}>()
</script>

<style scoped lang='scss'>
.abilityGroup{
    :deep(.title){
        box-shadow: $downShadow;
        font-size: $fontSize10;
        background-color: $bgColor90;
		height: 70px;
        border-top: 3px solid $bgColor70;
		border-bottom: 3px solid $bgColor70;
		box-sizing: border-box;
    }
    .container{
        width: 100%;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
    }
}
</style>