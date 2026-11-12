
import * as interfaceFormat from "../../../models/vueTemplateFormat";

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
 * 注意: model為載入物件 需注入 "KeyName?"*/
interface joinModeldownFormat
{

}

/** init project(初始化入口點project)
  * 注意:來自於 template computed 為載入物件 註冊時機需注入 "KeyName?"
 */
export interface Data extends joinModeldownFormat,ActionFunction
{
    /** 頁面已捲動 (導覽列加陰影) */
    scrolled:boolean
}