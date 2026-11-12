import * as indexControllers from "./index_interface";
import indexVueTemp from "../view/index_VueTemp";
import {vueModelControllers} from "../../models/vueSDK";

/** aa 首頁 controllers (這個範例的資料都在 view；有共用資料時放這裡) */
export default {
    data:{ }
} as vueModelControllers<indexControllers.Data,indexVueTemp>;
