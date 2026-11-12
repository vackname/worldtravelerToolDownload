import * as ajaxPB from '../ajaxPublic';

/** 回應事件 OverTime Lv2 Fail Lv3 Catch*/
export interface ResponseEventOverTimeLv2FailLv3Catch extends ajaxPB.AjaxJsonSubmit
{
    /** 回應完成後 容是資訊 事件  */
    Finally:(Fun:ajaxPB.FunFinallyEvent)=>ajaxPB.AjaxJsonSubmit,
}

/** 回應事件 OverTime Lv2 Fail Lv3 Finally*/
export interface ResponseEventOverTimeLv2FailLv3Finally extends ajaxPB.AjaxJsonSubmit
{
    
    /** 回應事件 Request/Process 錯誤資訊*/
    Catch:(Fun:ajaxPB.FunCatchEvent)=>ajaxPB.AjaxJsonSubmit,
}

/** 回應事件 OverTime Lv2 Catch Lv3 Fail*/
export interface ResponseEventOverTimeLv2CatchLv3Fail extends ajaxPB.AjaxJsonSubmit
{
    /** 回應完成後 容是資訊 事件  */
    Finally:(Fun:ajaxPB.FunFinallyEvent)=>ajaxPB.AjaxJsonSubmit,
}

/** 回應事件 OverTime Lv2 Catch Lv3 Finally*/
export interface ResponseEventOverTimeLv2CatchLv3Finally extends ajaxPB.AjaxJsonSubmit
{
    /** 回應事件 程序 Fail */
    Fail:(Fun:()=>void)=>ajaxPB.AjaxJsonSubmit,
}

/** 回應事件 OverTime Lv2 Finally Lv3 Fail*/
export interface ResponseEventOverTimeLv2FinallyLv3Fail extends ajaxPB.AjaxJsonSubmit
{    
    /** 回應事件 Request/Process 錯誤資訊*/
    Catch:(Fun:ajaxPB.FunCatchEvent)=>ajaxPB.AjaxJsonSubmit,
}

/** 回應事件 OverTime Lv2 Finally Lv3 Catch*/
export interface ResponseEventOverTimeLv2FinallyLv3Catch extends ajaxPB.AjaxJsonSubmit
{
    /** 回應事件 程序 Fail */
    Fail:(Fun:()=>void)=>ajaxPB.AjaxJsonSubmit,
}
