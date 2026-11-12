import * as vueComponentM from "./vueComponent";
import ProjectMap from "./ProjectMap/ProjectList";
import TempMap from "./ProjectMap/MapProject";
/**
 *  vue catch teamp(generation 取得)
 */
interface vuePropGeneration<T>
{
    /**
     * 子層級 template 物件讀取
     * @param map tamp map ex: "a1/b1/c1"
     * @returns 注冊該樣版
     */
    generation:<T1>(map:string)=>vuePropSub<T1>,

    /**
    * catch tamp this
    * @param fun async this
    */
    async:(fun:(e:T)=>void)=>void
}

/**
 *  vue catch teamp(generation 取得)
 */
interface vuePropSub<T>
{
    /** 等候 進入樣版時間點 最大時間(單位:毫秒,default=400毫秒) 
     * @param time (單位:毫秒)
    */
    wait:(time:number)=>vuePropGeneration<T>,

    /**
     * 子層級 template 物件讀取
     * @param map tamp map ex: "a1/b1/c1"
     * @returns 注冊該樣版
     */
    generation:<T1>(map:string)=>vuePropSub<T1>,
      
    /**
    * catch tamp this
    * @param fun async this
    */
    async:(fun:(e:T)=>void)=>void
}

/**
 * 取樣版子節點 
 */
interface vuePropSubPsylMVC<T>
{
  /**
   * @param $t tamp object
   * @param vObj add map tamp ojbect
   * @param map tamp map ex: "a1/b1/c1"
  */
  ($t:T,vObj:vuePropSub<T>|null,map:string):vuePropSub<T>
}

 /**
 * 專案 開始渲染注冊樣版物件
*/
interface addProjectCrateTemplate
{
   /**
    * @param map  注入map 物件/渲告變數 再注入物件
   */
   (map:addProjectTempMapObj):vueComponentM.templateObj<any,any>
}

/**
 * 專案 樣版function map 物件 to template 物件
*/
interface addProjectTempMapObj
{
  /**
   * @param Name 專案 map
  */
  (Name:addProjectTemplateObj):vueComponentM.templateObj<any,any>
}

/**
 * 專案 樣版function map 物件路徑
*/
interface addProjectTemplateObj
{
 /**
  * 樣版物件路徑
  * @param obj 樣版路徑取得
 */
 (obj:ProjectMap):string
}

/**
* 開始渲染注冊樣版物件
*/
interface addCrateTemplate<T extends vueComponentM.ThisImport<any>>
{
  /**
   * @param map  注入map 物件/渲告變數 再注入物件
  */
  (map:addTempMapObj<T>):vueComponentM.ThisImport<any> | vueComponentM.templateObj<any,T>
}

/**
* 樣版function temp map 物件 to template 物件
*/
interface addTempMapObj<T extends vueComponentM.ThisImport<any>>
{
  /**
   * 樣版物件路徑
   * @param Path temp map 物件路徑
  */
  (Path:addTemplateObj):vueComponentM.templateObj<any,T>
}

/**
* 樣版function temp map 物件路徑
*/
interface addTemplateObj
{
  /**
   * 樣版物件路徑
   * @param obj 樣版路徑取得
  */
  (obj:TempMap):string  
}

/**
  * 注冊樣版端口
 */
class toComponentObj<T extends vueComponentM.ThisImport<any>>
{
   /**
    * 註冊 樣版物件
   */
   private get$t:T;
   private getVue:vueComponentM.template;
   /** 樣版名 */
   private getTempName:string;

   constructor(tempName:string,$t:T,vue:vueComponentM.template)
   {
     this.get$t = $t;
     this.getVue = vue;
     this.getTempName=tempName;
   }

  /**
   * 專案樣版入口 注冊物件
   * @param map 專案 樣版路徑 物件
   * @returns 取得 專案Vue
   */
   Project(map:addProjectCrateTemplate)
   {
     this.getVue.Add(map(new ComponentObj(this.get$t).Project));
    }

   /**
     * template 注冊物件
     * @param map 樣版路徑 物件
     * @returns 注冊該樣版
  */
   Template(map:addCrateTemplate<T>)
   {
     var toGet$t = this.get$t;
     this.getVue.Add(map((Path:addTemplateObj):vueComponentM.templateObj<any,T>=>
     toGet$t.import.url(Path(new TempMap()))));
   }
}

/**
* 注冊樣版物件 主要 class
*/
export default class ComponentObj<T extends vueComponentM.ThisImport<any>>
{
   /**
    * 註冊 樣版物件
   */
   private get$t:T;
   /**
    * @param $t 繼承已起用樣版
   */
   constructor($t:T)
   {
     this.get$t = $t;
   }

   /**
   * 專案樣版入口 注冊物件
   * @param ProjectName 專案名
   * @returns 取得 專案Vue
   */
   Project = (ProjectName:(obj:ProjectMap)=>string)=>
   (eval(ProjectName(new ProjectMap()) + '_mainrunVue.main')) as vueComponentM.templateObj<any,any>;

   /**
     * template 注冊物件
     * @param Path 樣版路徑 物件
     * @returns 注冊該樣版
     */
   import = (Path:addTemplateObj)=> 
   this.get$t.import.url(Path(new TempMap()));

   /**
     * 子層級 template 物件讀取
     * @param map tamp map ex: "a1/b1/c1"
     * @returns 注冊該樣版
     */
   generation = <T1>(map:string)=>
    {
      var toFun:vuePropSubPsylMVC<T1> = eval("vueGetMapMVC");
      return toFun((this.get$t as any),null,map);
    }

   /**
    * template(需注意為後注入 需再次做動重新渲染) 額外加入新物件(綁定)
    * @param Name 定議註冊樣版 名稱
   */
   Extends(Name:string)
   {
     const vueObj:vueComponentM.vueComponent = eval("vueComponent");
     return new toComponentObj(Name,this.get$t,vueObj(this.get$t)
     .Name(Name));//宣告樣版名
   }

}