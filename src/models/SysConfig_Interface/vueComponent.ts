import PJImport from "./ProjectMap/ProjectImportList";
import mImport from "./ModelsInterface/js";
import cssImport from "./ModelsInterface/css";
import {PropsObj} from "./vueComponentProps";
import dModel from "./discreteModel";


interface templateProject
{
    /** create template name(註冊渲染樣版名) */
    Name:(name:string)=>template,
}

/** 樣版注冊開始渲染 */
export interface template
{
    /** 加入 template 物件 project=eval("this['projectName'].main")、eval()*/
    Add:<T1,T extends ThisImport<T1>>(obj:templateObj<T1,T>|ThisImport<any>)=>void,
}

//------------------- importLoad model -start
/** 載入專案 */
interface importPJ extends PJImport
{

}

/** models sdk 夾 */
interface models
{
    /** css 載入 ex importLoad.[cssName]((e:string)=> {}) */
    css:cssImport,
    /** model 載入 importLoad.[ModelName]((e:string)=> {}) */
    js:mImport,
}

/** importLoad Obj */
interface toImport<T1>
{
    /** include project template  
     * @param path template file=[project name]@[path]   ex "@temp/MGPDS/gift"、  js file= [path] ex "@t/model/jsmodel"
    */
    url:<T extends ThisImport<T1>>(path:string)=>templateObj<T1,T>

    /** models sdk 夾 */
    m:models

    /** project 夾載入 importLoad.[ProjectName]((e:string)=> {}) */
    p:importPJ

    /** 開始載入樣版 (temp=>function)
     * @param fun 開始載入樣版階段 (註冊載入樣版後運行function)
     */
    toLoad:(fun?:Function)=>void
}

//------------------- importLoad model -end

/**
 *(T1=專案入口 最高層級樣版) vue this 內import 注入功能 備註:model js 只能取 project 本身
*/
export interface ThisImport<T1>
{
    /** include project template  
     * @param path template file=[project name]@[path]   ex "@temp/MGPDS/gift"、  js file= [path] ex "@t/model/jsmodel"
    */
    import:toImport<T1>,

    /** 當前已曾經渲染完成 樣版名 */
    v:Array<string>,

    /** 格式化函式：全站 (init/main.ts addFormat) + 元件 funcFilters；樣板 {{ $f.money(x) }} */
    $f?:{ [name:string]:(...args:any[])=>any },

    /** 主要專案層樣版物件 */
    pj:T1,

    /** system 功能 樣版取用 json key(html 設定功能才會存在)*/
    getJson:<T>(key?:string)=>T
}

/** (T1=專案入口 最高層級樣版) template format(psyl vue) */
export interface templateObj<T1,T extends ThisImport<T1>>
{
    /** template 繼承 參數
     * @param json json 參數 與 vue template data bind)
     */
    exportVue:<T extends ThisImport<T1>>(json?:any)=>templateObj<T1,T>,
    
    /** 注入樣版source物件 */
    vue:T
}

/**
 * template 載入
*/
export interface vueComponent
{
    /** tamp this */
    <T>($t:T):templateProject
}

/**
 * vueModel 樣版初始化 階段(起動渲染生命周期)
 */
interface vueModeInit<T>
{
    /**
     * @param $t VueTemplate<T?> 樣版 extends
     */
    ($t:T):void
}


/**
 * vueModel 偵聽參數get/set渲染 function
 */
export interface vueModelWatchFun
{
    /**
     * @param value 當前變動參睥
     * @param oldValue 未變動前參數
    */
    <T>(value?:T,oldValue?:T):void;
}

/** 程序初始化完成(生命周期) */
interface vueModelCompleted<T>
{
    /**
     * @param $t VueTemplate<T?> 樣版 extends
     * @param tscModel 載入 匹次 model 物件
     */
    ($t:T):void
}

/** 載入子樣版(生命周期) 陣列*/
export interface vueModelTempLI
{
    [name:string]:templateObj<any,ThisImport<any>> | ThisImport<any>
}

/** 載入子樣版(生命周期) */
interface vueModelTemp<T>
{
    /**
     * @param $t VueTemplate<T?> 樣版 extends
     */
    ($t:T):vueModelTempLI
}

/**
 * vueModel 偵聽渲染參數get/set
 */
export interface vueModelWatch
{
    [name:string]:vueModelWatchFun
}

/**
 * vueModel get/set 運算 function
 */
export interface vueModeMethods
{
    [name:string]:Function | undefined
}

/**
 * vueModel funcFilter 過濾字符
 */
export interface vueModeFfuncFilterli
{
    <T>(value:any):T
}

/**
 * vueModel funcFilter 過濾字符
 */
export interface vueModeFfuncFilter
{
    [name:string]:vueModeFfuncFilterli
}

/**
 * vueModel funcFilter 過濾字符
 */
interface vueModeFfuncFilterFun<T>
{
     /**
     * @param $t VueTemplate<T?> 樣版 extends
     */
     ($t:T):vueModeFfuncFilter
}

/**
 * vueModel 運算即時參數 get
 */
export interface vueModelFunComputeFunli
{
    /** get */
    <T>():T
}

/**
 * vueModel 運算即時參數 get set
 */
export interface vueModelFunComputeli
{
    get:<T>()=>T
    /**
     * 參數設定
     * @param setValue 進入設定Value
     * @returns 
     */
    set:<T>(setValue:T)=>void
}

/**
 * vueModel 運算即時參數 extends
 */
export interface vueModelFunComputed
{
    /** extends get set function*/
    [name:string]:vueModelFunComputeli|vueModelFunComputeFunli
}

/**
 * 自動 注入 $m mark(temp使用)
*/
interface vueModelToModelMark
{
    [name:string]:any
}

/** 基礎物件 格式 */
export interface vueObjBest<T>
{
    /** 樣版初始化階段(生命周期) */
    init?:vueModeInit<T>,
    /** 偵聽渲染參數get/set(屬性變化取用 負載運算較輕) */
    watch?:vueModelWatch,
    /** 過慮字符 */
    funcFilters?:vueModeFfuncFilterFun<T>,
    /** 運算即時參數(參數變化取用 負載運算較重(與watch類似)) */
    funComputed?:($t:T)=>vueModelFunComputed,
    /** DOM 已產生 (Vue 2 mounted / Vue 3 mounted)：可直接操作畫面、做動畫；controllers 先、view 後 */
    ready?:($t:T)=>void,
    /** 元件移除 (v-if 為 false、父層重建；Vue 2 destroyed / Vue 3 unmounted)：清除計時器、事件監聽 */
    leave?:($t:T)=>void,
}

/** controllers 數據取用層級 */
export interface vueColModel<T1,T2> extends vueObjBest<T2>
{    
    /** 樣版繫結數量 json 物件 */
    data?:T1,
    /** javascript/source 物件 (自動注入 this.$m[....])*/
    model?:vueModelToModelMark,
    /** 自動注入：{ $m:toModel, $an:animate_index } → completed 之前 new Class($t) 並掛到 $t (已存在則不覆蓋) */
    inject?:{ [name:string]:new ($t:T2)=>any },
    /** 專案 TS 模型 (離散載入)。簡化寫法：{ $m:M.model_tourCalc } (M = new tscM()，值為路徑字串)，載入後掛到 $t.$m
     *  原寫法：tsc=>tsc(new tscM()).toMap(map=>[map.model_tourCalc]).CreateJson(m=>({ $m:m.model_tourCalc }))
     *  typescript 注入取用匹次載入model 路徑,建議使用於(動畫類) animate model (tscM class)  ex:["modelAnimate/index"]*/
    discreteModelLoad?:((JoinModel:dModel)=>any) | { [name:string]:string },
    /** 程序初始化完成(生命周期) */
    completed?:vueModelCompleted<T2>,
}

/** view temp */
export interface vueModel<T1,T2> extends vueColModel<T1,T2>
{
    /** 載入子樣版(生命周期) */
    temp?:vueModelTemp<T2>,
    /** vueModel get/set 運算 function/methods */
    action?:($t:T2)=>vueModeMethods,
    /** 註冊 外部繼承 變數(參數 key 於Html 皆為 caselower | boolean=false=自動繼承參數) | 不使用 props=自動繼承參數 */
    props?: PropsObj | Array<string> | boolean
}