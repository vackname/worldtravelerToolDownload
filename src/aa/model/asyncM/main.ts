import {pb} from "../../../models/vueSDK";
import type asyncLoadViewTemp from '../../view/asyncLoadView_VueTemp';

import m1 from "./item1model";//import ex: class model

export default class main{
    mItem1Model:m1|undefined;//model class, us ex: this.mItem1Model.testFun(false); => output:false 
    constructor($tObj:asyncLoadViewTemp) {
        /* $tObj join this*/
        this.mItem1Model = new m1($tObj);//join model class
    }
};

