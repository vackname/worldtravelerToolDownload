import {vueComponentModel,VueTemplate} from "../../../models/vueSDK";
import wtd from "../../../config/wtd";

/** 頁尾 (文字在 temp/translation/<tw|en>/start.json 的 foot) */
export default {
    data:{ },
    action:($t)=>({
        foot:()=>{
            const l = wtd.lang($t);
            return $t.getJson<any>(l === "tw" || l === "ja" ? "tw" : "en").start.foot;
        }
    })
} as vueComponentModel<any,VueTemplate>;
