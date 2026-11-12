import * as ajaxPB from '../ajaxPublic';
import * as ajaxLv2 from './ajaxOverTimeResponseLv2';

/** 回應事件 OverTime */
export default interface ResponseEventOverTime extends ajaxPB.AjaxFileStreamSubmit
{
    /** 回應事件 程序 Fail */
    Fail:(Fun:()=>void)=>ajaxLv2.ResponseEventOverTimeLv2Fail,
    
    /** 回應事件 Request/Process 錯誤資訊*/
    Catch:(Fun:ajaxPB.FunCatchEvent)=>ajaxLv2.ResponseEventOverTimeLv2Catch,

    /** 回應完成後 容是資訊 事件  */
    Finally:(Fun:ajaxPB.FunFinallyEvent)=>ajaxLv2.ResponseEventOverTimeLv2Finally,
}