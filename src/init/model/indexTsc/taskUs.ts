import {task} from "../../../models/vueSDK";
import type mainIndexTemp from "../../view/index_VueTemp";

/**
 * task 非同步流程示範：三個步驟依序執行 (StartNew → ContinueWith → ContinueWith)，
 * 每一步完成 (resolve) 後才進行下一步；進度寫回畫面的 taskStep。
 */
export default class taskUs
{
    private $t:mainIndexTemp;

    constructor($tObj:mainIndexTemp)
    {
        this.$t = $tObj;
    }

    /** 模擬耗時工作 (例：呼叫 API) */
    private work = (step:number, ms:number, done:(v:number)=>void)=>
    {
        this.$t.taskStep = step - 0.5;// 進行中
        setTimeout(()=>{ this.$t.taskStep = step; done(step); }, ms);
    };

    run = ()=>
    {
        if(this.$t.taskStep > 0 && this.$t.taskStep < 3) return;// 執行中不重複觸發
        this.$t.taskStep = 0;
        task.Factory.StartNew(o=>{
            this.work(1, 700, v=>o.resolve(v));
        }).ContinueWith({
            SuccessEvent:o=>{ this.work(2, 700, v=>o.resolve(v)); }
        }).ContinueWith({
            SuccessEvent:o=>{ this.work(3, 700, v=>o.resolve(v)); }
        }).ContinueCatch(()=>{
            this.$t.taskStep = 0;
        });
    };
};
