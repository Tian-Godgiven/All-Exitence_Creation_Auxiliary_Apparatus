<template>
    <div class="option" @click.stop="choose">
        <div>{{ item.name }}</div>
        <ElSelect @click.stop v-model="item.targetStatus">
            <ElOption v-for="status in item.status" 
                :value="status.key" 
                :label="status.name"></ElOption>
        </ElSelect>
        <Icon :show="ifShow" class="icon" icon="check"></Icon>
    </div>
</template>

<script setup lang='ts'>
import Icon from '@/components/global/Icon.vue';
import { chooseTarget, EItem } from './chooseStatus';
import { ElOption, ElSelect } from 'element-plus';
import { computed } from 'vue';

    const {item} = defineProps<{item:EItem}>()
    const ifShow = computed(()=>{
        return item.state === true
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