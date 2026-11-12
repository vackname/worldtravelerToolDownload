/** get function to code value*/
interface getCode
{
    /**
     * runing source code
     * @param funStr runing source function
     * @returns code value
    */
    (funStr:string):string
}

/** function to code value add browser history*/
interface addHistory
{
    /**
     * runing source code
     * @param funStr runing source function
    */
    (funStr:string):void
}

/** 網址參數 (值皆為字串) */
export interface urlHistoryParams
{
    [key:string]:string
}

/**
 * 以網址記錄頁面狀態 / 傳送參數：#!<名稱>?<key>=<value>
 * 例：urlHistory.on("tour", p=>open(Number(p.id))); urlHistory.push("tour",{id:12}) → #!tour?id=12
 */
export default interface urlHistory
{
    /**
     * 註冊處理函式 (白名單：只有註冊過的名稱會被呼叫)；目前網址正好是這個名稱時立即執行
     * @param name 名稱 (網址 #!<name>)
     * @param fun 收到網址參數 (值皆為字串)
     */
    on:(name:string,fun:(params:urlHistoryParams)=>void)=>urlHistory,
    /** 新增一筆歷史並改網址 #!<name>?k=v (上一頁 / 下一頁、重新整理時呼叫 on 註冊的函式) */
    push:(name:string,params?:{[key:string]:string|number|boolean})=>void,
    /** 取代目前網址 (不新增歷史) */
    replace:(name:string,params?:{[key:string]:string|number|boolean})=>void,
    /** 產生錨點字串，可用於 <a href> */
    link:(name:string,params?:{[key:string]:string|number|boolean})=>string,
    /** 解析目前網址：{name, params} 或 null */
    parse:()=>{name:string,params:urlHistoryParams}|null,
    /** 啟動 (init/main.ts urlHistoryRuning 預設自動啟動) */
    runing:()=>void,

    /** 舊格式相容：允許網址 #-as- 呼叫 appThis.<name>(JSON 參數) */
    allow:(name:string)=>urlHistory,
    /** 舊格式：函式呼叫字串 → #-as- 網址 */
    get:getCode,
    /** 舊格式：記錄函式呼叫 (需 on / allow 登記才會執行) */
    add:addHistory
    /** 舊格式：記錄入口頁 appThis 的函式 (需 urlHistory.allow 登記函式名才會執行) */
    addJoinApp:addHistory
}
