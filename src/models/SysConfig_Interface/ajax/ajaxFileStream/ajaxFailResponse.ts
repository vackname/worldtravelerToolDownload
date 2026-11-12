import * as ajaxPB from '../ajaxPublic';
import * as ajaxLv2 from './ajaxFailResponseLv2';

/** 回應事件 Fail */
export default interface ResponseEventFail extends ajaxPB.AjaxFileStreamSubmit
{
    /** 回應事件 Request/Process 錯誤資訊*/
    Catch:(Fun:ajaxPB.FunCatchEvent)=>ajaxLv2.ResponseEventFailLv2Catch,

    /** 回應完成後 容是資訊 事件  */
    Finally:(Fun:ajaxPB.FunFinallyEvent)=>ajaxLv2.ResponseEventFailLv2Finally,

    /**
     * 等候超時設定
     * @param setTime 超時設定(單位毫秒)
     * @param overFun 超時 進入 funcion
     */
    OverTimeEvent:(setTime:number,overFun?:(errorMes:string)=>void)=>ajaxLv2.ResponseEventFailLv2OverTime,

}