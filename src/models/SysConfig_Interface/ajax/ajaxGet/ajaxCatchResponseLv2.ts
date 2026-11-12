import * as ajaxPB from '../ajaxPublic';
import * as ajaxPBLv3 from './ajaxCatchResponseLv3';

/** 回應事件 Catch LV2 Fail */
export interface ResponseEventCatchLv2Fail extends ajaxPB.AjaxSubmit
{

    /** 回應完成後 容是資訊 事件  */
    Finally:(Fun:ajaxPB.FunFinallyEvent)=>ajaxPBLv3.ResponseEventCatchLv2FailLv3Finally,

    /**
     * 等候超時設定
     * @param setTime 超時設定(單位毫秒)
     * @param overFun 超時 進入 funcion
     */
    OverTimeEvent:(setTime:number,overFun?:(errorMes:string)=>void)=>ajaxPBLv3.ResponseEventCatchLv2FailLv3OverTime,
}

/** 回應事件 Catch LV2 Finally*/
export interface ResponseEventCatchLv2Finally extends ajaxPB.AjaxSubmit
{
    /** 回應事件 程序 Fail */
    Fail:(Fun:()=>void)=>ajaxPBLv3.ResponseEventCatchLv2FinallyLv3Fail,

    /**
     * 等候超時設定
     * @param setTime 超時設定(單位毫秒)
     * @param overFun 超時 進入 funcion
     */
    OverTimeEvent:(setTime:number,overFun?:(errorMes:string)=>void)=>ajaxPBLv3.ResponseEventCatchLv2FinallyLv3OverTime,
}


/** 回應事件 Catch LV2 OverTime */
export interface ResponseEventCatchLv2OverTime extends ajaxPB.AjaxSubmit
{
    /** 回應事件 程序 Fail */
    Fail:(Fun:()=>void)=>ajaxPBLv3.ResponseEventCatchLv2OverTimeLv3Fail,

    /** 回應完成後 容是資訊 事件  */
    Finally:(Fun:ajaxPB.FunFinallyEvent)=>ajaxPBLv3.ResponseEventCatchLv2OverTimeLv3Finally,
}