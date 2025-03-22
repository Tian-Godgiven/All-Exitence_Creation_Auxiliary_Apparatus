<template>
    <div class="timeLineItem" :class="index%2==0?'top':'bottom'" @click="clickItem">
        {{ itemLabel }}
    </div>
</template>

<script setup lang='ts'>
    import { computed} from 'vue';
import { TimeLineItem } from './item';
import { getExitenceByKey, getTypeByKey, showExitenceOnPopUp } from '@/hooks/all-exitence/allExitence';

import { showArticleOnMain } from '@/hooks/pages/mainPage/showOnMain';
import { getArticleByKey } from '@/hooks/all-articles/allArticles';
    const {item,type,index} = defineProps<{item:TimeLineItem,type:"exitence"|"article"|"status",index:number}>()
    
    //item显示的内容
    const itemLabel = computed(()=>{
        switch(type){
            //事物显示分类名+事物名
            case "exitence":
                return item.label[0] + "/" + item.label[1]
            //文章显示最近章节名+标题名
            case "article":
                return item.label[0] + "/" + item.label[1]
            //关联属性显示其他属性的值
            case "status":
                return item.label
            default:
                return null
        }
    })
    
    //点击到指定对象显示相关弹窗
    function clickItem(){
        const key = item.key
        //事物弹窗
        if("exitenceKey" in key){
            const type = getTypeByKey(key.typeKey)
            if(!type){
                console.error("未找到分类",key.typeKey)
                return;
            }
            const exitence = getExitenceByKey(type,key.exitenceKey)
            if(!exitence){
                console.error("未找到事物",type,key.exitenceKey)
                return;
            }
            //弹出事物弹窗
            showExitenceOnPopUp(type,exitence)
        }
        //文章弹窗
        else if("articleKey" in key){
            const article = getArticleByKey(key.fromKey,key.articleKey)
            if(!article){
                console.error("未找到文章",key)
                return;
            }
            showArticleOnMain(article)
        }
    }
</script>

<style scoped lang='scss'>
.timeLineItem{
    position: absolute;
    width: 100px;
    height: 120px;
    border: 3px solid black;
    &.top{
        top: -120px; 
    }
    &.bottom{
        top: 0;
    }
}
</style>