import * as interfaceFormat from "../../models/vueTemplateFormat";
import {Commandloadimg,jObjInterface} from "../../models/vueSDK";

/** template props */
export interface Props extends interfaceFormat.addVuePropsFormat
{

}


/** template watch */
export interface Watch extends interfaceFormat.addVueWatch
{

}

/** template computed */
export interface Computed extends interfaceFormat.addVueComputedFormat
{


}


/** template Filter */
export interface Filter extends interfaceFormat.addVueFilterFunctionFormat
{

}


/** template Action/methods (only support Function)
  * 注意: model為載入物件 需注入 "KeyName?"*/
interface ActionFunction
{

}

/** template Action/methods */
export interface Action extends interfaceFormat.addVueAction,ActionFunction
{

}

/** download model format 
 * 注意:來自於 model typescript 為載入物件 註冊時機需注入 'KeyName?'
 * 注意: model為載入物件 需注入 'KeyName?'*/
interface joinModeldownFormat
{

}

/** view asyncLoadView 數據
* 注意:如加入 Key,來自於 template computed 為載入物件 註冊時機需注入 'KeyName?'
 */
export interface Data extends joinModeldownFormat,ActionFunction
{
    /** TS 模型回傳的訊息 */
    msg:string
}