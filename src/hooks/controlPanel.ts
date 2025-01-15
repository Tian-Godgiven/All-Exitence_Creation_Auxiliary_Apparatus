import { showPopUp } from "./pages/popUp"

export function showControlPanel(
    control:{
        text:string,
        click:()=>any
    }[],
    returnValue?:()=>any
){
    showPopUp({
        vueName:"showControlPanel",
        mask:true,
        buttons:[],
        props:{
            control
        },
        returnValue,
        "size":{
            height:"auto"
        }
    })
}