<template>
<div class="createTimeLine">
    <div class="chooseTargetType">选择类型:
        <ElSelect v-model="targetType">
            <ElOption 
                v-for="item in targetTypeList" 
                :value="item.value"
                :label="item.label">
            </ElOption>
        </ElSelect>
    </div>
    <div class="chooseTarget" @click="chooseTarget">
        点击弹出弹窗，选择相应的事物/文章
        选择一个事物再选择其某个关联属性
    </div>
    <div>起始单位</div>
    <div>结束单位</div>
    <div>起始时间值
        <DownLineInput v-model="startTime"></DownLineInput>
    </div>
</div>
</template>

<script setup lang='ts'>
    import DownLineInput from '@/components/other/input/downLineInput.vue';
import { showPopUp } from '@/hooks/pages/popUp';
import { ElOption, ElSelect } from 'element-plus';
import { computed, ref, shallowRef } from 'vue';
import ChooseExitence from './ChooseExitence/ChooseExitence.vue';
import ChooseArticle from './ChooseArticle/ChooseArticle.vue';
import ChooseStatus from './ChooseStatus/ChooseStatus.vue';
    const targetTypeList = [
        {value:"exitence",label:"事物"},
        {value:"status",label:"事物属性"},
        {value:"article",label:"文章"},
    ]
    type TargetType = "exitence"|"status"|"article"
    const targetType = ref<TargetType>("exitence")
    
    //目标对象列表
    const targetList = ref<{
        sourceKey:string[],
        targetKey:string[]
    }[]>([])
    //目标属性：适用于文章or事物属性
    const timeStatusKey = ref<string>("")
    //通过弹窗选择指定类型的对象
    function chooseTarget(){
        switch(targetType.value){
            //选择事物
            case "exitence":
            showPopUp({
                vue:shallowRef(ChooseExitence),
                buttons:null,
                mask:true,
                returnValue:(list)=>{
                    //获取targetList
                    targetList.value = list
                }
            })
            break;
            //选择文章
            case "article":
            showPopUp({
                vue:shallowRef(ChooseArticle),
                buttons:[],
                mask:true,
                returnValue:(targetStatus,list)=>{
                    targetList.value = list
                    timeStatusKey.value = targetStatus
                }
            })
            break;
            //选择单个事物与指定的关联属性
            case "status":
            showPopUp({
                vue:shallowRef(ChooseStatus),
                buttons:[],
                mask:true,
                returnValue:(target)=>{
                    console.log(target)
                }
            })
            break;
        }
    }
    //仅在选择事物属性时有效，列出指定事物属性中可以被选为时间属性子属性
    const statusKeyList = computed(()=>{
        //否则可选项为目标中存在时间类属性
        
    })
    //起始时间值
    const startTime = ref(0)
</script>

<style scoped lang='scss'>

</style>
