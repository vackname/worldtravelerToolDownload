import * as ajaxPB from '../ajaxPublic';

/** 回應事件 Finally Lv2 Fail Lv3 Catch*/
export interface ResponseEventFinallyLv2FailLv3Catch extends ajaxPB.AjaxJsonSubmit
{    
    /**
     * 等候超時設定
     * @param setTime 超時設定(單位毫秒)
     * @param overFun 超時 進入 funcion
     */
    OverTimeEvent:(setTime:number,overFun?:(errorMes:string)=>void)=>ajaxPB.AjaxJsonSubmit,
}

/** 回應事件 Finally Lv2 Fail Lv3 OverTime*/
export interface ResponseEventFinallyLv2FailLv3OverTime extends ajaxPB.AjaxJsonSubmit
{    
    /** 回應事件 Request/Process 錯誤資訊*/
    Catch:(Fun:ajaxPB.FunCatchEvent)=>ajaxPB.AjaxJsonSubmit,
}

/** 回應事件 Finally Lv2 Catch Lv3 Fail*/
export interface ResponseEventFinallyLv2CatchLv3Fail extends ajaxPB.AjaxJsonSubmit
{
    /**
     * 等候超時設定
     * @param setTime 超時設定(單位毫秒)
     * @param overFun 超時 進入 funcion
     */
    OverTimeEvent:(setTime:number,overFun?:(errorMes:string)=>void)=>ajaxPB.AjaxJsonSubmit,
}

/** 回應事件 Finally Lv2 Catch Lv3 OverTime*/
export interface ResponseEventFinallyLv2CatchLv3OverTime extends ajaxPB.AjaxJsonSubmit
{
    /** 回應事件 程序 Fail */
    Fail:(Fun:()=>void)=>ajaxPB.AjaxJsonSubmit,
}

/** 回應事件 Finally Lv2 OverTime Lv3 Fail*/
export interface ResponseEventFinallyLv2OverTimeLv3Fail extends ajaxPB.AjaxJsonSubmit
{   
    /** 回應事件 Request/Process 錯誤資訊*/
    Catch:(Fun:ajaxPB.FunCatchEvent)=>ajaxPB.AjaxJsonSubmit,
}

/** 回應事件 Finally Lv2 OverTime Lv3 Catch*/
export interface ResponseEventFinallyLv2OverTimeLv3Catch extends ajaxPB.AjaxJsonSubmit
{
    /** 回應事件 程序 Fail */
    Fail:(Fun:()=>void)=>ajaxPB.AjaxJsonSubmit,
}