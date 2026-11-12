import * as ajaxPB from '../ajaxPublic';

/** 回應事件 Catch LV2 Fail Lv3 Finally*/
export interface ResponseEventCatchLv2FailLv3Finally extends ajaxPB.AjaxJsonSubmit
{

    /**
     * 等候超時設定
     * @param setTime 超時設定(單位毫秒)
     * @param overFun 超時 進入 funcion
     */
    OverTimeEvent:(setTime:number,overFun?:(errorMes:string)=>void)=>ajaxPB.AjaxJsonSubmit,
}

/** 回應事件 Catch LV2 Fail Lv3 OverTime*/
export interface ResponseEventCatchLv2FailLv3OverTime extends ajaxPB.AjaxJsonSubmit
{

    /** 回應完成後 容是資訊 事件  */
    Finally:(Fun:ajaxPB.FunFinallyEvent)=>ajaxPB.AjaxJsonSubmit
}

/** 回應事件 Catch LV2 Finally Lv3 Fail*/
export interface ResponseEventCatchLv2FinallyLv3Fail extends ajaxPB.AjaxJsonSubmit
{

    /**
     * 等候超時設定
     * @param setTime 超時設定(單位毫秒)
     * @param overFun 超時 進入 funcion
     */
    OverTimeEvent:(setTime:number,overFun?:(errorMes:string)=>void)=>ajaxPB.AjaxJsonSubmit,
}

/** 回應事件 Catch LV2 Finally Lv3 OverTime*/
export interface ResponseEventCatchLv2FinallyLv3OverTime extends ajaxPB.AjaxJsonSubmit
{
    /** 回應事件 程序 Fail */
    Fail:(Fun:()=>void)=>ajaxPB.AjaxJsonSubmit
}

/** 回應事件 Catch LV2 OverTime Lv3 Fail*/
export interface ResponseEventCatchLv2OverTimeLv3Fail extends ajaxPB.AjaxJsonSubmit
{
    /** 回應完成後 容是資訊 事件  */
    Finally:(Fun:ajaxPB.FunFinallyEvent)=>ajaxPB.AjaxJsonSubmit,
}

/** 回應事件 Catch LV2 OverTime Lv3 Finally*/
export interface ResponseEventCatchLv2OverTimeLv3Finally extends ajaxPB.AjaxJsonSubmit
{
    /** 回應事件 程序 Fail */
    Fail:(Fun:()=>void)=>ajaxPB.AjaxJsonSubmit
}