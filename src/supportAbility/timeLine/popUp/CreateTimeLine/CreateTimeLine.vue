<template>
<div class="createTimeLine">
    <div class="chooseTarget">
        <div class="chooseType">目标类型:
            <ElSelect class="selector" v-model="targetType">
                <ElOption 
                    v-for="item in targetTypeList" 
                    :value="item.value"
                    :label="item.label">
                </ElOption>
            </ElSelect>
        </div>
        <Button name="选择目标" 
            class="showPopUp" 
            @click="chooseTarget">
        </Button>
    </div>
    
    <component v-if="targetList.length>0" class="showTarget" :is="vue" :targets="targetList"></component>

    <div>选择起始单位</div>
    <div>选择结束单位</div>
    <div>起始时间：
        <DownLineInput v-model="startTime" placeholder="默认"></DownLineInput>
    </div>
</div>
</template>

<script setup lang='ts'>
    import DownLineInput from '@/components/other/input/downLineInput.vue';
    import { showPopUp } from '@/hooks/pages/popUp';
    import { ElOption, ElSelect } from 'element-plus';
    import { computed, ref, shallowRef } from 'vue';
    import ChooseExitence from "../ChooseExitence/ChooseExitence.vue"
    import ShowExitence from '../ChooseExitence/ShowExitence.vue';
    import ChooseArticle from '../ChooseArticle/ChooseArticle.vue';
    import ChooseStatus from '../ChooseStatus/ChooseStatus.vue';
    import Button from '@/components/global/Button.vue';
    import ShowArticle from '../ChooseArticle/ShowArticle.vue';
    //选择的目标类型
    const targetTypeList = [
        {value:"exitence",label:"事物"},
        {value:"status",label:"事物属性"},
        {value:"article",label:"文章"},
    ]
    const targetType = ref<"exitence"|"status"|"article">("exitence")

    //选择的目标对象列表
    let targetList = ref([])
    //目标的时间规则，默认为date
    let timeRuleKey = "date"
    //通过弹窗选择指定类型的对象，以及对应选择的时间规则
    function chooseTarget(){
        switch(targetType.value){
            //选择事物
            case "exitence":
            showPopUp({
                vue:shallowRef(ChooseExitence),
                buttons:null,
                mask:true,
                returnValue:(list,timeRule)=>{
                    //获取targetList和时间规则
                    targetList.value = list;
                    timeRuleKey = timeRule
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
                    
                }
            })
            break;
        }
    }

    //显示指定的内容
    const vue = computed(()=>{
        switch(targetType.value){
            case "exitence":
                return ShowExitence
            case "article":
                return ShowArticle
        }
    })

    

    //目标属性：适用于文章or事物属性
    const timeStatusKey = ref<string>("")
    //仅在选择事物属性时有效，列出指定事物属性中可以被选为时间属性子属性
    const statusKeyList = computed(()=>{
        //否则可选项为目标中存在时间类属性
        
    })
    //起始时间值
    const startTime = ref(0)
</script>

<style scoped lang='scss'>
.chooseTarget{
    width: 100%;
    .chooseType{
        display: flex;
        align-items: center;
        .selector{
            width: 200px;
        }
    }
    .showPopUp{
        width: 200px;
        text-align: center;
        border: 3px solid black;
        padding: 5px 10px;
        margin: 20px 0px;
    }
}
</style>
