import {pb,importLoad} from "../../../models/vueSDK";
import type asyncLoadViewTemp from '../../view/asyncLoadView_VueTemp';

/** temp this */
let $t:asyncLoadViewTemp;
/** class this */
let self:model;
/** example model item1 */
export default class model{
    constructor($tObj:asyncLoadViewTemp) 
    {
        $t = $tObj;
        self = this;
    }

    /** 第二層畫面顯示的訊息 */
    hello = ():string=>"asyncLoadView + model/asyncM ✔";
};

