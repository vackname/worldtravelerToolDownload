import * as ajaxPB from '../ajaxPublic';
import * as ajaxPBLv3 from './ajaxOverTimeResponseLv3';

/** 回應事件 OverTime Lv2 Fail*/
export interface ResponseEventOverTimeLv2Fail extends ajaxPB.AjaxFileStreamSubmit
{
    
    /** 回應事件 Request/Process 錯誤資訊*/
    Catch:(Fun:ajaxPB.FunCatchEvent)=>ajaxPBLv3.ResponseEventOverTimeLv2FailLv3Catch,

    /** 回應完成後 容是資訊 事件  */
    Finally:(Fun:ajaxPB.FunFinallyEvent)=>ajaxPBLv3.ResponseEventOverTimeLv2FailLv3Finally,
}

/** 回應事件 OverTime Lv2 Catch*/
export interface ResponseEventOverTimeLv2Catch extends ajaxPB.AjaxFileStreamSubmit
{
    /** 回應事件 程序 Fail */
    Fail:(Fun:()=>void)=>ajaxPBLv3.ResponseEventOverTimeLv2CatchLv3Fail,

    /** 回應完成後 容是資訊 事件  */
    Finally:(Fun:ajaxPB.FunFinallyEvent)=>ajaxPBLv3.ResponseEventOverTimeLv2CatchLv3Finally,
}

/** 回應事件 OverTime Lv2 Finally*/
export interface ResponseEventOverTimeLv2Finally extends ajaxPB.AjaxFileStreamSubmit
{
    /** 回應事件 程序 Fail */
    Fail:(Fun:()=>void)=>ajaxPBLv3.ResponseEventOverTimeLv2FinallyLv3Fail,
    
    /** 回應事件 Request/Process 錯誤資訊*/
    Catch:(Fun:ajaxPB.FunCatchEvent)=>ajaxPBLv3.ResponseEventOverTimeLv2FinallyLv3Catch,
}