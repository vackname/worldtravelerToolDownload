import configDataList from './public';
import {importLoadObjInterface,pb} from '../models/vueSDK';
/** 繼承importLoad 物件(importLoad 入口class) */
export default function($t:importLoadObjInterface){
    /**
     * 載入 oder
    */
    var configObj = new configDataList();
    //公共 css
    $t.m.css.sit((e)=>{
        $t.pub = configObj.setPublic(()=>{//download libary     
            console.log("Model css =>sit_"+e);
            setTimeout(()=>{
                console.log("libary =>init");
                $t.p.init((e3)=>{//載入口點
                    console.log("page vue =>init---"+e3);
                    console.warn("在找我/find me？在找我?旅人的起始點");
                    if(pb.debug)//debug model
                        console.warn("----------runing-debug-model----------");
                });
            },99);
        });
    });
}