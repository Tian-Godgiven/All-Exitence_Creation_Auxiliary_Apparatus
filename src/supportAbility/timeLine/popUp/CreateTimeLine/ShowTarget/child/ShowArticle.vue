<template>
    <div class="showArticle" v-for="item,i in targets">
        <div class="row" v-for="target,j in item.target">
            {{ target.name }}
            <Button class="button" icon="delete" name="删除" @click="deleteTarget(i,j)"></Button>
        </div>
    </div>
</template>

<script setup lang='ts'>

import Button from '@/components/global/Button.vue';

    const {targets} = defineProps<{targets:List}>()
    function deleteTarget(i:number,j:number){
        //从列表中删除
        targets[i].target.splice(j,1)
        if(targets[i].target.length == 0){
            targets.splice(i,1)
        }
    }
</script>

<style scoped lang='scss'>
.showArticle{
    width: 100%;
    .row{
        display: flex;
        width: 100%;
        justify-content: space-between;
        .button{
            width: 40px;
            height: 40px;
            flex-direction: row-reverse;
        }
    }
}

</style>