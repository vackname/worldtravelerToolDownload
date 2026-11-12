import {jObjInterface,Commandloadimg} from '../../models/vueSDK';

/** 共公變數宣告 */
export default interface pubObj
{
    /** 公共 設定文檔/語系 */
    config:jObjInterface,
    /** 公共圖檔 資源 */
    lib:jObjInterface,
    /** string 目前所選語系 */
    lang:string,
    /** 載入公共圖檔-指令-路徑名 */
    libSrc:(src:string)=>Commandloadimg,
    /** 某年 1–12 月各有幾天 (閏年 2 月 29 天)：daysOfMonth(2028)[1] = 29 */
    daysOfMonth:(year:number)=>Array<number>
}