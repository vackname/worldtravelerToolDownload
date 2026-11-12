import {vueComponentModel,Component} from "../../models/vueSDK";
import * as indexView from "./index_Interface";
import indexVueTemp from "./index_VueTemp";
import wtd from "../../config/wtd";

/** aa 子專案首頁：點擊計數 + 載入下一層畫面 */
export default {
    data:{
        count:0,
        nextOn:false
    },
    action:($t)=>({
        tx:()=>{
            const l = wtd.lang($t);
            return $t.getJson<any>(l === "tw" || l === "ja" ? "tw" : "en").aa;
        },
        openNext:()=>{
            $t.nextOn = true;
            // 動態加入樣板：aa/view/asyncLoadView (它的 controllers 會再離散載入 TS 模型 asyncM)
            Component($t).Extends("asynTemp").Template(map=>map(temp=>temp.aa.view_asyncLoadView));
        }
    } as indexView.Action)
} as vueComponentModel<indexView.Data,indexVueTemp>;
