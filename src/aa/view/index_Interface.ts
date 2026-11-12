import * as interfaceFormat from "../../models/vueTemplateFormat";

/** template Action/methods */
interface ActionFunction
{
    /** 文字 (<json map="tw.aa">) */
    tx?:()=>{ loaded:string, count:string, next:string },
    /** 載入下一層畫面 */
    openNext?:()=>void
}

export interface Action extends interfaceFormat.addVueAction,ActionFunction
{
}

/** view index 數據 */
export interface Data extends ActionFunction
{
    /** 點擊次數 */
    count:number,
    /** 已載入下一層 */
    nextOn:boolean
}
