import * as ajaxM from "./SysConfig_Interface/ajax";
import importLoadM from "./SysConfig_Interface/importLoad";
import pubObj from '../config/interface/getPubObject_interface';
import urlHistoryM from "./SysConfig_Interface/urlHistory";
import pbM from "./SysConfig_Interface/pb";
import {TaskObj} from "./SysConfig_Interface/Task";
import * as vueComponentM from "./SysConfig_Interface/vueComponent";
import pubComponentObj from "./SysConfig_Interface/publicComponent";
import jObjM from "./SysConfig_Interface/JObj";
import addComponent from "./SysConfig_Interface/vueComponentAdd";
import * as EnumsAPI from "./SysConfig_Interface/JsonInterface/enum";
import * as TablesAPI from "./SysConfig_Interface/JsonInterface/db";

/** public sdk */
export const pb:pbM = eval("pb");
/**
 * 緩執行程序(休眠)(需加入 await)
*/
interface sleepM
{
  /**
 * 緩執行程序(休眠)(需加入 await)
 * @param ms 休眠時間毫秒 
 */
  (ms:number):Promise<any>
}

/**
 * 緩執行程序(休眠)(需加入 await)
 * @param ms 休眠時間毫秒 
 */
export const sleep:sleepM = eval("sleepObj");

/** Task Factory */
export const task:TaskObj = eval("taskObj");

/** ajax */
export const ajax:ajaxM.ajax = eval("ajax");

/** ajax interface */
export interface ajaxInterface extends ajaxM.ajax {}

/** add browser history(sorce code) */
export const urlHistory:urlHistoryM = eval("urlHistory");

/** system public to object/init(function) interface */
export interface importLoadObjInterface extends pubObj,importLoadM{}

/** system public to object/init(function) */
export const importLoad:importLoadObjInterface = eval("importLoad");

/** libary to load system */
export var jObj =():jObjInterface=> eval("new Jobj()");

/** libary to load system fro Interface */
export interface jObjInterface extends jObjM { }

 /** (T=專案入口 最高層級樣版) 專案內 子樣版 this 內import 注入功能 備註:model js 只能取 project 本身 */
 export interface VueTemplate extends vueComponentM.ThisImport<MainVueTemplate>
 {
    /** 無註解 自動注入 class/model */
    [name:string]:any
 }

 /** 專案入口 main 樣版 */
 export interface MainVueTemplate extends vueComponentM.templateObj<any,vueComponentM.ThisImport<any>>{}

 /** 樣版 model T1=data class,T2=VueTemplate<T?> ,T3=tscModel 樣版 extends */
 export interface vueComponentModel<T1,T2> extends vueComponentM.vueModel<T1,T2> {}

 /** 載入子樣版(生命周期) 陣列 templateObj<T1,T> */
 export interface vueModelTemp extends vueComponentM.vueModelTempLI {}

 /** controllers 數據取用層級 T1=data class,T2=VueTemplate<T?> ,T3=tscModel */
 export interface vueModelControllers<T1,T2> extends vueComponentM.vueColModel<T1,T2>{}

 /**
  * 樣板 .html 的 <script lang="ts"> (與 JavaScript <script>) 可直接使用的 $view
  * (script 在父層註冊這個樣板時 (元件定義建立時、Vue 建立之前) 執行一次，之後的元件實例共用；要對每個元件實例做事用 created / ready / leave)。V = 同名 .ts 的 export default (例 view/index.html → view/index.ts)，
  * T = 這個元件的 $t (data + action + 樣板注入)
  *
  * 外部檔 <script lang="ts" src="./index.script.ts"> 要用 $view 時：
  *   export default function($view:WtScriptView<typeof indexView>){ … }   (import type indexView from "./index")
  */
 export interface WtScriptView<V = any, T = V extends { ready?:($t:infer X)=>void } ? X : any>
 {
    /** 同名 .ts 的 export default (data / action / temp …)：所有實例共用，修改會影響之後建立的元件 */
    readonly vue:V;
    /** 每個元件實例 Vue created 之後執行：data、action 已可用 ($m 等 completed 才注入的值可能尚未就緒) */
    created(fn:($t:T)=>void):void;
    /** DOM 已產生 (Vue mounted)：可操作畫面 */
    ready(fn:($t:T)=>void):void;
    /** 元件移除 (Vue destroyed / unmounted)：清除計時器、事件監聽 */
    leave(fn:($t:T)=>void):void;
 }

 /*
後端 enum 實例 ->webapi for net core 
  /// <summary>
  /// 示範 enum
  /// </summary>
	public enum EnumSample
	{
        [DBEnumViewName("[\"未發佈\",\"未发布\",\"not of publish\",\"未発表\"]", Description: "未發佈")]
        publsh = 0,

        [DBEnumViewName("[\"秒\",\"sec\",\"sec\",\"sec\"]", Description: "第二樣本")]
        sec =1,
	}
*/
/** API Enum 定義(API sorce)*/
export {EnumsAPI};

/* 定義 前端取得 table key name
// 也可以 定義 [JsonPropertyName("Key name")] 
// 優先層級 JsonPropertyName>DBM>DBAPI
後端 表class 實例 ->webapi for net core 
	/// <summary>
	/// 示範Table
	/// </summary>
	public class UserClient
	{
        [DBM(JsonName = "name_val", TSMark = "名稱")]
        public string Name { set; get; }
		[DBAPI(JsonName = "age_val",TSMark = "年齡")]
		public int Age { set; get; }

        [JsonExtensionData]
        public Dictionary<string, object> extend { set; get; } = new Dictionary<string, object>();
    }
*/
/** database/table/API interface 定義(API sorce)*/
export {TablesAPI};
/* 後端 DB enum ->webapi for net core 注冊
  public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
  {
      if (env.IsDevelopment())
      {
          app.UseDeveloperExceptionPage();
      }

      app.UseResponseCompression();

      app.UseHttpsRedirection();
      app.UseResponseCaching();
      app.UseRouting();
      app.UseAuthorization();

      app.UseEndpoints(endpoints =>
      endpoints.MapControllerRoute(
          name: "default",
          pattern: "{controller=Home}/{action=Index}/{id?}"));

      WorldTravelerVueMiddleWare.GetTypeScriptTables = () =>
        new List<tscObj>() {
                      JObj.getTsc<UserClient>("sample table"),
        };

      WorldTravelerVueMiddleWare.GetTypeScriptEnums = () =>
        new List<enumTscObj>() {
                      JObj.EnumTscList<EnumSample>("sample enum"),
        };

      VueBundleMiddleWare.tscOutPutPw = "samplePassword";//載入 /src/config/interfaceJsonHost docker get.web.com 
      //密鑰 載入webapi專案 enum/table 註解及物件 指令示例: psyl tscdb samplePassword

      app.UseWorldTravelerVue(Configuration);// worldTravelerVueMiddleWare.dll
  }
*/

 /**
 * 樣版物件注冊
 * @param $t 繼承已起用樣版
 * @returns 注冊樣版物件 主要 class
*/
export function Component<T extends vueComponentM.ThisImport<any>>($t:T)
{
  var toTemp = new addComponent($t);
  return toTemp;
}

/** v-loadimg for load image 指令 */
export interface Commandloadimg
{
    /** source libary */
    source:jObjInterface,
    /** show/hidden image */
    show:boolean,
    /** image src */
    src:string
}

/**
 * 自定義組件(共用域 component)
*/
export interface PublicComponentInterface<T2> extends pubComponentObj<T2>{ }