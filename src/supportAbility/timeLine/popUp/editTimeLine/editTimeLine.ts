import { showPopUp } from "@/hooks/pages/popUp";
import { ref, shallowRef } from "vue";
import ChooseArticle from '../ChooseArticle/ChooseArticle.vue';
import ChooseExitence from "../ChooseExitence/ChooseExitence.vue";
import ChooseStatus from '../ChooseStatus/ChooseStatus.vue';
import { showTimeLinePopUp, TimeLine } from "../../timeLine";
import { getExitenceByKey, getExitenceStatusByKey, getTypeByKey } from "@/hooks/all-exitence/allExitence";
import { getArticleByKey } from "@/hooks/all-articles/allArticles";

type TargetType = "exitence"|"article"|"status"

//显示创建时间轴弹窗
export const ifShowCreatePage = ref(false)//控制是否显示
export const editTarget = ref<TimeLine|null>(null)
export function showEditTimeLine(targetTimeLine:TimeLine|null){
    showTimeLinePopUp()
    //切换到创建时间轴页面
    editTarget.value = targetTimeLine
    ifShowCreatePage.value = true
}
export function hideEditTimeLine(){
    //切换走创建时间轴页面
    ifShowCreatePage.value = false
}

//当前选择的目标类型
export const targetType = ref<TargetType>("exitence")

//根据目标列表获取key列表，其将存放在timeLine的数据当中
export function getKeyList(type:TargetType,targetList:any){
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
//根据key列表获取显示在编辑页面中的目标列表
export function getTargetList(type:TargetType,key:any){
    switch(type){
        case "exitence":
            return getExitenceList(key)
        case "article":
            return getArticleList(key)
    }

    function getExitenceList(key:{
        sourceKey: string;  // 分类的key
        targetKey: {
            exitenceKey: string;  // 该分类下选中的事物的key
            statusKey: string;    // 事物对应的时间属性的key
        }[];
    }[]){
        //遍历生成目标列表
        const targetList :{
            name:string,//type的名称和key，以及选择的type的时间属性的信息
            key:string,
            status?:{
                name:string,
                key:string
            },
            exitence:{name:string,
                key:string,
                status:{
                    name:string,
                    key:string
                },}[]}[] 
        = key.flatMap(item=>{
            const type = getTypeByKey(item.sourceKey)
            if(!type)return [];
            return {
                name:type.name,
                key:item.sourceKey,
                exitence:item.targetKey.flatMap(targetKey=>{
                    const exitence = getExitenceByKey(type,targetKey.exitenceKey)
                    if(!exitence)return [];
                    const status = getExitenceStatusByKey(targetKey.statusKey,exitence.status,type.typeStatus)
                    if(!status)return []
                    return {
                        name:exitence.name,
                        key:targetKey.exitenceKey,
                        status:{
                            name:status.name,
                            key:targetKey.statusKey
                        }
                    }
                })
            }
            
        })
        return targetList
    }
    function getArticleList(key:{
        sourceKey:string[],
        targetKey:string[]
    }[]){
        //遍历
        const targetList:{
            sourceKey:string[],
            target:{
                name:string
                key:string
            }[]}[]
        = key.flatMap(item=>{
            return {
                sourceKey:item.sourceKey,
                target:item.targetKey.flatMap(articleKey=>{
                    const article = getArticleByKey(item.sourceKey,articleKey)
                    if(!article)return []
                    return {
                        name:article.__key,
                        key:articleKey
                    }
                })
            }
        })
        return targetList
    }
}

//通过弹窗的返回函数获得目标列表+时间规则+最小时间单元
export const targetList = ref<any>([])//目标列表，显示时间轴上的目标对象
export const timeRuleKey = ref("")//时间规则Key
export const minTimeValue = ref(0) //最小时间值
export const timeStatusKey = ref("")//文章类型使用的标识符

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
        timeStatusKey.value = status
        timeRuleKey.value = "date"
        minTimeValue.value = minTime
    }


