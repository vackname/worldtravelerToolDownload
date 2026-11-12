import tscM from "../../models/SysConfig_Interface/tscModel/init";
import indexVueTemp from "../view/index_VueTemp";
import * as indexControllers from "./index_interface";
import {vueModelControllers} from "../../models/vueSDK";

const M = new tscM();

/**
 * 首頁 controllers：範例的資料、計算屬性與 model 載入。
 * view/index.ts 只負責畫面事件，邏輯放在 model/indexTsc (以 $m 呼叫)。
 */
export default
{
    data:{
        name:"",
        qty:2,
        price:12800,
        place:"",
        cmdText:"",
        taskStep:0,
        aaState:"",
        urlFrom:"",
        jwt:""
    },
    /** 專案 TS 模型 model/indexTsc：用到才下載，載入後掛在 $t.$m */
    discreteModelLoad:{ $m:M.model_indexTsc },
    funComputed:($t)=>
    {
        return {
            /** 總價 = 人數 × 單價 (畫面用 $f.money(total) 格式化) */
            total:()=>(Number($t.qty) || 0) * (Number($t.price) || 0)
        } as indexControllers.Computed;
    },
    completed:($t)=>
    {
        $t.mLoad = true;// model 載入完成才顯示畫面
    }
} as vueModelControllers<indexControllers.Data,indexVueTemp>;
