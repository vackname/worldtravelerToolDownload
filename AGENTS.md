# worldTraveler 工作區：AI / 開發者指引

> English version: [AGENTS.en.md](AGENTS.en.md)

這是 **worldTraveler（psyl）** 工作區：前端為 TypeScript + Vue 2.7 自有框架，後端可混用 .NET 10、Python 3.14、Go 1.27。
工具指令為 `wt`（VS Code 擴充功能「worldTraveler」的右鍵選單會呼叫同一組指令）。

## 目錄

```
worldtraveler.json         工作區設定（名稱、docker 網路、前端 core 備援）
.worldtraveler/            工作區金鑰（不進版控）
src/                       前端原始碼
  config/                  入口共用域：loadModel.ts（載入順序）、public.ts、InterfaceJsonHost.json（後端 API 主機）
  models/                  共用擴充組件（js / css / ts 模型）與 SDK 型別：vueSDK.ts、vueTemplateFormat.ts、SysConfig_Interface/
  <project>/               前端子專案（如 init、aa）：main.ts、main.html、main_VueTemp.ts、main_Interface.ts、
                           view/、controllers/、temp/、model/、package.json（封裝清單）、tscpackage.json（TS 模型）
extendsComponent/          自訂 Vue 元件（.vue：<template> + <script lang="ts"> + <style lang="scss">）
Libary&Document/libary/    圖片（封裝為 importLoad.img['資料夾']）
Libary&Document/jsonDoc/   多語系 / 設定 JSON（封裝為 importLoad.m.json['資料夾_檔名']）
dir/                       封裝輸出 = 網站 wwwroot（dir/libjs/*），請勿手動修改
DotNetProject/             .NET 10 後端（ConfigForSystem 共用庫在此）
PythonProject/             Python 3.14 後端
goProject/                 Go 1.27 後端
.vscode/launch.json        各後端的 Docker debug 設定（由 wt 產生）
docker-compose.yml         前端 debug + nginx 閘道 + Redis + 後端 API 服務（api-* 區塊由 wt 維護）
nginx/                     閘道設定：default.conf、routes/<API 名稱>.conf（由 wt 產生）
.env                       compose 參數：WT_PROJECT（含工作區 id）、WT_NETWORK、WT_PORT、COMPOSE_PROFILES、金鑰
```

## 前端框架寫法（重要慣例）

> **⚠ 必讀：修改 `src/` 或 `extendsComponent/` 前，先讀 [`createVueRule.md`](createVueRule.md)**（入口點、MVVM 分層、生命週期、各層寫法、`<json>` 文字集、`<totemp>` 巢狀樣板、`ajax` API 呼叫、`task` 非同步流程、wtd 多語系、src/models 外掛套件、主副檔命名、檢查清單），完成後依其 §13 檢查清單自我檢查。以下為摘要。

- **SDK 只從 `src/models/vueSDK.ts` 匯入**：`vueComponentModel`、`vueModelControllers`、`Component`、`task`、`pb`、`ajax`、`sleep`、`importLoad`、`MainVueTemplate`、`VueTemplate`。這些是執行期全域物件的型別包裝，不要改成 npm 套件。
- **新增頁面**：VS Code 右鍵「新增前端頁面...」，或 `wt fe new view <專案> <名稱>`（畫面）、`wt fe new doc <專案> temp/<路徑>.html`（樣板元件）。
- **一個畫面 = 同名的四個檔案**：`view/X.ts`（Vue 元件定義）、`view/X.html`（樣板）、`view/X.scss`（樣式，選用）、`view/X_Interface.ts` / `X_VueTemp.ts`（型別）。
  `controllers/X.ts` 放資料與事件。新增畫面請用 `wt fe new view`，它會同時更新 `package.json`。
- **元件物件格式**：`export default { data:{...}, init:($t)=>{}, temp:($t)=>({...}), completed:($t)=>{} } as vueComponentModel<Data, VueTemp>`
  - `$t` 是元件實例（等同 Vue 的 `this`），並帶有 `$t.import.url('@view/index')` 等載入函式。
  - `temp` 回傳要掛載的子樣板，用 `.exportVue({...})` 傳入資料。
- **前端核心版本**：`src/init/main.ts` 的 `.toVueVersion("vue2" | "vue3" | "auto")` 決定核心，輸出語法隨核心固定（vue2 = ES5、vue3 = ES2020）。`auto`：debug 用 vue2（console 通知）；release 輸出 `dir/libjs`（vue2）與 `dir/libjs3`（vue3），由中介軟體 `CoreSelect` 依瀏覽器選擇（detect / ua），程式以 vue2 規則撰寫（createVueRule.md §1.1.1）。不要在 tsconfig、`worldtraveler.json`、`.env` 設定 target。兩個核心共用同一份程式碼的寫法見 createVueRule.md §1.1.1。
- **箭頭函式**：可以照常寫（vue2 編譯成 ES5 一般 function；vue3 核心不會以 `new` 呼叫使用者函式）。
- **HTML 樣板特殊標籤**（詳見 createVueRule.md §8、§9）：
  - `<json map="tw.panel">{...}</json>` 或 `<json map="tw" src="lang/tw.json"></json>`：文字集 / 翻譯 / 靜態資料，以 `$t.getJson("tw")` 取用；同元件內深層合併
  - `<totemp content="參數">相對路徑.html</totemp>`：封裝時展開子樣板（可巢狀），路徑以**含此標籤的 html 檔**為基準；子樣板中 `@v{content}` 代換參數（舊寫法 `@>content<@` 仍可用但含 `<`，請改用 `@v{}`；沒有傳入值時封裝會警告）；`v-if` / `class` / `tag` 等屬性加在外框
  - `<totemp props="x.json" idx="0">item.html</totemp>`：依 json 陣列產生重複項目，子樣板用 `@v{[idx].欄位}`（索引名小寫）
  - `<bundle>true</bundle>`：release 時把樣板直接嵌入 JS，不另外產生 t*.txt（只用於很小、一定會顯示的樣板；先量過再加，見 createVueRule.md §9.5）
  - `<script>` / `<style>` 會被抽出，分別併入 JS / CSS；`<script lang="ts">`（或 `src="./X.script.ts"`）與 view 一起以 TypeScript 編譯（import 寫在最前面）；script 內用 `$view` 取得同名 .ts 的 export default（`$view.vue`）與元件 `$t`（`$view.created / ready / leave`）
- **載入順序**：`src/config/loadModel.ts` 決定載入順序（共用 css → public → 進入點子專案 `$t.p.init`）。
- **全站共用設定 (createVueRule.md §1.3)**：`src/config/public.ts` 建立 `importLoad.pub`（`config.get("title")` 取 `jsonDoc/config/<lang>.json`、`libSrc('x.png')` 取 `libary/pub` 圖檔）；加欄位時同步改 `config/interface/publicObjec_Interface.ts`。pub 只放載入後不變的設定 / 圖檔 / 工具函式，它不是響應式資料。
- **拆檔優先用 `<totemp>` (createVueRule.md §9.6)**：.html 直接嵌入 .html，不多產生 Vue 元件、共用父元件 data，沒有 exportVue 複本與載入時機問題；只有需要自己的生命週期 / 非同步載入時才拆成子元件。
- **呼叫後端 API**：一律用**相對路徑** `/<API 名稱>/...`（例：`ajax.Form.Get("/OrderApi/env/test")`），由 nginx 轉送，同一來源、不需 CORS（見下方「前後端共構」）。
  `src/config/InterfaceJsonHost.json` 只給 `wt fe tscdb` 取得 DB 結構用。
- **API 呼叫 (createVueRule.md §10)**：GET 用 `ajax.Form.Get`（`ajax.JSON` 沒有 Get）；每個呼叫都要 `.Catch`（沒寫時非 200 會自動重試 3 次且畫面沒反應）；業務錯誤由後端回 200 + `Ok:false`。
- **非同步流程 (createVueRule.md §11)**：`task.Factory.StartNew(...).ContinueWith({SuccessEvent})...ContinueCatch(...)`；每一步都要 `o.resolve` / `o.reject`，長任務離開時 `Abort()`。
- **多語系 (createVueRule.md §8.4)**：文字放 `temp/translation/<語系>/<文件>.json`，以 `wtd.doc($t,"文件")`（`src/config/wtd.ts`）取用；各語系結構需與預設語系相同（wt 會檢查）。
- **外掛套件 (createVueRule.md §12)**：js 套件放 `src/models/<名稱>/`（main.js 定義同名全域變數 + interface.ts），以 `$t.import.m.js.<名稱>(e=>e()...)` 離散載入；小型共用工具寫 `.ts` 直接 import。
- **元素、事件與捲動 (createVueRule.md §4.4.1)**：一律用 `pb.el`：`pb.el.win.on("scroll", f, { owner:$t, throttle:"frame" })`、`pb.el.doc.on(…)`、`pb.el.id("x").on("click", (el, e)=>…)`、`off`、`outside`、`delegate`、`pb.el.q / qa`、`.scrollTo({ offset })`、`.rect()`、`.cls`、`.attr`；不要直接寫 `addEventListener`、`removeEventListener`、`getElementById`、`querySelector`、`scrollIntoView`。`pb.el.id(x).get` 可能是 `null`，先判斷 `.exist`。
- **TS 模型 (createVueRule.md §12.3)**：商業程序 `wt fe new tsc <專案> model/<名稱>` → controllers `discreteModelLoad:{ $m:M.model_<名稱> }`；全站 TS 套件 `wt fe new tsc models <名稱>` → `$t.import.m.js.<名稱><T>(C=>new C($t))`。載入函式都回傳 Promise，可在 async action 裡 `const C = await $t.import.m.js.<名稱><T>()`（子專案 `await $t.import.p.<專案>()` 取得 insert）。兩者都**只能 `import type` 取型別**（一般 import 會打包進專案）。VS Code 右鍵有「新增 TS 模型 (商業程序)...」「新增 TS 套件 (models)...」。
- **models 多檔串接順序**：在 `src/models/<名稱>/<名稱>.json` 加 `"order": ["core.js", ...]`。

## 後端寫法

各語言專案都採用相同分類：

| 資料夾 | 用途 |
|---|---|
| `Config/` | 環境設定 |
| `Domain/` | 程序函式 |
| `Models/` | 運行商業功能 |
| `Repositories/` | 靜態資料、介面、資料格式 |

- **.NET**：
  - 用 `ProjectReference` 引用 `DotNetProject/ConfigForSystem`（JObj、JwtHelpers、DB migration、Redis、CacheMemoryService）。
  - 前端注入元件是 dll：`DotNetProject/worldTravelerVueMiddleWare/worldTravelerVueMiddleWare.dll`（`wt new dotnet webapi` 自動複製，csproj 以 HintPath 引用）。webapi 的 `Startup` 呼叫 `services.AddWorldTravelerVue()` 與 `app.UseWorldTravelerVue(Configuration)`（同時載入金鑰 WorldTraveler:TscPassword）。
  - 新增或移除專案請用 `wt`，它會同步維護 `<工作區>.sln` 與 `.slnx`。
- **Python**：Flask factory 寫在 `app.py`，路由放 `Models/routes.py`（Blueprint），設定放 `Config/config.json`，可用環境變數 `WT_<KEY>` 覆寫。
- **Go**：只用標準函式庫 `net/http`（Go 1.22+ 路由）。路由放 `Models/`，Redis / cache 工具放 `Domain/`，設定放 `Config/config.json`。

### 選哪一種語言（新增後端功能前先判斷）

| 語言 | 用在 | 例 |
|---|---|---|
| .NET | 大型、多人團隊；資料正確性要求高、運算或負載量大 | 訂單、金流、會員、報表、排程 |
| Python | 資料校驗與單元測試、爬蟲與資料解析、在記憶體產生圖片或影像 | 驗證腳本、爬蟲、報表圖表、縮圖、影像處理 |
| Go | 需要封裝保護的功能（編譯成單一執行檔，可呼叫但改不了）、給其它專案用的副程式、常駐監聽程序 | 加解密、授權驗證、檔案 / 佇列監聽、背景服務 |

## 前後端共構（nginx 閘道 + Docker debug）

```
瀏覽器 ──▶ nginx :WT_PORT（.env）
             ├─ /                 → web   前端 (dir/)
             ├─ /wsBundleDebugLog → web   存檔自動重新載入
             └─ /<API 名稱>/xxx   → <API 名稱>.api/xxx   (nginx/routes/<API 名稱>.conf，前綴去除)
                                     ├ VS Code F5「Docker <語言>:<名稱>」的 debug 容器
                                     └ 或 compose 服務 api-<名稱>（profile api，不除錯時）
所有容器在同一個 docker 網路（worldtraveler.json 的 network = .env 的 WT_NETWORK = tasks.json 的 dockerRun.network）
```

- **新增 API**：`wt new <語言> webapi -o <名稱>`（或右鍵）。wt 會一次完成：專案、`.sln`、launch/tasks、`docker-compose.yml` 的 `api-<名稱>` 服務、`nginx/routes/<名稱>.conf`。**不要手動複製這些設定**，移除時用 `wt remove`。
- **除錯 API**：VS Code 執行與偵錯選「Docker <語言>:<名稱>」→ F5。preLaunch 會先 `docker compose stop api-<名稱>`，再以相同主機名 `<名稱>.api` 啟動 debug 容器；nginx 每次請求重新解析 DNS，不需重啟。
- **不除錯時執行全部 API**：`docker compose --profile api up -d --build`（或右鍵 DotNetProject → worldTraveler → 以容器啟動全部後端 API）。
- **前端呼叫**：`ajax.Form.Get("/OrderApi/xxx")`。API 端的路由**不含**前綴（`/OrderApi/env/test` 到 API 是 `/env/test`）。要改前綴（例 `/api/order/`）就改 `nginx/routes/<名稱>.conf`，再 `docker compose exec nginx nginx -s reload`。
- **API 互相呼叫**：容器內直接用 `http://<名稱>.api/...`（不經 nginx）。
- **Redis 7.4**：`.env` 設 `COMPOSE_PROFILES=redis`（或右鍵「啟用 / 停用 Redis」），容器內主機名 `redis:6379`；本機 port 隨機，用 `docker compose port redis 6379` 查詢。後端設定的 Redis 主機請寫 `redis`。
- **命名不衝突**：compose 專案名稱 `WT_PROJECT` = 工作區名稱 + 6 碼 id（例：`myshop-3f9a1c`），容器、網路、volume、debug 映像檔都以它為前綴；網頁 port 由 install.sh 自動避開已使用的 port。**不要在 docker-compose.yml 寫死 `container_name`**，也不要寫死其他專案會用到的 host port。
- 實例：`nginx/routes/TourApi.conf` 把 `/TourApi/` 轉到 `TourApi.api`，前端 `ajax.Form.Get("/TourApi/tours")`。

## 指令

```bash
wt new dotnet|python|go webapi|console[|classlib] -o <名稱> [-p <port>]   # 後端專案 + Docker debug 設定
wt remove <語言> <名稱> --yes
wt fe build                           # 前端 release 封裝 → dir/libjs (核心 / 語法依 main.ts 的 toVueVersion)
wt fe debug --notify http://web       # 前端監看；存檔後約 1 秒瀏覽器自動重新載入
docker compose up -d                  # 前端 debug（web + bundle + nginx），開啟 http://127.0.0.1:<.env 的 WT_PORT>
# 訊息語系：.env 的 WT_LANG=zh | en (install.sh 依系統語言寫入；擴充功能依 VS Code 語言；中文 / 日文 → 中文，其他 → 英文)
# 前端模式：.env 的 WT_FE_MODE=debug | release，改完執行 docker compose up -d bundle (VS Code 狀態列「wT debug / wT release」一鍵切換)
docker compose --profile api up -d --build   # 以容器執行全部後端 API（不除錯）
docker compose exec nginx nginx -s reload    # 修改 nginx/ 後重新載入
```

## 給 AI 的注意事項

- **新增後端功能時先選語言**（見上方「選哪一種語言」）：使用者沒指定時，依工作性質選擇並說明理由；工作區已有同性質的 API 時優先加在既有專案，不要為一個小功能新開專案或改用別的語言。
- 不要把核心商業邏輯（金額、庫存、權限判斷）寫在 Python 腳本或前端；正確性要求高的計算放 .NET 的 `Domain/`。
- Python 產生圖片 / 影像時在記憶體處理後直接回傳（base64 或串流），不要寫進容器檔案系統；爬蟲要設逾時與重試上限。
- Go 用於加密或給其它專案呼叫的副程式時，金鑰從設定或環境變數讀取，不要寫死在原始碼；對外只開必要的路由。
- 三種語言回應格式不同（.NET 為 PascalCase `Ok / Data / Message`，Python / Go 為小寫），寫前端型別時對應各服務。
- 不要修改 `dir/`（封裝輸出）或 `DotNetProject/ConfigForSystem` 以外的生成檔，除非任務明確要求。
- 不要把前端改成 webpack、vite 或 npm 套件結構；這個框架靠 `package.json` 的 `inputFiles` 清單和 `wt fe` 封裝。
- 後端除錯一律在 Docker 中進行（`.vscode/launch.json`）。新專案的 port、容器名稱、hostname、compose 服務、nginx 路由都由 `wt` 分配與產生。
- 前端不要寫死 `http://127.0.0.1:5001` 之類的 API 網址；用相對路徑 `/<API 名稱>/...`。
- `docker-compose.yml` 中 `# >>> wt:api` … `# <<< wt:api` 區塊由 wt 維護；要加其他服務（DB、MQ…）請寫在區塊外，接上 `networks: [workspace]`，不要設 `container_name`。
