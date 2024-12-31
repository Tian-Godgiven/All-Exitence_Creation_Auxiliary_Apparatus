<template>
    <div class="relationValue">
        <div class="relationTitle relationUnit" v-if="ifShowTitle" >
            <div class="titleUnit" v-for="(,key) in relationSource">{{ key }}</div>
        </div>
        <div class="relationAdd" @click="addUnit" v-if="ifShowAdd">[+]</div>
        <relationUnitValueVue class="relationUnit" 
            v-for="unit of status.value" 
            :unit="unit"
            :key="Symbol()"
            :source="relationSource"/>
    </div>
</template>

<script setup lang='ts'>
    import { computed } from 'vue';
    import relationUnitValueVue from './relationUnitValue.vue';
    const {status,statusSetting} = defineProps(["status","statusSetting"])
    //获取关联体
    const relationSource = computed(()=>{
        return statusSetting.relationSource
    })
    //是否显示标题:默认为true
    const ifShowTitle = computed(()=>{
        if(status.setting?.relationTitle == null){
            return true
        }
        return status.setting.relationTitle
    })
    //是否显示新增按键:默认为true
    const ifShowAdd = computed(()=>{
        if(status.setting?.relationAdd == null){
            return true
        }
        return status.setting.relationAdd
    })
    function addUnit(){
        status.value.push({})
    }
</script>

<style scoped lang='scss'>
    .relationValue{
        position: relative;
        .relationUnit{
            width: 100%;
            display: flex;
            flex-wrap: wrap; /* 允许子元素换行 */
            z-index: 1;
            .titleUnit{
                flex: 1 1 30%;
            }
        }
        .relationAdd{
            position: absolute;
            top:0px;
            width: 10%;
            right: 0px;
            z-index: 2;
        }
    }
    
</style>