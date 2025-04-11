<template>
<div class="chooseInNode">
    <slot :item="item" :parent="parent"></slot>
    <input @click.stop type="checkbox" 
        :indeterminate="item.state=='mid'" 
        v-model="item.state">
</div>

</template>

<script setup lang='ts'>
    import { onMounted, watch } from 'vue';
    type Item = {
        name:string,
        state:boolean|"mid"|"disabled",
        child?:Item[],
        [key:string]:any,
    }

    const {item,parent} = defineProps<{item:Item,parent?:Item}>()
    const emit = defineEmits(["choose"])

    //防止递归
    let isUpdate = false
    onMounted(()=>{
        //当前元素状态被修改时，修改子元素的状态
        watch(()=>item.state,()=>{
            if(isUpdate)return;
            isUpdate = true
            const children = item.child
            if(!children || children.length==0)return;
            if(item.state == true){
                children.map((child)=>{
                    child.state = true
                })
            }
            else if(item.state == false){
                children.map((child)=>{
                    child.state = false
                })
            }
            isUpdate = false
        })
        //子元素状态被修改时，修改当前元素的状态
        watch(()=>item.child,()=>{
            if(isUpdate)return;
            isUpdate = true
            const children = item.child
            if(!children || children.length==0)return;
            const childrenState = children.map((child)=>child.state)
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
            isUpdate = false
        },{
            deep:true
        })
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