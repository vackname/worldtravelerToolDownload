import * as ajaxPB from './ajaxPublic';
import ResponseEventFail from './ajaxGet/ajaxFailResponse';
import ResponseEventCatch from './ajaxGet/ajaxCatchResponse';
import ResponseEventFinally from './ajaxGet/ajaxFinallyResponse';
import ResponseEventOverTime from './ajaxGet/ajaxOverTimeResponse';

interface ajaxThenInput extends ajaxPB.AjaxSubmit
{

    /** 回應事件 Fail */
    Fail:(Fun:()=>void)=>ResponseEventFail,

    /** 回應事件 Request/Process 錯誤資訊*/
    Catch:(Fun:ajaxPB.FunCatchEvent)=>ResponseEventCatch,

    /** 回應完成後 容量資訊 事件  */
    Finally:(Fun:ajaxPB.FunFinallyEvent)=>ResponseEventFinally,
    
    /**
     * 等候超時設定
     * @param setTime 超時設定(單位毫秒)
     * @param overFun 超時 進入 funcion
     */
    OverTimeEvent:(setTime:number,overFun?:(errorMes:string)=>void)=>ResponseEventOverTime,

    /**
     * send data (json object)
     */
    input:<T>(json:T)=>ajaxThenInput,
}

/**
 * 僅限 get 使用
*/
export default interface ajaxThen extends ajaxPB.AjaxSubmit
{
    /** 回應事件 Fail */
    Fail:(Fun:()=>void)=>ResponseEventFail,

    /** 回應事件 Request/Process 錯誤資訊*/
    Catch:(Fun:ajaxPB.FunCatchEvent)=>ResponseEventCatch,

    /** 回應完成後 容量資訊 事件  */
    Finally:(Fun:ajaxPB.FunFinallyEvent)=>ResponseEventFinally,
 
    /**
     * 等候超時設定
     * @param setTime 超時設定(單位毫秒)
     * @param overFun 超時 進入 funcion
     */
    OverTimeEvent:(setTime:number,overFun?:(errorMes:string)=>void)=>ResponseEventOverTime,

    /**
     * send data (json object)
     */
    input:<T>(json:T)=>ajaxThenInput,

    /**
     * authz bearer
     * @param token jwt token
     * @returns 
     */
    AuthzBearer:(token:string)=>ajaxThen,

    /**
    * send web head (json object)
    */
    head:<T>(json:T)=>ajaxThen
}