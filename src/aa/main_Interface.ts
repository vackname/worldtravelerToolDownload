import * as interfaceFormat from "../models/vueTemplateFormat";

/** template Action/methods */
export interface Action extends interfaceFormat.addVueAction
{
}

/** aa 入口數據 */
export interface Data
{
    /** 目前顯示的樣板名 */
    VueName:string
}
