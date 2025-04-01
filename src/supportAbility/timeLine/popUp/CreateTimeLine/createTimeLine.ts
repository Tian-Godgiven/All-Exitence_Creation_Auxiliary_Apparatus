import { showPopUp } from "@/hooks/pages/popUp"
import { ref, shallowRef } from "vue"
import ChooseExitence from "../ChooseExitence/ChooseExitence.vue"
import ChooseArticle from '../ChooseArticle/ChooseArticle.vue';
import ChooseStatus from '../ChooseStatus/ChooseStatus.vue';
import { ChooseExitenceList, getSelectionExitence } from "../ChooseExitence/chooseExitence";

type TargetType = "exitence"|"article"|"status"

//当前选择的目标类型
export const targetType = ref<TargetType>("exitence")

//根据目标列表获取key列表，其将存放在timeLine的数据当中
export function getTargetKeyList(type:TargetType,targetList:any){
    switch(type){
        case "exitence":
            return getExitenceList(targetList)
        
    }

    function getExitenceList(targetList:{
        key:string,//分类的key
        exitence:{
            key:string,//事物的key
            status:{
                key:string//属性的key
            }
        }[],
    }[]){
        //遍历
        return targetList.map(type=>{
            return {
                sourceKey:type.key,
                targetKey:type.exitence.map(exitence=>{
                    return {
                        exitenceKey:exitence.key,
                        statusKey:exitence.status.key
                    }
                })
            }
            
        })
    }
}

//通过弹窗的返回函数获得目标列表+时间规则+最小时间单元
export const targetList = ref<any>([])//目标列表
export const timeRuleKey = ref("")//时间规则Key
export const minTimeValue = ref(0) //最小时间值
//通过弹窗选择目标，时间规则，并获取其中最小时间值，对应类型的获取函数见下方
export function chooseTarget(){
    let vue
    let returnValue = (...args:any[])=>{}
    switch(targetType.value){
        case "exitence":
            vue = shallowRef(ChooseExitence)
            break;
        case "article":
            vue = shallowRef(ChooseArticle)
            // returnValue = (targetStatus,list)=>{
            //     targetList.value = list
            //     timeStatusKey.value = targetStatus
            //     timeRuleKey.value = "date"
            // }
            break;
        //选择单个事物与指定的关联属性
        case "status":
            vue = shallowRef(ChooseStatus);
            returnValue = ()=>{
                
            }
            break;
    }
    showPopUp({
        vue,
        buttons:null,
        mask:true,
        returnValue
    })
}

    //事物类型返回的函数

    //事物类型返回的内容
    export function returnValue_Exitence(list:ChooseExitenceList,newTimeRuleKey:string){
        //选中的事物类型列表即为目标列表targetList，其也会提供最小时间值
        const result = getSelectionExitence(list)
        targetList.value = result.targetList
        minTimeValue.value = result.minTimeValue
        timeRuleKey.value = newTimeRuleKey
    }

