import {VueTemplate} from "../../models/vueSDK";
import * as forProtalMain from "../../init/main_VueTemp";
import * as indexControllers from "../controllers/index_interface";
import * as indexView from "./index_Interface";

/** view index props 進入點 interface */
export default interface index extends indexView.Data,indexControllers.Data,VueTemplate
{
    /** 網站入口 (語系 main.init.lang) */
    main?:forProtalMain.main
}
