import {VueTemplate} from "../../../models/vueSDK";
import * as mainTemp from "../../main_VueTemp";
import * as view from "./head_Interface";

/** head (導覽列) props 進入點 interface */
export default interface Head extends view.Data,VueTemplate
{
    /** 網站入口 (語系 main.init.lang) */
    main?:mainTemp.main
}
