import * as headView from "./head_Interface";
import headVueTemp from "./head_VueTemp";
import {vueComponentModel,pb} from "../../../models/vueSDK";
import wtd from "../../../config/wtd";
import {pixelWtBadge} from "../../../config/pixelIcon";

/** 導覽列：標誌、區塊連結、語系切換 (中文 / English) */
export default {
    data:{
        scrolled:false
    },
    completed:($t)=>
    {
        const onScroll = ()=>{ $t.scrolled = (window.pageYOffset || 0) > 8; };
        // pb.el.win：元件移除時自動解除 (owner)，每個畫面最多更新一次 (throttle)
        pb.el.win.on("scroll", onScroll, { owner:$t, throttle:"frame" });
        onScroll();
    },
    action:($t)=>({
        nav:()=>{
            const l = wtd.lang($t);
            return $t.getJson<any>(l === "tw" || l === "ja" ? "tw" : "en").start.nav;
        },
        go:(id:string)=>{
            pb.el.id(id).scrollTo({ smooth:true, block:"start" });// 元素不存在時不動作
        },
        switchLang:()=>{
            const l = wtd.lang($t);
            wtd.set($t.main, l === "tw" || l === "ja" ? "en" : "tw");
        },
        logo:()=>pixelWtBadge()
    } as headView.Action)
} as vueComponentModel<headView.Data,headVueTemp>;
