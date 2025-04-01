<template>
    <component v-if="targetList.length>0" 
        class="showTarget" 
        :is="vue" 
        :targets="targetList">
    </component>
</template>

<script setup lang='ts'>
    import { computed} from 'vue';
    import { TargetList } from './showTarget';
    import ShowExitence from './child/ShowExitence.vue';
    import ShowArticle from './child/ShowArticle.vue';
    import ShowStatus from './child/ShowStatus.vue';
    const {targetType,targetList} = defineProps<{
        targetType:"exitence"|"article"|"status",
        targetList:TargetList
    }>()
    //显示指定类型对象的内容
    const vueList = {
        "exitence":ShowExitence,
        "article":ShowArticle,
        "status":ShowStatus,
    }
    const vue = computed(()=>{
        return vueList[targetType]
    })
</script>

<style scoped lang='scss'>

</style>