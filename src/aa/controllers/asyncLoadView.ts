import {vueModelControllers} from "../../models/vueSDK";
import * as asyncLoadViewControllers from "./asyncLoadView_Interface";
import asyncLoadViewVueTemp from "../view/asyncLoadView_VueTemp";
import tscM from "../../models/SysConfig_Interface/tscModel/aa";

const M = new tscM();

/** 第二層畫面：離散載入 TS 模型 model/asyncM (用到才下載)，掛在 $t.$m */
export default {
    data:{ },
    discreteModelLoad:{ $m:M.model_asyncM }
} as vueModelControllers<asyncLoadViewControllers.Data,asyncLoadViewVueTemp>;
