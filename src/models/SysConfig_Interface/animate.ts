/** animate 被觸發內容動作 */
interface anActionVal
{
    /** animate 被觸發內容動作 */
    [x:string]:String
}
/** animate 階段觸發 */
interface anAction
{
    /** animate 階段觸發 */
    [x:string]:anActionVal
}

/**
 * html element animate format：animate() 的動畫設定 (duration / delay …)
 *
 * 元素工具不在這裡，在 elTools (pb.el.id / of / q / qa 取得的元素都有)：
 * on、off、outside (事件)；q、qa (找子元素)；rect (位置大小)；scrollTo (捲動，取代 scrollIntoView)；
 * cls (class)；attr、data (屬性)；contains、closest
 * @see elTools
 * @example pb.el.id("card").cls.add("is-hot").scrollTo({offset:80})
 *     .animate({duration:0.3}, {"0%":{"opacity":"0"},"100%":{"opacity":"1"}});
*/
interface AnimateAction
{
    /** 動畫持續時間 unit sec */
    duration?:number,
    /** wait 後再 action(unit sec) */
    delay?:number,
    /** number = 運行次數,string "infinite" = 永久運行 */
    count?:string|number

    /** 播放方向 
     * reverse, alternate, alternate-reverse, alternate, reverse, normal
    */
    direction?:string,
    
    /** 結束 開始 停留狀態
     * none, forwards, backwards, both
     */
    model?:string,
    /**
     * 起用 停止
     * running, paused
     */
    play?:string,
    /** 速率 動作
     * 
     *  -- Keyword values --
     *  ease; ease-in; ease-out; ease-in-out; linear; step-start; step-end;
     *
     *  -- Function values  --
     *  ex
     *  cubic-bezier(0.1, 0.7, 1.0, 0.1);
     *  steps(4, end);
     *
     *  -- Steps Function keywords  --
     *  ex
     *  steps(4, jump-start);
     *  steps(10, jump-end);
     *  steps(20, jump-none);
     *  steps(5, jump-both);
     *  steps(6, start);
     *  steps(8, end);
     *
     *  -- Multiple animations  --
     *  ex
     *  ease, step-start, cubic-bezier(0.1, 0.7, 1.0, 0.1);
     *
     *  -- Global values  --
     * inherit, initial, unset
     */
    timing?:string
}


/**
 * 動畫
 */
interface animateModel
{
     /**
     * @param set set 影格運行
     * @param action set 動作  ex {"0%":{"opacity": "0.3"},}
     * @param touch 觸發事件css ex "hover"
    */
    (set:AnimateAction,action:anAction,touch?:string):elOnly,
}

/**
 * pb.el 事件選項
 */
export interface elEventOpt
{
    /** 元件 ($t)：元件移除 (leave) 時自動解除，不用自己寫 removeEventListener */
    owner?:any,
    /** 節流："frame" = 每個畫面最多一次 (requestAnimationFrame，scroll / resize / mousemove 建議使用)；數字 = 毫秒 */
    throttle?:"frame"|number,
    /** passive (不會呼叫 preventDefault)：scroll、touchstart、touchmove、wheel 預設 true */
    passive?:boolean,
    /** 觸發一次後自動解除 */
    once?:boolean,
    /** 捕獲階段 */
    capture?:boolean,
    /** 事件委派：回呼的 el 為 e.target 往上最近符合此選擇器的元素 (例 ".item") */
    delegate?:string
}

/** pb.el.scrollTo 選項 (取代 scrollIntoView) */
export interface elScrollOpt
{
    /** 平滑捲動 (預設 true；瀏覽器不支援時直接跳到位置) */
    smooth?:boolean,
    /** 對齊：start (預設) / center / end / nearest */
    block?:"start"|"center"|"end"|"nearest",
    /** 上方保留的高度 (px)，例：固定導覽列的高度 */
    offset?:number,
    /** pb.el.win.scrollTo：捲動到的位置 */
    top?:number,
    left?:number
}

/** 元素位置 (getBoundingClientRect) */
export interface elRect { left:number, top:number, width:number, height:number, right:number, bottom:number }

/** class 操作 */
export interface elCls<T>
{
    add:(name:string)=>T,
    remove:(name:string)=>T,
    /** force：true = 加入、false = 移除 */
    toggle:(name:string, force?:boolean)=>T,
    has:(name:string)=>boolean
}

/**
 * 事件與元素工具 (elOnly / elList 共用；動畫設定見 AnimateAction)
 *
 * | 分類 | 成員 |
 * |---|---|
 * | 事件 | on、off、outside |
 * | 找元素 | q、qa、closest、contains |
 * | 位置 / 捲動 | rect、scrollTo |
 * | class / 屬性 | cls、attr、data |
 *
 * 全域：pb.el.win / pb.el.doc (window / document 事件)、pb.el.of(元素)、pb.el.q / qa (選擇器)
 */
interface elTools<T>
{
    /**
     * 事件 (取代 addEventListener)
     * @param fn el = 元素包裝 (可直接 animate / style)；e = 原生事件 (依事件名稱有型別)
     * @example pb.el.id("btn").on("click", (el, e)=>{ e.preventDefault(); });
     */
    on<K extends keyof HTMLElementEventMap>(type:K, fn:(el:T, e:HTMLElementEventMap[K])=>void, opt?:elEventOpt):T,
    on(type:string, fn:(el:T, e:Event)=>void, opt?:elEventOpt):T,
    /** 解除 pb.el 掛的事件 (取代 removeEventListener)：不給參數 = 全部；只給 type = 這種事件全部 */
    off:(type?:string, fn?:Function)=>T,
    /** 點 (或其他事件) 發生在元素以外時 (例：關閉下拉選單) */
    outside<K extends keyof DocumentEventMap>(type:K, fn:(el:T, e:DocumentEventMap[K])=>void, opt?:elEventOpt):T,
    /** 是否包含 (元素 / 事件的 target / pb.el 包裝) */
    contains:(x:Node|Event|elOnly|null|undefined)=>boolean,
    /** 往上最近符合選擇器的元素 (含自己) */
    closest:(selector:string)=>elOnly,
    /** 子元素：第一個符合選擇器的 (querySelector) */
    q:(selector:string)=>elOnly,
    /** 子元素：全部符合選擇器的 (querySelectorAll) */
    qa:(selector:string)=>elList,
    /** 位置與大小；元素不存在時為 null */
    rect:()=>elRect|null,
    /** 捲動到元素 (取代 scrollIntoView；可設定 offset 避開固定導覽列) */
    scrollTo:(opt?:elScrollOpt)=>T,
    /** class：add / remove / toggle / has */
    cls:elCls<T>,
    /** 屬性：只給名稱 = 讀取；給值 = 設定；null = 移除 */
    attr(name:string):string|null,
    attr(name:string, value:string|number|boolean|null):T,
    /** data-* 屬性 */
    data(name:string):string|null,
    data(name:string, value:string|number|boolean|null):T
}

/**
 * html element animate
*/
export interface elOnly extends elTools<elOnly>
{
    /** html element (元素不存在時為 null，先判斷 exist) */
    get:HTMLElement|null,
    /** element attr id */
    id:(name:string)=>elOnly,
    /** element attr class */
    class:(name:string)=>elList,
    /** element attr name */
    name:(name:string)=>elList,
    /** element name */
    tag:(name:string)=>elList
    /** delay 影格再起動
     * @param sec setting wait 秒
     */
    delay:(sec:number)=>elOnly,
    /** 前往已設定標旗名位置影格
     * @param flagName 前往 標旗位置影格
     * @param count 迴轉次數
     */
    toFrame:(flagName:string,count:number)=>elOnly,

    /** 影格
     * @param fun element this
     * @param sec setting wait 秒
     * @param flagname 標旗名
     */
    frame:(fun:(el:elOnly)=>void,sec?:number,flagname?:string)=>elOnly,
    /**
     * 動畫
    */
    animate:animateModel,
    /**
     * style json ex:{"color":"#FF8800"}
    */
    style:(json:any)=>elOnly,
    /**
     * 刪除運行事件
    */
    remove:()=>elOnly,
    /**
     * 元素是否存在
     */
    exist:boolean
}

interface elList extends elTools<elList>
{
     /** delay 影格再起動
      * @param sec setting wait 秒
      */
     delay:(sec:number)=>elList,
     /** 前往已設定標旗名位置影格
      * @param flagName 前往 標旗位置影格
      * @param count 迴轉次數
      */
     toFrame:(flagName:string,count:number)=>elList,
 
     /** 影格
      * @param $t element this
      * @param sec setting wait 秒
      * @param flagname 標旗名
      */
     frame:($t:($t:elList)=>void,sec?:number,flagname?:string)=>elList,
     /**
      * 動畫
     */
     animate:animateModel,
     /**
      * style json ex:{"color":"#FF8800"}
     */
     style:(json:any)=>elList,
     /**
      * 刪除運行事件
     */
     remove:()=>elList,

    /**
     *  element list
     * @param row $t=element this, nu=row number
    */
    list:(row:($t:elOnly,nu:number)=>void)=>Array<elOnly>,
    /**
     * element indexOf number
    */
    at:(nu:number)=>elOnly,
    /**
     * 元素是否存在
     */
    exist:boolean
}
/**
 * html element animate for delay time
*/
interface pb_elAnimate_delay
{
    /**
     * @param fun delay into catch element
     * @param time delay time(sec)
     */
    (fun:(e:elAnimate)=>void,time:number):void
}

/** window / document 的包裝 (pb.el.win、pb.el.doc) */
export interface elWin<M>
{
    get:any,
    exist:boolean,
    /** 事件 (取代 window / document.addEventListener)
     * @example pb.el.win.on("scroll", ()=>{ … }, { owner:$t, throttle:"frame" });
     */
    on<K extends keyof M>(type:K, fn:(el:elWin<M>, e:M[K])=>void, opt?:elEventOpt):elWin<M>,
    on(type:string, fn:(el:elWin<M>, e:Event)=>void, opt?:elEventOpt):elWin<M>,
    off:(type?:string, fn?:Function)=>elWin<M>,
    /** 視窗大小 (pb.el.win) */
    rect:()=>elRect|null,
    /** 捲動視窗：pb.el.win.scrollTo({ top:0 }) */
    scrollTo:(opt?:elScrollOpt)=>elWin<M>,
    q:(selector:string)=>elOnly,
    qa:(selector:string)=>elList,
    contains:(x:Node|Event|elOnly|null|undefined)=>boolean
}

/**
 * html element animate
*/
interface elAnimate
{
    /** window (scroll、resize、hashchange、keydown…) */
    win:elWin<WindowEventMap>,
    /** document (click、pointerdown、keydown…) */
    doc:elWin<DocumentEventMap>,
    /** 包裝任何元素 / 事件 (取 e.target) / $t.$el；window、document 回傳 win、doc */
    of:(x:Element|Event|Window|Document|EventTarget|null|undefined)=>elOnly,
    /** 第一個符合 CSS 選擇器的元素 (querySelector) */
    q:(selector:string)=>elOnly,
    /** 全部符合 CSS 選擇器的元素 (querySelectorAll) */
    qa:(selector:string)=>elList,
    /** element attr id */
    id:(name:string)=>elOnly,
    /** element attr class */
    class:(name:string)=>elList,
    /** element attr name */
    name:(name:string)=>elList,
    /** element name */
    tag:(name:string)=>elList
}

/**
 * html element animate
*/
export interface elAnimateMain extends elAnimate
{
    /** delay catch for element */
    delay: pb_elAnimate_delay,
}