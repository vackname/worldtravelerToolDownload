import * as interfaceFormat from "../../models/vueTemplateFormat";
import type indexMainModel from "../model/indexTsc/main";

/** template watch */
export interface Watch extends interfaceFormat.addVueWatch
{
}

/** template computed */
export interface Computed extends interfaceFormat.addVueComputedFormat
{
    /** 總價 = 人數 × 單價 */
    total:interfaceFormat.toVueComputedGetForFunction
}

/** template Filter */
export interface Filter extends interfaceFormat.addVueFilterFunctionFormat
{
}

/** 注入的 model (discreteModelLoad 載入後才有，需加 ?) */
interface joinModeldownFormat
{
    /** 首頁商業邏輯 (model/indexTsc) */
    $m?:indexMainModel
}

/** controllers index 數據 */
export interface Data extends joinModeldownFormat
{
    /** 雙向綁定：名字 */
    name:string,
    /** 計算：人數、單價 */
    qty:number, price:number,
    /** model：抽到的目的地 */
    place:string,
    /** 自訂指令：輸入文字 */
    cmdText:string,
    /** task：目前步驟 (0 = 未開始，x.5 = 進行中，3 = 完成) */
    taskStep:number,
    /** 子專案：""、loading、loaded */
    aaState:string,
    /** urlHistory：從網址讀到的值 */
    urlFrom:string,
    /** models 套件：產生的 JWT */
    jwt:string,
    /** 總價 (funComputed) */
    total?:number
}
