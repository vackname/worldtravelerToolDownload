
import {VueTemplate} from "../../models/vueSDK";
import * as forProtalMain from "../../init/main_VueTemp";
import * as asyncLoadViewControllers from "../controllers/asyncLoadView_Interface";
import * as asyncLoadView from "./asyncLoadView_Interface";

/** view asyncLoadView props 進入點 interface */
export default interface asyncLoad extends asyncLoadView.Data,asyncLoadViewControllers.Data,VueTemplate
{
    /** vue 程序 入口點 this */
   main?:forProtalMain.init
}