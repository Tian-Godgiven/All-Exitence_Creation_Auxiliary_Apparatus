<template>
    <div class="option" @click.stop="choose">
        <div>{{ item.name }}</div>
        <Selector @click.stop v-model="item.targetStatus" :list="statusList"></Selector>
        <Icon :show="ifShow" class="icon" icon="check"></Icon>
    </div>
</template>

<script setup lang='ts'>
import Icon from '@/components/global/Icon.vue';
import { chooseTarget, EItem } from './chooseStatus';
import { computed } from 'vue';
import Selector from '@/components/global/Selector.vue';

    const {item} = defineProps<{item:EItem}>()
    const ifShow = computed(()=>{
        return item.state === true
    })
    const statusList = computed(()=>{
        return item.status.map(status=>{
            return {
                label:status.name,
                value:status.key
            }
        })
    })
    function choose(){
        //选择该选项
        chooseTarget(item)
    }
</script>

<style scoped lang='scss'>
.option{
    display: flex;
    .icon{
        flex-shrink: 0;
        flex-direction: row-reverse;
        width: 40px;
        height: 40px;
    }
}
</style>