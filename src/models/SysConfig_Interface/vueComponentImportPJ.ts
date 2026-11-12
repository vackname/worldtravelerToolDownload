import {templateObj} from "./vueComponent";

/** 專案樣版注冊 物件 注冊data */
interface AsyncFunProjectTemp
{
    (obj:templateObj<any,any>):void,
}

/** 載入樣版 mark */
interface objPJfunLoad
{
    /** 開始載入樣版 
     * @param fun 開始載入樣版階段 運行function
     */
    toLoad:(fun?:Function)=>void
}

/** 專案樣版注冊 */
interface AsyncFunAddTemp
{
    /** 
     * @param TempName 注冊樣版名
     * @param Project 專案樣版注冊 物件 注冊data
     */
    (TempName:string,Project:AsyncFunProjectTemp):objPJfunLoad
}

/**
 * load async function
*/
interface AsyncFun
{
    /**
     * @param InsertTemp 注入樣版
     * @param e type =(complete = 載入成功！)(fail = 載入失敗！)
    */
    (InsertTemp:AsyncFunAddTemp,e:string):void
}

/**
 *  project name(function)
*/
export default interface objPJFun{
    /**
     * 載入子專案；可寫回呼，或 await 取得 insert 函式
     * @example const insert = await $t.import.p.aa(); insert("aaTemp", t => t.exportVue(...)).toLoad();
     * 拿到 insert 後必須呼叫 (呼叫前其他樣板載入會等待)
     * @param fun load async function (可省略)
    */
    (fun?:AsyncFun):Promise<AsyncFunAddTemp>;
}
