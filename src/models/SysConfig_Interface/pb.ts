import {elAnimateMain} from "./animate";
/**
 * client browser/解析 browser info
*/
interface browser
{
    /** 瀏覽器 */
    browser:string,
    /** 
     * 版本
    */
    version:string,
    /**
     * 系統name：Windows / Mac / iPhone/iPod / webOS / Android/Linux / BlackBerry ...
     */
    OS:string,
    /**
     * browser 語系
    */
    lang:string
}

/**
 * 判讀是不是行動裝置 (boolean)
 * 例：if(pb.isMobile.any()) { ... }
*/
interface isMobile{
    /** Android */
    Android:()=>boolean,
    /** BlackBerry */
    BlackBerry:()=>boolean,
    /** iPhone / iPad / iPod (含 iPadOS 13+ 以 Mac 身分回報的 iPad) */
    iOS:()=>boolean,
    /** Opera Mini */
    Opera:()=>boolean,
    /** Windows 行動裝置 (IEMobile) */
    Windows:()=>boolean,
    /** LG webOS (電視、Palm 手機) */
    webOS:()=>boolean,
    /** 以上任一 */
    any:()=>boolean,
}

/**
 * browser 解析 format
 */
interface BrowserInfo
{
    /**
     * 語系
    */
    lang:string,
    /**
     * 廠商
    */
    vendor:string,
    userAgent:string,
    /**
     * 版本
    */
    appVersion:string,
    /**
     * os 平台
    */
    platform:string
}

/** 檢測 物件型態 */
interface tryParse
{
    /**
     * @param object 驗證物件
    */
    (object:any):boolean
}

export default interface pb
{
    /** tryparse char for string */
    isString:tryParse,
    /** tryparse char for Number */
    isNumber:tryParse,
    /** tryparse class or function */
    isFuncOrClass:tryParse,
    /** tryparse new class or event of object */
    isObject:tryParse,
    /** tryparse boolean */
    isBoolean:tryParse,
    /** tryparse null or undefined*/
    isNaN:tryParse,
    /** tryparse Array */
    isArray:tryParse,
    /** 判斷是不是為mible */
    isMobile:isMobile,
    /** 是否為Debug 模式 */
    debug:boolean,
    /** 金額三位一點 
     * @param val cash
     * @returns cash ex:1,000
    */
    MoneyFormat:(val:number)=>string,
    /**
     * date to unix
     * @param val date ex:"2000-01-01 18:00:00" or "2000/01/01 18:00:00" 
     * @returns unix time
     */
    unixRe:(val:string)=>number,
    /**
     * unix to date string
     * @param val date unix
     * @returns date to string ex:"2000/01/01 18:00:00" 
     */
    reunixDate:(val:number)=>string,
    /**
     * now unix time(client)
     */
    unixReNow:()=>number,
    /**
     * add cookie
     * @param name cookie name
     * @param value value
     * @param geTimeval life time(unit:1 equals sec)
     */
    LogindoCookieSetup:(name:string, value:string,geTimeval?:number)=>void,
    /**
     * cookie value
     * @param name cookie name
     */
    LogingetCookie:(name:string)=>string,

    /**
     * cookie delete
     * @param name cookie name
     */
    LogindelCookie:(name:string)=>string,

    /** 壓縮字串 */
    lzStrCompress:(val:string)=>string,
    /** 解壓縮字串 */
    lzStrDecompress:(val:string)=>string,
    /**
     * client browser
    */
     browserInfo:(info?:BrowserInfo)=>browser,
     /**
      * base64(support url string) to unzip
      * @param base64Val base64 string
      * @returns string value
      */
     ungzipBase64:(base64Val:string)=>string,

     /**
      * gzip to url  base64 of string
      * @param data string value
      * @returns base64
      */
     gzipBase64:(data:string)=>string,

     /**
      * string to url base64 of string
      * @param data string value
      * @returns base64
     */
     UTF8ToBase64:(data:string)=>string,

     /**
      * base64(support url string) to string
      * @param base64Val base64 string
      * @returns string value
     */
     Base64ToUTF8:(base64Val:string)=>string,
     
     /**
      * html element(css animate)
     */
     el:elAnimateMain,

     /**
      * join json object prototype
      * @param now 被注入 json 物件
      * @param json 取得資料源 物件
     */
     AddPrototype:<T>(now:any,json:any)=>T,
}