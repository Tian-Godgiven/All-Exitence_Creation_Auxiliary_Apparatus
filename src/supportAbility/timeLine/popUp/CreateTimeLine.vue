<template>
    <div>
        <div>选择类型:
            <ElSelect v-model="targetType">
                <ElOption 
                    v-for="item in targetTypeList" 
                    :value="item.value"
                    :label="item.label">
                </ElOption>
            </ElSelect>
        </div>
        <div @click="chooseTarget">点击弹出弹窗，选择相应的事物/文章/亦或者选择一个事物再选择其某个关联属性</div>
        <div>选择属性/文章选择创建时间or更新时间</div>
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
import { computed, ref } from 'vue';
    const targetType = ref("exitence")
    const targetTypeList = [
        {value:"exitence",label:"事物"},
        {value:"article",label:"文章"},
        {value:"status",label:"事物属性"}
    ]
    //点击选择目标
    function chooseTarget(){
        showPopUp({
            vueName:"chooseInAllExitence",
            buttons:null,
            mask:true,
            props:{
                targetType:"group",
                chooseRange:"all"
            },
            returnValue:(targetList)=>{
                console.log(targetList)
            }
        })
    }
    const targetKey = ref([])
    const statusKeyList = computed(()=>{
        //如果是文章类型则选择“创建时间”或“更新时间”
        if(targetType.value == "arcticle"){
            return [{value:"createTime",label:"创建时间"},
                    {value:"updateTime",label:"更新时间"}]
        }
        //否则可选项为目标中存在时间类属性
        else{

        }
    })
    //起始时间值
    const startTime = ref(0)
</script>

<style scoped lang='scss'>

</style>
