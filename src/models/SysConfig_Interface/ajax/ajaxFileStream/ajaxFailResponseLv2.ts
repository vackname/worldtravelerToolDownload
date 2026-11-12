import * as ajaxPB from '../ajaxPublic';
import * as ajaxPBLv3 from './ajaxFailResponseLv3';

/** 回應事件 Fail LV2 Catch */
export interface ResponseEventFailLv2Catch extends ajaxPB.AjaxFileStreamSubmit
{

    /** 回應完成後 容是資訊 事件  */
    Finally:(Fun:ajaxPB.FunFinallyEvent)=>ajaxPBLv3.ResponseEventFailLv2CatchLv3Finally,

    /**
     * 等候超時設定
     * @param setTime 超時設定(單位毫秒)
     * @param overFun 超時 進入 funcion
     */
    OverTimeEvent:(setTime:number,overFun?:(errorMes:string)=>void)=>ajaxPBLv3.ResponseEventFailLv2CatchLv3OverTime,
}

/** 回應事件 Fail LV2 Finally*/
export interface ResponseEventFailLv2Finally extends ajaxPB.AjaxFileStreamSubmit
{
    /** 回應事件 Request/Process 錯誤資訊*/
    Catch:(Fun:ajaxPB.FunCatchEvent)=>ajaxPBLv3.ResponseEventFailLv2FinallyLv3Catch,

    /**
     * 等候超時設定
     * @param setTime 超時設定(單位毫秒)
     * @param overFun 超時 進入 funcion
     */
    OverTimeEvent:(setTime:number,overFun?:(errorMes:string)=>void)=>ajaxPBLv3.ResponseEventFailLv2FinallyLv3OverTime,
}


/** 回應事件 Fail LV2 OverTime */
export interface ResponseEventFailLv2OverTime extends ajaxPB.AjaxFileStreamSubmit
{
    /** 回應事件 Request/Process 錯誤資訊*/
    Catch:(Fun:ajaxPB.FunCatchEvent)=>ajaxPBLv3.ResponseEventFailLv2OverTimeLv3Catch,

    /** 回應完成後 容是資訊 事件  */
    Finally:(Fun:ajaxPB.FunFinallyEvent)=>ajaxPBLv3.ResponseEventFailLv2OverTimeLv3Finally,
}