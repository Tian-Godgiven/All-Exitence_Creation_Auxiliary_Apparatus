<template>
    <div class="newGroupRule">
        <!-- 选择条件对象 -->
        <div class="selectTarget cube" >
            <ElSelect
                @change="targetChange"
                v-model="ruleTarget"
                placeholder="请选择">
                <ElOption
                    v-for="item in ruleTargetList"
                    :key="item.value"
                    :label="item.text"
                    :value="item.value"/>
            </ElSelect>
            <!-- 选择子级目标 -->
            <ElSelect
                v-show="ruleTarget != 'name'"
                v-model="ruleSecondTarget"
                placeholder="请选择">
                <ElOption
                    v-for="item in ruleSecondTargetList"
                    :key="item.value"
                    :label="item.text"
                    :value="item.value"/>
            </ElSelect>
        </div>

        <div class="right">
            <div class="selectSimbol cube">
                <ElSelect
                    v-model="ruleSimbol"
                    placeholder="请选择">
                    <ElOption
                        v-for="item in ruleSimbolList"
                        :key="item.value"
                        :label="item.text"
                        :value="item.value"/>
                </ElSelect>
            </div>
            <div class="inputValue cube">
                <downLineInputVue class="inputVue" placeholder="输入值" v-model="ruleValue"></downLineInputVue>
            </div>
        </div>

        
    </div>
</template>

<script setup lang='ts'>
    import { inject, ref, computed } from 'vue';
    import { ElSelect, ElOption } from 'element-plus';
    import Status from '@/interfaces/exitenceStatus';
    import downLineInputVue from '@/components/other/input/downLineInput.vue';
    import { exitenceSettingList } from '@/data/list/exitenceSettingList';

    const type = inject<any>("type")

    //条件目标和子目标
    const ruleTarget = ref("name")
    const ruleSecondTarget = ref()
    //条件目标列表
    const ruleTargetList = [
        {text:"事物名称",value:"name"},
        {text:"事物属性值",value:"status"},
        {text:"事物设置项",value:"setting"}
    ] 
    function targetChange(){
        ruleSecondTarget.value = ruleSecondTargetList.value ? ruleSecondTargetList.value[0].value : null
    }
    //子目标列表
    const ruleSecondTargetList = computed(()=>{
        if(ruleTarget.value == "status"){
            return [{text:"所有属性",value:"allStatus"},
                        ...statusList
                    ]
        }
        else if(ruleTarget.value == "setting"){
            return settingList
        }
    })
    const statusList = type.typeStatus.reduce((arr:any[],status:Status)=>{
        arr.push({text:status.name, value:status.__key})
        return arr
    },[])
    const settingList = exitenceSettingList.reduce((arr:any[],option)=>{
        arr.push({text:option.name, value:option.name})
        return arr
    },[])

    //条件判断符号列表
    const ruleSimbol = ref("==")
    const ruleSimbolList = [
        {text:"=",value:"=="},
        {text:"不等于",value:"!="},
        {text:"数值大于",value:">"},
        {text:"数值小于",value:"<"},
        {text:"文本长度大于",value:">>"},
        {text:"文本长度小于",value:"<<"},
        {text:"中包含",value:"have"}
    ]

    //条件判断值
    const ruleValue = ref("")
</script>

<style scoped lang='scss'>
   

    .newGroupRule{
        display: flex;
        height: 4rem;
        .selectTarget{
            width: 50%;
        }
        .right{
            width: 50%;
            height: 100%;
            .cube{
                height: 50%;
                position: relative;
                .inputVue{
                    position: absolute;
                    bottom: 0;
                }
            }
        }
        
    }
</style>