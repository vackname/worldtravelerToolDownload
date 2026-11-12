import {vueComponentModel,VueTemplate,MainVueTemplate,Commandloadimg,jObj,task} from "../../../models/vueSDK";

import tscM from "../../../models/SysConfig_Interface/tscModel/init";//project for discrete model of load
import animate_author from "../../animateModel/author";//作者主題 動畫
import {pixelWtBadge} from "../../../config/pixelIcon";//大查帳標籤 (8-bit wt + 網站 icon)

export default {
    data:{
        authorImg:null,
        showAnimateFlag:false,
    },
    init:($t)=>{
        /** 作者主題 動畫模組宣告 */
        $t["$an"] = new animate_author($t);//animate model 注入樣版
    },
    temp:($t)=>{ 
        return {

            }
    },
    completed:($t)=>
    {
        task.Factory.StartNew(val=>{
            var authorImg = jObj();//啟用注入jObj 物件
            authorImg.loadlib("author",e=>{//異步載入圖片
                $t.authorImg = authorImg;
                val.resolve("author");
            });
        }).ContinueWith({
            SuccessEvent:val=>{
                $t.$an.run();//動畫啟動
            },
            CatchEvent:val=>
            {
                console.log(val.ObjectVal);
            }
        }).ContinueCatch(val=>{
            if(!$t.authorImg) console.warn("作者圖片庫 5 秒內未載入完成，動畫取消");// AbortAfter 在完成後也會觸發，只在真的逾時時提示
        }).AbortAfter(5000);
        
    },
    action:$t=>{
        return{
            /** 大查帳標籤：8-bit wt + 網站 icon */
            wtBadge:() => pixelWtBadge(),
            /** 作者動畫 image 指令 載入 設定 <image v-loadimg='authorSrc("bk.png")' />*/
            authorSrc:(src:string) => ({'source':$t.authorImg,'src':src,'show':$t.showAnimateFlag} as Commandloadimg),
        }
    }
} as vueComponentModel<any,VueTemplate>;
;
