//根据目标列表获取key列表，其将存放在timeLine的数据当中
export function getTargetKeyList(type:"exitence"|"article"|"status",targetList:any){
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