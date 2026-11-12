import {jObj,Commandloadimg} from '../models/vueSDK';
import pubObj from './interface/publicObjec_Interface';

/**
 * 取預設定語系
 */
var getSysLang = ():string=>
{
    /** System language */
    var SysLang:string=navigator.language.toLowerCase();
    /** 繁中 */
    var nowLangVal:string="ch";
    if(SysLang.indexOf("zh-")>-1 || SysLang.indexOf("hk-")>-1)
    {
        if(SysLang.indexOf("-cn")>-1)
        {//簡體
            nowLangVal="sch";
        }
        else
        {//繁體
            nowLangVal="ch";
        }
    }
    else if(SysLang.indexOf("en-")>-1)
    {//英語系國家
        nowLangVal="en";
    }
    else if(SysLang == "ja")
    {//日語
        nowLangVal="jp";
    }

    return nowLangVal;
}

/**
 * 載入 物件序列化(public 物件)
*/
export default class configDataList
{
    /**
     * 載入Libary json/image/語系資訊
    */
    private inLibary:pubObj = {
        config:jObj(),
        lib:jObj(),
        lang:"",
        daysOfMonth:(year:number)=>
        {//閏年 (西曆)：4 的倍數閏、100 的倍數不閏、400 的倍數閏；例 2024 閏、1900 平、2000 閏
            var leap = (year%4==0 && year%100!=0) || year%400==0;
            return [31,leap?29:28,31,30,31,30,31,31,30,31,30,31];
        },
        libSrc:(src:string)=>
        {
            return {source:this.inLibary.lib,src:src,show:true} as Commandloadimg
        }
    };
    /**
     * 宣告載入data config & public libary
     * @param loadFun async 載入 Function(完成載入 /models/jsonDoc/Config [json 檔案] )
    */
    setPublic=(loadFun:Function)=>
    {
        if(this.inLibary.lang=="")//注入預選語系
            this.inLibary.lang = getSysLang();
        /**
         * 載入完成計數(共計2)
        */
        var loadCount:number = 0;
        this.inLibary.config.load("config."+this.inLibary.lang,(e)=>{//載入 config
            loadCount++;
            if(loadCount==2)
                loadFun();
        });

        this.inLibary.lib.loadlib("pub",(e)=>{//載入img
            loadCount++;
            if(loadCount==2)
                loadFun();
        });

        return this.inLibary;//生成陣列
    };
};