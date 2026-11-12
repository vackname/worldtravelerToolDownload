import * as ajaxPB from '../ajaxPublic';
import * as ajaxLv2 from './ajaxCatchResponseLv2';

/** 回應事件 Catch */
export default interface ResponseEventCatch extends ajaxPB.AjaxFileStreamSubmit
{
    /** 回應事件 程序 Fail */
    Fail:(Fun:()=>void)=>ajaxLv2.ResponseEventCatchLv2Fail,

    /** 回應完成後 容是資訊 事件  */
    Finally:(Fun:ajaxPB.FunFinallyEvent)=>ajaxLv2.ResponseEventCatchLv2Finally,

    /**
     * 等候超時設定
     * @param setTime 超時設定(單位毫秒)
     * @param overFun 超時 進入 funcion
     */
    OverTimeEvent:(setTime:number,overFun?:(errorMes:string)=>void)=>ajaxLv2.ResponseEventCatchLv2OverTime,
}