<template>
<Button class="ability" @click="openAbility">
	<Icon class="icon" :icon="ability.icon"></Icon>
    <div class="name">{{ ability.name }}</div>
</Button>
</template>

<script setup lang='ts'>
    import { RightAbility } from '@/static/list/rightAbilityList';
import Icon from '@/components/global/Icon.vue';
import Button from '@/components/global/button.vue';
import { hidePage } from '@/hooks/pages/pageChange';
    const {ability} = defineProps<{ability:RightAbility}>()

    function openAbility(){
        ability.click()
        hidePage("right")
    }
</script>

<style scoped lang='scss'>
.ability{
	width: 100%;
	height: 100%;
	display: flex;
	padding: 20px;
	flex-direction: column;
	place-items: center;
	box-sizing: border-box;
    .icon{
		padding:0 25px;
		box-sizing: border-box;
		width: 100%;
		height: 100px;
		flex-shrink: 0
	}
	.name{
		font-size: 0.9rem;
		text-align: center;
	}
}

@media (min-width: 900px){
    .ability{
        height: 80px;
        padding: 8px;
        .icon{
            height: 44px;
            padding: 0 8px;
        }
    }
}
</style>
