<template>
    <div class="newGroupRule">
        <!-- 选择条件对象 -->
        <div class="ruleTarget cube">
            <div class="selectTarget">
                <ElCascader class="selector" :teleported="false" v-model="ruleTarget" :options="ruleTargetList"></ElCascader>
            </div>

            <!-- 设置 -->
            <div class="targetSet" :class="have? 'have':''">
                中包含任意一个值满足条件
                <input v-model="have" type="checkbox">
            </div>
        </div>

        <div class="ruleInner">
            <div class="ruleMake">
                <div class="selectSimbol cube">
                <ElSelect
                    v-model="ruleSimbol"
                    placeholder="请选择">
                    <ElOption
                        v-for="item in groupRuleSimbolList"
                        :key="item.value"
                        :label="item.text"
                        :value="item.value"/>
                </ElSelect>
            </div>
            <div class="inputValue cube">
                <downLineInputVue class="inputVue" placeholder="输入规则条件的值" v-model="ruleValue"></downLineInputVue>
            </div>
            </div>
        </div>

        <div class="button" @click="confirm">新建</div>

        
    </div>
</template>

<script setup lang='ts'>
    import { inject, ref } from 'vue';
    import { ElSelect, ElOption, ElCascader } from 'element-plus';
    import Status from '@/interfaces/exitenceStatus';
    import downLineInputVue from '@/components/other/input/downLineInput.vue';
    import { exitenceSettingList } from '@/data/list/settingList/exitenceSettingList';
import { showQuickInfo } from '@/api/showQuickInfo';
import { groupRuleSimbolList } from '@/data/list/groupRuleList';

    //分组所在的分类对象
    const type = inject<any>("type")
    const statusList = type.typeStatus.reduce((arr:any[],status:Status)=>{
        arr.push({label:status.name, value:status.__key})
        return arr
    },[])
    const settingList = exitenceSettingList.reduce((arr:any[],option)=>{
        arr.push({label:option.name, value:option.name})
        return arr
    },[])

    //条件目标和子目标
    const ruleTarget = ref("name")
    //条件目标列表
    const ruleTargetList = [
        {label:"事物名称",value:"name"},
        {label:"事物属性值",value:"status",children:[
            {label:"全部",value:"allStatus"},
            ...statusList,
            {label:"标签",value:"tag"}
        ]},
        {label:"事物设置项",value:"setting",children:settingList},
        {label:"事物属性数量",value:"statusNum"}
    ] 
    

    //条件设置
    const have = ref(false)
    //条件判断符号列表
    const ruleSimbol = ref("==")
    //条件判断值
    const ruleValue = ref("")
    //确认新建该分组规则
    const emits = defineEmits(["createGroupRule"])
    function confirm(){
        //必须要有条件值
        if(ruleValue.value == ""){
            showQuickInfo("请输入规则条件值")
            return false
        }
        let newRule
        //翻译目标对象
        const theTarget = targetToData(ruleTarget.value)
        const ruleInner = ruleSimbol.value + `${ruleValue.value}`
        //为包含模式
        if(have.value){
            newRule = theTarget + ".have(" + ruleInner + ")"
        }
        else{
            newRule = theTarget+ruleInner
        }
        //返回新的规则
        emits("createGroupRule",newRule)
    }
    //把target转换成数据形式
    function targetToData(target:string|string[]){
        //设置返回：setting[设置名]
        if(target[0] == "setting"){
            return "setting["+target[1]+"]"
        }
        //属性返回：[属性的__key].value
        else if(target[0] == "status" ){
            if(target[1] == "tag"){
                return "tag"
            }
            return "["+target[1]+"].value"
        }
        //name直接返回
        return target
    }
</script>

<style scoped lang='scss'>
   

    .newGroupRule{
        box-sizing: border-box;
		width: 100%;
		padding: 10px 20px;
        border: 3px dashed black;

        .ruleTarget{
            .selectTarget{
                display: flex;
                .selector{
                    .el-cascader-menu{
                        min-width: auto;
                    }
                }
            }
            
            .targetSet{
                color: rgb(130, 130, 130);
            }
            .targetSet.have{
                color:black
            }
        }
        
        .ruleInner{
            .ruleMake{
                display: flex;
                width: 100%;
                .cube{
                    width: 50%;
                    height: 2rem;
                    position: relative;
                    margin-right: 30px;
                    .inputVue{
                        position: absolute;
                        bottom: 0;
                    }
                }
            }
        }

        .button{
            
            text-align: center;
            width: 20%;
            margin: 10px;
            margin-left: auto;
            padding: 5px 15px;
            border: 3px solid black;
        }
            
    }
</style>