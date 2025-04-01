import { showPopUp } from "@/hooks/pages/popUp"
import { ref, shallowRef } from "vue"
import ChooseExitence from "../ChooseExitence/ChooseExitence.vue"
import ChooseArticle from '../ChooseArticle/ChooseArticle.vue';
import ChooseStatus from '../ChooseStatus/ChooseStatus.vue';

type TargetType = "exitence"|"article"|"status"

//当前选择的目标类型
export const targetType = ref<TargetType>("exitence")

//根据目标列表获取key列表，其将存放在timeLine的数据当中
export function getTargetKeyList(type:TargetType,targetList:any){
    switch(type){
        case "exitence":
            return getExitenceList(targetList)
        case "article":
            return getArticleList(targetList)
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
    function getArticleList(targetList:{
        sourceKey:string[],
        target:{
            name:string
            key:string
        }[]
    }[]){
        //遍历
        return targetList.map(item=>{
            return {
                sourceKey:item.sourceKey,
                targetKey:item.target.map(article=>{
                    return article.key
                })
            }
        })
    }
}

//通过弹窗的返回函数获得目标列表+时间规则+最小时间单元
export const targetList = ref<any>([])//目标列表
export const timeRuleKey = ref("")//时间规则Key
export const minTimeValue = ref(0) //最小时间值
export const targetStatus = ref("")//文章类型使用的标识符

//通过弹窗来获取上述值，具体的获取函数见下方
export function chooseTarget(){
    const componentMap = {
        "exitence": ChooseExitence,
        "article": ChooseArticle,
        "status": ChooseStatus
    };
    const vue = shallowRef(componentMap[targetType.value]);
    if(vue.value) {
        showPopUp({
            vue,
            buttons: null,
            mask: true,
        });
    }
}

    //事物类型返回的内容
    export function returnValue_Exitence(list:any,newTimeRuleKey:string,minTime:number){
        //选中的事物类型列表即为目标列表targetList，其也会提供最小时间值
        targetList.value = list
        minTimeValue.value = minTime
        timeRuleKey.value = newTimeRuleKey
    }

    //文章类型返回的内容
    export function returnValue_Article(list:any,status:string,minTime:number){
        targetList.value = list
        targetStatus.value = status
        timeRuleKey.value = "date"
        minTimeValue.value = minTime
    }
