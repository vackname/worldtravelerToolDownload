import * as vueComponentM from "./SysConfig_Interface/vueComponent";
import {PropsObj,propsTypeObj} from "./SysConfig_Interface/vueComponentProps";

/** vue template props format */
export type toVuePropsType = propsTypeObj;


/** vue template props format */
export interface addVuePropsFormat extends PropsObj
{

}

/** vue template computed get(function) */
export interface toVueComputedGetForFunction extends vueComponentM.vueModelFunComputeFunli
{

}

/** vue template computed get/get */
export interface toVueComputedGetAndSet extends vueComponentM.vueModelFunComputeli
{

}

/** vue template computed format */
export interface addVueComputedFormat extends vueComponentM.vueModelFunComputed
{

}


/** vue template get filter function(value) */
export interface toVueModeFfuncFilter extends vueComponentM.vueModeFfuncFilterli
{

}

/** vue template filter format */
export interface addVueFilterFunctionFormat extends vueComponentM.vueModeFfuncFilter
{

}

/** vue template watch get function(value,OldValue) */
export interface toVueWatchValueOldValue extends vueComponentM.vueModelWatchFun
{

}

/** vue template watch format */
export interface addVueWatch extends vueComponentM.vueModelWatch
{

}

/** vue template action/methods format */
export interface addVueAction extends vueComponentM.vueModeMethods
{

}