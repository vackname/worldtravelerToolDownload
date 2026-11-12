import {VueTemplate} from "../models/vueSDK";
import * as forProtalMain from "../init/main_VueTemp";
import * as mainView from "./main_Interface";

/** aa 子專案入口 props 進入點 interface */
export default interface main extends mainView.Data,VueTemplate
{
    /** 網站入口 (語系 main.init.lang) */
    main?:forProtalMain.main
}
