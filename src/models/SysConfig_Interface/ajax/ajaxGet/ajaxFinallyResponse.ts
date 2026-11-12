import * as ajaxPB from '../ajaxPublic';
import * as ajaxLv2 from './ajaxFinallyResponseLv2';

/** 回應事件 Finally */
export default interface ResponseEventFinally extends ajaxPB.AjaxSubmit
{
    /** 回應事件 程序 Fail */
    Fail:(Fun:()=>void)=>ajaxLv2.ResponseEventFinallyLv2Fail,
    
    /** 回應事件 Request/Process 錯誤資訊*/
    Catch:(Fun:ajaxPB.FunCatchEvent)=>ajaxLv2.ResponseEventFinallyLv2Catch,

    /**
     * 等候超時設定
     * @param setTime 超時設定(單位毫秒)
     * @param overFun 超時 進入 funcion
     */
    OverTimeEvent:(setTime:number,overFun?:(errorMes:string)=>void)=>ajaxLv2.ResponseEventFinallyLv2OverTime,
}