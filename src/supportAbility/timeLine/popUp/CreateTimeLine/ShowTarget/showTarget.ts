//创建时间线时的中间列表对象，用于显示对象信息
export type TargetList = {
    time:number,//对象的time值
    name://对象的其他信息
}[]
//基本单元
type Target = {
    time:number,
    name:string,
}