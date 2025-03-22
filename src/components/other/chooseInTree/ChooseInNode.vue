<template>
<div class="chooseInNode">
    <slot :item="item" :parent="parent"></slot>
    <input @click.stop type="checkbox" :indeterminate="item.state=='mid'" v-model="item.state">
</div>

</template>

<script setup lang='ts'>
    import { watch } from 'vue';
    type Item = {
        name:string,
        state:boolean|"mid"|"disabled",
        child?:Item[],
        [key:string]:any,
    }

    const {item,parent} = defineProps<{item:Item,parent?:Item}>()
    const emit = defineEmits(["choose"])
    //item状态被修改时，修改子元素的状态
    watch(()=>item.state,()=>{
        if(item.state == true){
            item?.child?.map((child)=>{
                child.state = true
            })
        }
        else if(item.state == false){
            item?.child?.map((child)=>{
                child.state = false
            })
        }
    })
    //子元素状态被修改时，修改父元素的状态
    watch(()=>item?.child,()=>{
        const childrenState = item.child?.map((child)=>child.state)??[]
        //子元素全部被选中时，亲元素被选中
        if(childrenState.every((state)=>state == true)){
            item.state = true
        }
        else if(childrenState.every((state)=>state == false)){
            item.state = false
        }
        //否则亲元素的值为mid
        else{
            item.state = "mid"
        }
    },{
        deep:true
    })
</script>

<style scoped lang='scss'>
.chooseInNode{

    display: flex;
    input{
        margin-left: auto;
    }
    
}
</style>