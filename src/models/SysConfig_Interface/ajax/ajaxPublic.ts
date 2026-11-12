import {TaskFactoryObj} from "../Task";

/**
 * @param re response data
 * @param sendData send Data
 * @param url Api url
*/
type asyncTp = (re:string,sendData?:any,url?:string)=>void;

/** ajax catch then response for any value*/
interface ajaxToCatchResFun
{
    /** return ajax 錯誤資訊
     * @param re return get if(status<>200,readyState=XMLHttpRequest.DONE=4)
     */
    (re:any):void
}

/**
 * async response data
*/
export interface Response
{
    /**
     * @param fun response function (未使用Catch 事件=預設=錯誤將不理會而重新連線3次)
    */
    (fun:asyncTp):TaskFactoryObj;
}

/**
 * async ungzip response data to json
*/
export interface ResponseJson
{
    /**
     * @param fun response function (未使用Catch 事件=預設=錯誤將不理會而重新連線3次)
    */
    <T>(fun:(re:T,sendData?:any,url?:string)=>void):TaskFactoryObj;
}

/**
 * async response data to json
*/
export interface ResponseForKeyJson
{
    /**
     * @param fun response function (未使用Catch 事件=預設=錯誤將不理會而重新連線3次)
     * @param key unzip api key
    */
    <T>(key:string,fun:(re:T,sendData?:any,url?:string)=>void):TaskFactoryObj;
}

/**
 * catch event
*/
export interface CatchEventInfo
{
    /**
    * 0	UNSENT	Client has been created. open() not called yet.
    * 1	OPENED	open() has been called.
    * 2	HEADERS_RECEIVED	send() has been called, and headers and status are available.
    * 3	LOADING	Downloading; responseText holds partial data.
    * 4	DONE	The operation is complete.
    */
    readyState: number,
    /** server response status*/
    status: number
}

/**
 * catch response
*/
export interface FunCatchEvent
{
    (event:CatchEventInfo):void
}
/** 
 * 事件結束 Event Response
 */
export interface FinallyEventInfo
{
    ContentLength:number,
    TotalBytes:number
}

/** 
 * 事件結束 Event
 */
export interface FunFinallyEvent
{
    (event:FinallyEventInfo):void
}

/** ajax Sumbit */
interface AjaxBestSumbit
{
    /**
     * 啟動API
     */
    toSubmit:()=>TaskFactoryObj,
}

/**
 * ajax File Stream Submit
*/
export interface AjaxFileStreamSubmit extends AjaxBestSumbit
{
    
    /**
     * response = 回應資料 (fileStream=base64)
     */
    toStreamBase64Response:Response,
}

/**
 * ajax json body Submit
*/
export interface AjaxJsonSubmit extends AjaxBestSumbit
{
    /**
     * response = 回應資料 data to json object
     */
    toResponse:ResponseJson,

    /**
     * ungzip response = 回應資料 data to json object
     * @param key ungzip response API key
     */
    toUnGzipForKeyResponse:ResponseForKeyJson,

    /**
     *  ungzip response = 回應資料 data to json object
     */
    toUnGzipResponse:ResponseJson,
}

/**
 * ajax Submit
*/
export interface AjaxSubmit extends AjaxJsonSubmit
{
    /**
     * response = 回應資料data to string
     */
    toStringResponse:Response,
}