import * as ajaxPB from '../ajaxPublic';
import * as ajaxPBLv3 from './ajaxFinallyResponseLv3';

/** 回應事件 Finally Lv2 Fail*/
export interface ResponseEventFinallyLv2Fail extends ajaxPB.AjaxFileStreamSubmit
{    
    /** 回應事件 Request/Process 錯誤資訊*/
    Catch:(Fun:ajaxPB.FunCatchEvent)=>ajaxPBLv3.ResponseEventFinallyLv2FailLv3Catch,

    /**
     * 等候超時設定
     * @param setTime 超時設定(單位毫秒)
     * @param overFun 超時 進入 funcion
     */
    OverTimeEvent:(setTime:number,overFun?:(errorMes:string)=>void)=>ajaxPBLv3.ResponseEventFinallyLv2FailLv3OverTime,
}

/** 回應事件 Finally Lv2 Catch*/
export interface ResponseEventFinallyLv2Catch extends ajaxPB.AjaxFileStreamSubmit
{
    /** 回應事件 程序 Fail */
    Fail:(Fun:()=>void)=>ajaxPBLv3.ResponseEventFinallyLv2CatchLv3Fail,

    /**
     * 等候超時設定
     * @param setTime 超時設定(單位毫秒)
     * @param overFun 超時 進入 funcion
     */
    OverTimeEvent:(setTime:number,overFun?:(errorMes:string)=>void)=>ajaxPBLv3.ResponseEventFinallyLv2CatchLv3OverTime,
}

/** 回應事件 Finally Lv2 OverTime*/
export interface ResponseEventFinallyLv2OverTime extends ajaxPB.AjaxFileStreamSubmit
{
    /** 回應事件 程序 Fail */
    Fail:(Fun:()=>void)=>ajaxPBLv3.ResponseEventFinallyLv2OverTimeLv3Fail,
    
    /** 回應事件 Request/Process 錯誤資訊*/
    Catch:(Fun:ajaxPB.FunCatchEvent)=>ajaxPBLv3.ResponseEventFinallyLv2OverTimeLv3Catch,
}