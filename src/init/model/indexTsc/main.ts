import type mainIndexTemp from "../../view/index_VueTemp";
import taskUs from "./taskUs";

/** 目的地 (示範資料) */
const places = ["Kyoto 京都", "Reykjavík 雷克雅維克", "Chiang Mai 清邁", "Lisbon 里斯本", "Hokkaido 北海道", "Cusco 庫斯科"];

/**
 * 首頁的商業邏輯 (專案 TS 模型，discreteModelLoad 離散載入)
 * controllers/index.ts 以 discreteModelLoad 載入後掛在 $t.$m，畫面用 $m.xxx() 呼叫。
 */
export default class main
{
    /** 非同步流程示範 (task) */
    taskObj:taskUs;

    constructor($tObj:mainIndexTemp)
    {
        this.taskObj = new taskUs($tObj);
    }

    /** 隨機抽一個目的地 (不會連續抽到同一個) */
    pick = (last?:string):string=>
    {
        let p = last;
        while(p === last) p = places[Math.floor(Math.random() * places.length)];
        return p as string;
    };
};
