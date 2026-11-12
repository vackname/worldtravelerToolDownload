import * as indexView from "./index_Interface";
import indexVueTemp from "./index_VueTemp";
import type JWTCrypto from "../../models/JWTCrypto/interface";
import {pb,vueComponentModel,Component,urlHistory} from "../../models/vueSDK";
import wtd from "../../config/wtd";

/**
 * 首頁 (ViewModel)：只放畫面事件與樣板掛載；資料在 controllers/index.ts，商業邏輯在 model/indexTsc。
 * 文字在 temp/translation/<tw|en>/start.json (<json map> 載入)。
 */
export default {
    data:{
        mLoad:false,
        tsInline:"",
        tsSrc:""
    },
    temp:($t)=>({
        headTemp:Component($t).import(temp=>temp.init.temp_index_head).exportVue({ main:$t.main }),
        footTemp:$t.import.url("@temp/index/foot").exportVue({ main:$t.main }),
        AuthorATemp:Component($t).import(temp=>temp.init.temp_index_AuthorAnimate).exportVue({})
    }),
    completed:($t)=>
    {
        // urlHistory：網址 #!homeDemo?from=... 時呼叫 (重新整理 / 上一頁 / 分享連結都能還原)
        urlHistory.on("homeDemo", p=>{ $t.urlFrom = p.from; });

        // 畫面淡入 (pb.el 動畫，播完自動移除 style)
        pb.el.id("init_panel").style({"opacity":"0"}).animate({"duration":0.5,"delay":0.1,"count":1},
            {"0%":{"opacity":"0"},"100%":{"opacity":"1"}}).remove();

        if($t.main) $t.main.init.page = "index";// 觸發 <title> 切換
    },
    action:($t)=>({
        text:()=>{
            const l = wtd.lang($t);
            return $t.getJson<any>(l === "tw" || l === "ja" ? "tw" : "en").start as indexView.StartText;
        },
        go:(id:string)=>{
            pb.el.id(id).scrollTo({ smooth:true, block:"start" });// 元素不存在時不動作
        },
        pickPlace:()=>{ $t.place = $t.$m!.pick($t.place); },
        runTask:()=>{ $t.$m!.taskObj.run(); },
        loadAa:()=>{
            if($t.aaState) return;
            $t.aaState = "loading";
            // 子專案 aa 是獨立的 aa.min.js：這時才下載，載入後以 aaTemp 掛到畫面
            $t.import.p.aa(insert=>insert("aaTemp", t=>t.exportVue({ main:$t.main })).toLoad());
            setTimeout(()=>{ $t.aaState = "loaded"; }, 300);
        },
        saveToUrl:()=>{
            urlHistory.push("homeDemo", { from:"button-" + new Date().toTimeString().slice(0, 8) });
            window.location.reload();
        },
        makeJwt:()=>{
            // models 套件：第一次呼叫才下載 src/models/JWTCrypto
            $t.import.m.js.JWTCrypto<JWTCrypto>(e=>{
                const now = Math.floor(Date.now() / 1000);
                $t.jwt = e().CreateJWT({ alg:"HS256", typ:"JWT" }, { iss:"worldTraveler", iat:now, exp:now + 3600 }, "demo-secret");
            });
        }
    } as indexView.Action)
} as vueComponentModel<indexView.Data,indexVueTemp>;
