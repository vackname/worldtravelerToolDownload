/**
 * 8-bit 像素圖示：以 emoji 為 key 對應 8 x 8 點陣，輸出 SVG data URI (crispEdges)
 * 文字集 (wtd json) 中的 icon 欄位維持 emoji，畫面以 <img v-bind:src="px(icon)"> 顯示像素版本，
 * 各語系不需修改；沒有對應點陣的 emoji 以「? 方塊」顯示。
 *
 * 共用 .ts 直接 import 的實例 (createVueRule.md §12.2)：init、learn 都 import 這個檔案。
 */
const PAL: { [c: string]: string } = {
    k: "#1a1a2e", w: "#ffffff", r: "#e63946", o: "#ff9f1c", y: "#ffd23f", g: "#3fa34d", c: "#4cc9f0",
    b: "#3a56d4", p: "#7b6cff", m: "#ff7bd5", n: "#8a5a2b", s: "#f4d6a0", d: "#8d99ae", l: "#d9dee8",
    K: "#0b1033", B: "#1d2a6b", M: "#5c1a1b", W: "#ffffff",
};

const S: { [emoji: string]: string[] } = {
    // ---- 一般
    "📦": ["..nnnn..", ".nyyyyn.", "nnnnnnnn", "nyyyyyyn", "nyynnyyn", "nyyyyyyn", "nyyyyyyn", "nnnnnnnn"],
    "👾": ["..p..p..", "...pp...", "..pppp..", ".pwppwp.", "pppppppp", "p.pppp.p", "p.p..p.p", "...pp..."],
    "🧩": ["...gg...", "...gg...", "gggggggg", "gggggggg", "ggg..ggg", "gggggggg", "gggggggg", "...gg..."],
    "🔌": ["..k..k..", "..k..k..", ".kkkkkk.", ".kddddk.", ".kddddk.", "..kddk..", "...kk...", "...kk..."],
    "🧠": ["..mmmm..", ".mmwmmm.", "mmmmwmmm", "mwmmmmmm", "mmmmmwmm", ".mmmmmm.", "..mmm...", "...mm..."],
    "📄": [".wwwwk..", ".wddwwk.", ".wwwwwk.", ".wddddk.", ".wwwwwk.", ".wddddk.", ".wwwwwk.", ".kkkkkk."],
    "🎨": ["..ssss..", ".srssys.", "ssssssss", "scsssss.", "sssssgs.", "sbsss...", ".ssss...", "........"],
    "🖼": ["kkkkkkkk", "kccccyck", "kcccccck", "kcgcccck", "kgggcgck", "kggggggk", "kggggggk", "kkkkkkkk"],
    "📁": ["........", "yyy.....", "yyyyyyyy", "yooooooy", "yooooooy", "yooooooy", "yyyyyyyy", "........"],
    "🗂": ["cc.bb...", "cccbbbbb", "cbbbbbbc", "cbwwwwbc", "cbbbbbbc", "cbwwwwbc", "cbbbbbbc", "cccccccc"],
    "🗄": ["dddddddd", "dkkkkkgd", "dddddddd", "dkkkkkgd", "dddddddd", "dkkkkkgd", "dddddddd", "d......d"],
    "🎮": ["........", "........", ".dddddd.", "dwddddrd", "wwwddrdr", "dwddddrd", ".dd..dd.", "........"],
    "⚙": ["...dd...", ".d.dd.d.", "..dddd..", "dddkkddd", "dddkkddd", "..dddd..", ".d.dd.d.", "...dd..."],
    "🔧": ["......dd", ".....d.d", "....ddd.", "...ddd..", "..ddd...", ".ddd....", "ddd.....", "dd......"],
    "🖥": ["kkkkkkkk", "kcccccck", "kcwcccck", "kcccccck", "kkkkkkkk", "...kk...", "..kkkk..", "........"],
    "⏱": ["...kk...", "..kkkk..", ".kwwwwk.", "kwwkwwwk", "kwwkkwwk", "kwwwwwwk", ".kwwwwk.", "..kkkk.."],
    "🧭": ["..kkkk..", ".kwwrwk.", "kwwwrwwk", "kwwkkwwk", "kwwkkwwk", "kwbwwwwk", ".kbwwwk.", "..kkkk.."],
    "🤖": ["...rr...", "..kkkk..", ".kcccck.", ".kwccwk.", ".kcccck.", ".kckkck.", "..kkkk..", ".k....k."],
    "🎫": ["........", "oooooooo", "o.oooo.o", "oowwwwoo", "oooooooo", "o.oooo.o", "oooooooo", "........"],
    "💱": ["..yyyy..", ".yyyyyy.", "yyykkyyy", "yyykyyyy", "yyyykyyy", "yyykkyyy", ".yyyyyy.", "..yyyy.."],
    "🌐": ["..bbbb..", ".bggbbb.", "bggggbgb", "bbggbbgg", "bbbbbggb", "bbbgbbbb", ".bbggbb.", "..bbbb.."],
    "🚪": ["..nnnn..", ".noooon.", ".noooon.", ".noooon.", ".nooyon.", ".noooon.", ".noooon.", ".nnnnnn."],
    "🧊": ["cccccccc", "cwwccccc", "cwcccccc", "cccccccc", "ccccccbc", "ccccccbc", "cccccbbc", "cccccccc"],
    "📜": [".ssssss.", ".skkkks.", ".ssssss.", ".skkkss.", ".ssssss.", ".skkkks.", ".ssssss.", "........"],
    "🔷": ["...b....", "..bbb...", ".bbcbb..", "bbcbbbb.", ".bbbbb..", "..bbb...", "...b....", "........"],
    "🏆": ["y.yyyy.y", "yyyyyyyy", ".yyyyyy.", "..yyyy..", "...yy...", "...yy...", "..yyyy..", ".kkkkkk."],
    "💡": ["..yyyy..", ".yyyyyy.", ".yywyyy.", ".yyyyyy.", "..yyyy..", "..dddd..", "..dddd..", "...dd..."],
    "👆": ["...s....", "...s....", "...sss..", "...ssss.", ".s.ssss.", ".sssssss", "..sssss.", "...sss.."],
    "🌍": ["..bbbb..", ".bggbbb.", "bggggbgb", "bbggbbgg", "bbbbbggb", "bbbgbbbb", ".bbggbb.", "..bbbb.."],
    // ---- 行程 (TourApi / RecommendApi 資料)
    "🍁": ["...r....", "r..r..r.", ".rrrrr..", "rrrrrrrr", ".rrrrr..", "..rrr...", "...n....", "...n...."],
    "🌌": ["bbbbbbbb", "bgbbbbgb", "bggbbggb", "bbggggbb", "bbbggbbb", "bwbbbbwb", "bbbbbbbb", "kkkkkkkk"],
    "🏝": ["cccccccc", "cccgggcc", "ccgggggc", "ccccnccc", "cccsnscc", "csssssss", "bbbbbbbb", "bbbbbbbb"],
    "🚂": ["........", "r..kk...", "rrrrrrr.", "rwwrrrrr", "rrrrrrrr", "rrrrrrrr", ".k.k..k.", "dddddddd"],
    "🍜": ["...d.d..", "..d.d...", "........", "yyyyyyyy", "wyyyyyyw", ".wwwwww.", "..wwww..", "........"],
    "🐫": ["........", "..n..n..", ".nnnnnn.", "nnnnnnnn", "n.nnnnnn", "..n..n..", "..n..n..", "........"],
};

const UNKNOWN = ["yyyyyyyy", "ykkkkkky", "yyyyykyy", "yyyykkyy", "yyykkyyy", "yyyyyyyy", "yyykkyyy", "yyyyyyyy"];
const cache: { [emoji: string]: string } = {};

/** 點陣 → SVG data URI (任意大小；同列相鄰同色合併為一個 rect，"." = 透明) */
function render(rows: string[]): string
{
    let rects = "";
    for (let y = 0; y < rows.length; y++)
    {
        let x = 0;
        while (x < rows[y].length)
        {
            const c = rows[y].charAt(x);
            let w = 1;
            while (x + w < rows[y].length && rows[y].charAt(x + w) === c) w++;
            if (c !== ".") rects += "<rect x='" + x + "' y='" + y + "' width='" + w + "' height='1' fill='" + PAL[c] + "'/>";
            x += w;
        }
    }
    const svg = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 " + rows[0].length + " " + rows.length + "' shape-rendering='crispEdges'>" + rects + "</svg>";
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

/** 網頁 favicon：16 x 16 的 8-bit worldTraveler (像素地球 + 紅色旅行帽，深藍底) */
const FAVICON = [
    ".KKKKKKKKKKKKKK.",
    "KKKKKKrrrrKKKKKK",
    "KKKKKrrrrrrKKKKK",
    "KKKrrrrrrrrrrKKK",
    "KKKKKccccccKKKKK",
    "KKKKcccggccbKKKK",
    "KKKccggggcccbKKK",
    "KKcggggggcccbbKK",
    "KKccggggccggbbKK",
    "KKcccggcccggbbKK",
    "KKbccccccgggbbKK",
    "KKKbcccccggbbKKK",
    "KKKKbbbbbbbbKKKK",
    "KKKKKbbbbbbKKKKK",
    "KKyyyyyyyyyyyyKK",
    ".KKKKKKKKKKKKKK.",
];
let faviconCache = "";
export function pixelFavicon(): string
{
    return faviconCache || (faviconCache = render(FAVICON));
}

/**
 * 作者動畫「大查帳」的標籤 (取代原本的 psyl 圖)：深紅牌子 + 網站 icon + 白色像素字 wt
 * 44 x 18；傾斜角度由 CSS 設定 (與原圖相同的斜放)
 */
let badgeCache = "";
export function pixelWtBadge(): string
{
    if (badgeCache) return badgeCache;
    const W = 44, H = 18;
    const grid: string[][] = [];
    for (let y = 0; y < H; y++) { grid.push([]); for (let x = 0; x < W; x++) grid[y].push((x === 0 || y === 0 || x === W - 1 || y === H - 1) ? "k" : "M"); }
    const paste = (rows: string[], ox: number, oy: number, scale: number, color?: string) => {
        for (let y = 0; y < rows.length; y++)
            for (let x = 0; x < rows[y].length; x++)
            {
                const c = rows[y].charAt(x);
                if (c === ".") continue;
                for (let sy = 0; sy < scale; sy++) for (let sx = 0; sx < scale; sx++) grid[oy + y * scale + sy][ox + x * scale + sx] = color || c;
            }
    };
    paste(FAVICON, 1, 1, 1);
    const w = [".....", ".....", "W...W", "W...W", "W.W.W", "W.W.W", ".W.W."];
    const t = [".W...", ".W...", "WWWW.", ".W...", ".W...", ".W..W", "..WW."];
    paste(w, 20, 2, 2, "W");
    paste(t, 31, 2, 2, "W");
    const rows: string[] = [];
    for (let y = 0; y < H; y++) rows.push(grid[y].join(""));
    return (badgeCache = render(rows));
}

/** emoji → 8-bit 圖示 data URI */
export default function px(emoji: string): string
{
    const key = (emoji || "").replace(/️/g, "");// 去掉 emoji 變體選擇符
    if (cache[key]) return cache[key];
    const rows = S[key] || UNKNOWN;
    return (cache[key] = render(rows));
}
