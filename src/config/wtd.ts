/**
 * wtd：worldTraveler translation document (多語系翻譯文件)
 *
 * 檔案   src/<專案>/temp/translation/<語系>/<文件>.json      (例：temp/translation/en/home.json)
 * 註冊   在使用它的 html 中，每個語系一行 (封裝時讀入並與同元件的 <json> 深層合併)：
 *          <json map="tw.home" src="../temp/translation/tw/home.json"></json>
 *          <json map="en.home" src="../temp/translation/en/home.json"></json>
 * 取用   wtd.doc<HomeText>($t, "home")      → 目前語系的 home 文件；該語系缺少時回退到預設語系
 * 語系   存在網站入口 main.init.lang (所有子專案共用)；wtd.set(main, "ja") 切換並記住
 * 檢查   wt 封裝時比對各語系與預設語系的結構 (缺少 key、陣列長度不同) 並列出警告
 *
 * 詳見 createVueRule.md §8.4
 */

/** 支援的語系 (key = translation/<key>/ 資料夾名) */
export const wtdLangs: Array<{ key: string, label: string, html: string, match: string[] }> = [
    { key: "tw", label: "繁體中文", html: "zh-Hant-TW", match: ["zh"] },
    { key: "en", label: "English",  html: "en",         match: ["en"] },
    { key: "th", label: "ไทย",      html: "th",         match: ["th"] },
    { key: "es", label: "Español",  html: "es",         match: ["es"] },
    { key: "hi", label: "हिन्दी",     html: "hi",         match: ["hi"] },
    { key: "ja", label: "日本語",    html: "ja",         match: ["ja"] },
    { key: "vi", label: "Tiếng Việt", html: "vi",        match: ["vi"] },
];

/** 預設語系：其他語系缺少文件時回退到這裡 (wt 也以它為結構檢查基準) */
export const wtdDefault = "tw";

/** 記住使用者選擇的 localStorage key */
const STORE = "wt_lang";

/** 可取用 wtd 的元件 ($t)：有 getJson，且由入口傳下 main */
export interface WtdHost
{
    getJson: <T>(key?: string) => T,
    main?: { init: { lang: string } }
}

const wtd = {
    langs: wtdLangs,
    defaultLang: wtdDefault,

    /** 目前語系 */
    lang: (t: WtdHost): string => (t.main && t.main.init.lang) || wtdDefault,

    /**
     * 取目前語系的文件
     * @param name 文件名 (= <json map="<語系>.<name>">)
     */
    doc: <T>(t: WtdHost, name: string): T => {
        const cur = t.getJson<{ [doc: string]: T }>(wtd.lang(t));
        if (cur && cur[name] !== undefined) return cur[name];
        const def = t.getJson<{ [doc: string]: T }>(wtdDefault);
        return def ? def[name] : (undefined as any);
    },

    /** 切換語系：寫入 main (所有子專案的畫面一起更新)、記住選擇、設定 <html lang> */
    set: (main: { init: { lang: string } } | undefined, lang: string) => {
        if (!main) return;
        main.init.lang = lang;
        try { localStorage.setItem(STORE, lang); } catch (e) { }
        wtd.apply(lang);
    },

    /** 設定 <html lang> (輔助技術、字型選擇) */
    apply: (lang: string) => {
        for (let i = 0; i < wtdLangs.length; i++)
            if (wtdLangs[i].key === lang) document.documentElement.setAttribute("lang", wtdLangs[i].html);
    },

    /** 初始語系：上次選擇 → 瀏覽器語言 → 英文 */
    detect: (): string => {
        try { const s = localStorage.getItem(STORE); if (s) return s; } catch (e) { }
        const n = (navigator.language || "en").toLowerCase().split("-")[0];
        for (let i = 0; i < wtdLangs.length; i++)
            if (wtdLangs[i].match.indexOf(n) > -1) return wtdLangs[i].key;
        return "en";
    },
};

export default wtd;
