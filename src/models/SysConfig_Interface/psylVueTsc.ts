import InITempMap from "./ProjectMap/init_View";//注入初始 樣版map
import vueDirectiveEvt from "./vueDirectiveEvt";
import {pb} from "../vueSDK";

/**
 * 樣版注入function output data json
*/
interface tempObj<T>
{
    /** $t= 樣版object 
     *
     * @returns 渲染樣版物 繼承 main data
    */
    ($t:T):any
}

/**
 * 樣版注入function output string
*/
interface tempStrObj<T>
{
    /** $t= 樣版object */
    ($t:T):string
}

interface loadObj<T>
{
    /**
     * 開始載入 樣版(注入 樣版及數據繼承)
    */
    load:(fun:tempObj<T>)=>void
}

/** head watch title change 物件 */
interface getHeadTitleToFun<T>
{
    /**
     * @param watchKeyName 觸發 T Json 物件資料
     * @param fun 觸發後進入 function(output 更新title資訊)
    */
    (watchKeyName:string,fun:tempStrObj<T>):loadObj<T>
}

interface getHeadTitleObj<T>
{
    /**
     * web title
    */
    getHeadTitle:getHeadTitleToFun<T>
}

/**
 * Icon base64 string
*/
interface getIconGetObj<T>
{
    /**
     * 注入 web icon
    */
    getIcon:(fun:tempStrObj<T>)=>getHeadTitleObj<T>
}

/**
 * Icon base64 string
*/
interface getIconObj<T> extends getIconGetObj<T>
{
    /** 自動起動url history參數程序(default=true) */
    urlHistoryRuning:(ck:boolean)=>getIconGetObj<T>
}


/** psyl Vue DataObj */
interface DataObj
{
    /**
     * app 樣版數據物件
    */
    <T>(mainDataJson:T):getIconObj<T>
}

 /** 初始化 Vue */
export default class CreateVue
{
    /** psyl 物件 */
    private nowVueObj:any;
    /**
     * @param temp 取得樣版路徑(起始渲染樣版)
    */
    constructor(temp:(obj:InITempMap)=>string) 
    {
        /** 樣版路徑名 */
        let catchTempName:string[] = temp(new InITempMap()).split('@');
        /** 起始樣版物件取用 */
        // 一般 function (不用箭頭函式)：核心以 new 呼叫它；TypeScript 輸出 ES2015+ (Vue 3 核心) 時箭頭函式不能被 new
        let startTemp:Function = function(outhis:any)
        {
            return new (eval(((catchTempName[0]=='')?'init':catchTempName[0])+"_VuePJ") as any)()[catchTempName[1].replace(/\//g,'_')](outhis);
        };
      
        this.nowVueObj = new (eval("psylVue") as any)(startTemp);
    }

    /**
     * screen view setting
     * @param viewPort meta tag default("width=device-width, initial-scale=1.0, user-scalable=no")
     * @returns CreateVue
     */
    setMetaViewport = (content?:string)=>
    {
        if(content!=null && content!=undefined)//setting viewport
            pb.el.q("meta[name='viewport']").attr("content",content);// 沒有 viewport meta 時不動作
        
        return {
            getData:<T>(mainDataJson:any)=>this.getData<T>(mainDataJson)
        };
    }

    /**
     * 前端核心版本：封裝 / debug 時 wt 讀取這一行決定使用的核心與輸出語法 (vue2 = ES5、vue3 = ES2020)
     * - "vue2"：worldTravelerVue (Vue 2.7)，支援 ES5 瀏覽器，全球相容性最廣 (預設)
     * - "vue3"：worldTravelerVue3 (Vue 3.5)，局部更新較快，只支援現代瀏覽器 (輸出 ES2020)
     * - "auto"：debug 使用 vue2 (console 會通知)；release 輸出 vue2 (dir/libjs) + vue3 (dir/libjs3) 兩套，
     *   由 worldTravelerVueMiddleWare 依瀏覽器選擇 (CoreSelect：detect 瀏覽器偵測 / ua 依 User-Agent)；程式以 vue2 (ES5) 規則撰寫
     * 執行時若與實際載入的核心不同，console 會提示 (需重新封裝 / 重啟前端 debug)
     * @returns CreateVue
     */
    toVueVersion = (version:"vue2"|"vue3"|"auto")=>
    {// auto：debug 用 vue2；release 輸出 vue2 + vue3 兩套，由 worldTravelerVueMiddleWare (CoreSelect) 依瀏覽器選擇
        const now = (window as any).wtVueVersion || "vue2";
        if(version !== "auto" && now !== version) console.warn("toVueVersion(\"" + version + "\")：目前載入的是 " + now + " 核心，請重新封裝或重啟前端 debug");
        return this;
    }

    /**
     * 全站格式化函式 (取代 filter，Vue 2 / Vue 3 寫法相同)
     * 樣板：{{ $f.money(price) }}  (Vue 2 也可 {{ price | money }})
     * @param name 名稱
     * @param fun 格式化函式
     * @returns CreateVue
     */
    addFormat = (name:string,fun:(...args:any[])=>any)=>
    {
        this.nowVueObj.addFormat(name,fun);
        return this;
    }

    /** add 自定義指令 
     * @param name 指令名
     * @returns CreateVue
    */
    addCommand = (name:string,fun:(dir:vueDirectiveEvt)=>void)=>
    {
        var getCommand = new vueDirectiveEvt(name);
        fun(getCommand);
        getCommand.toRegister();//註冊物件
        return this;
    }

    /**
     * app 樣版數據物件
     * @returns CreateVue
    */
    getData:DataObj=(mainDataJson:any)=> this.nowVueObj.getData(mainDataJson);
}

