import { vueObjBest,vueModeMethods } from "./vueComponent";
import {PropsObj} from "./vueComponentProps";

/** 程序初始化完成(生命周期 注冊共用域) */
interface vueExtendsCompleted<T>
{
    /**
     * @param $t VueTemplate<T?> 樣版 extends
     */
    ($t:T):void
}

/** 共用 組件 component */
export default interface pubComponentObj<T2> extends vueObjBest<T2>
{
    /** 註冊 外部繼承 變數(參數 key 於Html 皆為 caselower | boolean=false=自動繼承參數) | 不使用 props=自動繼承參數 */
    props?: PropsObj | Array<string> | boolean,
    /** vueModel get/set 運算 function/methods */
    action?:($t:T2)=>vueModeMethods,
    /** 程序初始化完成(生命周期) */
    completed?:vueExtendsCompleted<T2>
}