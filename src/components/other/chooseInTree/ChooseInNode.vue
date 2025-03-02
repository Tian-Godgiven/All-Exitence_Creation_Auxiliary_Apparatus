<template>
<div class="chooseInNode">
<SwitchExpend>
    <template #title>
        <slot class="parent" :state="parentState" name="parent"></slot>
        <input @click.stop type="checkbox" :indeterminate="parentState=='mid'" v-model="parentState">
    </template>
    <template #inner>
        <div class="child" v-for="child,index in children" :key="child.__key">
            <slot name="children" :child="child" :state="childrenState[index]"></slot>
            <input v-if="!child.rules" @click.stop @change="onChange(index)" type="checkbox" v-model="childrenState[index].value">
        </div>
    </template>
</SwitchExpend>
</div>

</template>

<script setup lang='ts'>
import { Ref, ref, watch } from 'vue';
import SwitchExpend from '../SwitchExpend.vue';
    // 接受复数的子元素列表，按顺序生成
    const {children,idleParentState=null,chosenList} = 
        defineProps<{children:any[],idleParentState?:Ref<boolean>,chosenList:any[]}>()
    //parent的状态
    const parentState= idleParentState ?? ref<boolean|"mid">(false)
    //children的状态列表
    const childrenState = children.map(()=>ref(false))
    //修改已选择列表
    function onChange(index:number){
        const child = children[index]
        const state = childrenState[index]
        //添加
        if(state.value){
            const i = chosenList.indexOf(child)
            if(i<0){
                chosenList.push(child)
            }
        }
        //移除
        else if(!state.value){
            const i = chosenList.indexOf(child)
            chosenList.splice(i,1)
        }
    }
    //监听亲元素的值
    watch(parentState,()=>{
        if(parentState.value == true){
            childrenState.forEach((state,index)=>{
                state.value = true
                //触发onchange
                onChange(index)
            })
        }
        else if(parentState.value == false){
            childrenState.forEach((state,index)=>{
                state.value = false
                onChange(index)
            })
        }
    })
    //监听子元素列表的值，不会触发上述监听
    watch(childrenState,()=>{
        //子元素全部被选中时，亲元素被选中
        if(childrenState.every((state)=>state.value == true)){
            parentState.value = true
        }
        else if(childrenState.every((state)=>state.value == false)){
            parentState.value = false
        }
        //否则亲元素的值为mid
        else{
            parentState.value = "mid"
        }
    },{
        deep:true
    })
</script>

<style scoped lang='scss'>

</style>