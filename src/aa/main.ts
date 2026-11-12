import * as mainView from "./main_Interface";
import mainVueTemp from "./main_VueTemp";
import {vueComponentModel} from "../models/vueSDK";

/** aa 子專案入口 (獨立的 aa.min.js，首頁按下「載入 aa 子專案」才下載) */
export default {
    data:{
        VueName:""
    },
    temp:($t)=>({
        view1:$t.import.url("@view/index").exportVue({ main:$t.main })
    }),
    completed:($t)=>
    {
        $t.VueName = "view1";// 樣板就緒後才顯示
    }
} as vueComponentModel<mainView.Data,mainVueTemp>;
