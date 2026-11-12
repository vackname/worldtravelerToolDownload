import {vueComponentModel} from "../../models/vueSDK";
import * as asyncLoadView from "./asyncLoadView_Interface";
import asyncLoadViewVueTemp from "./asyncLoadView_VueTemp";

/** aa 第二層畫面：顯示 TS 模型 asyncM 回傳的訊息 */
export default {
    data:{
        msg:""
    },
    completed:($t)=>
    {
        // discreteModelLoad 載入 asyncM 後才執行 completed，$m 已可使用
        $t.msg = $t.$m!.mItem1Model!.hello();
    }
} as vueComponentModel<asyncLoadView.Data,asyncLoadViewVueTemp>;
