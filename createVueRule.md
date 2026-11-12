# 前端 MVVM 架構建置守則

適用於 worldTraveler 前端子專案 `src/<project>/`。
以下範例以子專案 `shop` 示意（名稱僅為舉例）；可直接參考的實作：`src/init`、`src/aa`。

> **AI 必讀**：在本工作區新增或修改前端（`src/`、`extendsComponent/`）之前，請先讀完本文件，並依 §13 檢查清單自我檢查。

本文件的生命週期是對照框架原始碼（`dir/libjs/worldTravelerBuildVue.min.js`，原始碼在工具的 `worldTravelerVue/SDK`，的 `oderLoad.Co`、`createdActionAndGetJsonAndInit`、`createMVCModelToCompleted`）整理的。框架升版後請重新核對。

---

## 1. 入口點

載入順序：`src/config/loadModel.ts`（共用 css → public）→ **整體專案入口 `init/main.ts`** → 第一個畫面 → 其他子專案在需要時以 `$t.import.p.<專案>` 載入 → **子專案入口 `<專案>/main.ts`** → 子專案的 view。

```
loadModel.ts ── $t.p.init ──▶ init/main.ts (application)
                                   │ CreateVue(temp=>temp.view_index)
                                   ▼
                              init/view/index  (第一個畫面，取得 main)
                                   │ $t.import.p.shop(...)
                                   ▼
                              shop/main.ts + shop/main.html (shop 專案入口)
                                   │ temp: $t.import.url("@view/index")
                                   ▼
                              shop/view/index (shop 的畫面)
```

### 1.1 整體專案最初入口點：`src/init/main.ts`

整個 application 只有這一個，**負責全域設定，不負責畫面內容**。

```ts
new CreateVue(temp=>temp.view_index)          // 第一個顯示的畫面
.toVueVersion("vue2")                         // 前端核心：vue2 (預設) / vue3 / auto (依瀏覽器自動選擇)
.addCommand("focus",dir=>...)                 // 全域自訂指令 (v-focus、v-upm …)
.getData<mainData>({ init:{ page:"", ... } }) // 全域共用數據
.getIcon($t=>...)                             // 網頁 icon
.getHeadTitle("init.page",$t=>...)            // 依 init.page 切換 <title>
.load($t=>({ main:$t }));                     // 把入口數據以 main 往下傳給畫面

export default undefined;                     // 不輸出樣版，也沒有 main.html
```

- 全域共用數據的型別寫在 `init/main_VueTemp.ts`（`mainData`、`main`）。
- 畫面中以 `$t.main` 取用入口數據，例：`$t.main.init.page = 'index'` 會觸發 html title 切換。
- **不要在這裡寫畫面邏輯。** 畫面寫在 `init/view/`，各功能寫在子專案。
- 只有 application 層級的東西放在這裡：全域指令、共用數據、icon、title。

#### 1.1.1 前端核心版本：`.toVueVersion("vue2" | "vue3" | "auto")`

封裝與 debug 讀取這一行決定核心；**輸出語法由核心固定，不需（也不能）另外設定 target**。

| 寫法 | 核心 | 輸出語法 | 適用 |
|---|---|---|---|
| `.toVueVersion("vue2")`（預設；沒寫也是 vue2） | worldTravelerVue（Vue 2.7） | ES5 | 全球性使用：IE11、舊手機、電視、App 內嵌 WebView |
| `.toVueVersion("vue3")` | worldTravelerVue3（Vue 3.5 compat） | ES2020 | 效能性使用：Chrome 80+ / Edge 80+ / Firefox 74+ / Safari 13.1+ |
| `.toVueVersion("auto")` | debug：vue2；release：vue2 + vue3 兩套 | ES5 + ES2020 | 兩者兼顧：新瀏覽器跑 vue3，舊瀏覽器自動退回 vue2 |

**`auto`（依瀏覽器自動選擇）**：
- **debug**：只用 vue2（ES5），瀏覽器 console 會顯示黃色通知，`window.wtAutoCore = "debug-vue2"`。要在 debug 測 vue3，請暫時改成 `"vue3"`。
- **release**：依序輸出 `dir/libjs/`（vue2、ES5）與 `dir/libjs3/`（vue3、ES2020）兩套完整輸出，封裝時間約 2 倍。實測兩套和單獨封裝 vue2、vue3 的結果逐檔相同，不會互相影響。
- **選擇方式**（`worldTravelerVueMiddleWare` 的 `CoreSelect.Tag(context)`，VueDebugWeb 首頁已使用）：
  - `detect`（預設）：頁面內嵌偵測程式，瀏覽器能執行 `Proxy` 與 `?.` / `??` 就載入 `/libjs3/`，否則載入 `/libjs/`。網址不同，CDN 與瀏覽器快取都安全。
  - `ua`：伺服器依 User-Agent 輸出 `<script>`（Chrome / Edge 80+、Firefox 74+、Safari 13.1+、iOS 13.4+、Samsung 13+；IE、舊 Edge、無法辨識的一律 vue2），回應加 `Vary: User-Agent`。
  - 切換方式：appsettings 的 `WorldTraveler:CoreSelect`（`detect` / `ua`）或環境變數 `WT_CORE_SELECT`。
- **強制指定**（測試、客服排查）：網址 `?wtcore=vue2|vue3`、cookie `wtcore`；`detect` 模式另支援 `localStorage.wtcore`。執行中可用 `window.wtAutoCore` 判斷選擇結果（例：`detect-vue3`、`ua-vue2`、`forced-vue2`）。
- **程式以 vue2（ES5）規則撰寫**：tsconfig、VS Code 一律用 es5 + `es2015.promise`，用到 ES2015+ API 時仍會出現 TS2550。改回 `"vue2"` / `"vue3"` 時，封裝會移除舊的 `dir/libjs3/`。

**多個前端站台（同一個網站服務多個專案的前端）**：`worldTravelerVueMiddleWare` 依子網域或 GET 參數選擇站台，`CoreSelect.Tag(context)` 自動輸出該站台的核心路徑。
- **部署**：把另一個專案的 `dir/` 內容放到 `wwwroot/<站台>/`，路徑命名不變，例如 `wwwroot/b/libjs/`、`wwwroot/b/libjs3/`。預設站台維持 `wwwroot/libjs/`。
- **設定**：appsettings 的 `WorldTraveler:Sites`（例 `["a", "b"]`）或環境變數 `WT_SITES=a,b`。站台名稱 = 子網域第一段 = 資料夾名稱。
- **選擇順序**：
  1. `?wtsite=b`（參數名稱為 `WorldTraveler:SiteQuery`，空字串 = 停用）；
  2. `WorldTraveler:SiteHosts` 的完整網域（例 `{"shop.example.com": "b"}`）；
  3. 子網域第一段（`b.worldtraveler-tools.dev` → `b`）；
  4. 其他都是預設站台。
- **網域**：取法與 `ConfigForSystem` 的 `RequestExtensions.getCatchHeadDomainName` 相同，先看 header `domaincatch`（反向代理注入），再看 Host。
- **限制**：只有列在 `Sites` 的名稱有效，其他值一律回到預設站台。
- **核心不用改**：核心從自己的 `<script src>` 推算根目錄，從 `/b/libjs/` 載入後，專案檔、樣板、`worldTravelerHead` 都從同一個站台取。執行中可用 `window.wtSite` 判斷站台（預設站台為 `""`）。
- **各站台各自判斷**：auto、debug 都依各站台自己的輸出判斷；debug 輸出的站台不使用記憶體快取。
- **前端程式不用知道站台**：不要在程式裡寫死 `/libjs/` 或 `/b/libjs/`，路徑都由核心推算。

- 同一份專案程式碼兩個核心都能跑，切換只改這一行：前端 debug 執行中存檔會自動換核心並全部重新封裝（約 1–2 秒）；release 封裝（`wt fe build`）也依這一行選核心。
- 核心選用優先順序：`--core` 參數 > `main.ts` 的 `toVueVersion` > `worldtraveler.json` 的 `frontend.core`。`worldtraveler.json` 不再有 `frontend.target`，`.env` 也不再有 `WT_TARGET`。
- 執行時若 `toVueVersion` 與實際載入的核心不同，console 會提示。執行中可用 `window.wtVueVersion` 判斷目前核心。
- 寫給兩個核心都能跑的程式：
  - 格式化建議一律用 `{{ $f.名稱(值) }}`（見 §3.4）。`{{ 值 | 名稱 }}` 目前兩個核心都能跑（Vue 3 靠 compat），新程式不要再用。
  - 同一個元素同時有 `v-for` 與 `v-if` 時，Vue 3 先算 `v-if`。封裝工具會自動改成 `<template v-for>` 包住，但新寫的樣板請直接用 `<template v-for>` 或 computed 過濾。
  - 自訂指令的 `binding.expression` 在 Vue 3 沒有值，請改用 `binding.value`。
  - 不要依賴 `$vnode`、`$children`、`$listeners` 等 Vue 2 專屬屬性。

### 1.2 子專案入口點：`src/<專案>/main.ts`（例：`src/shop/main.ts`）

每個子專案各有一個，是**這個專案被載入時的根元件**，寫法與 view 相同（`vueComponentModel`），並搭配 `main.html`。

```ts
export default {
data:{ maindata:{...}, VueName:"" },
temp:($t)=>{                                // init 執行完後自動執行 (不需 toLoad)
    $t.VueName = "view1";                     // 要顯示的子樣版名
    return {
        view1:$t.import.url("@view/index")    // 掛上專案內的畫面
            .exportVue({ main:{...}, datamain:$t.maindata })   // 往下傳數據
    };
}
} as vueComponentModel<mainView.Data,mainVueTemp>;
```

```html
<!-- main.html -->
<div id="shop_main">
    <component v-bind:is="getVue(this,VueName)"></component>
</div>
```

- 職責是**決定專案要顯示哪個畫面**，以及往下傳專案共用數據（`exportVue`）。
- 專案內的切頁（換 `VueName`、`temp` 掛多個 view）在這裡處理。各畫面的內容寫在 `view/`。
- 往下傳的數據型別寫在 `main_Interface.ts`（例：`view_indexTemp`）。子畫面的 `X_VueTemp.ts` 要 extends 它，才能用 `$t.main`、`$t.datamain`。
- 其他專案載入本專案時，拿到的就是這個入口（見 §6）。

### 1.3 全站共用設定：`src/config/`

| 檔案 | 用途 |
|---|---|
| `loadModel.ts` | 核心載入後第一個執行：共用 css（`$t.m.css.sit`）→ `setPublic`（公用設定 + 圖檔）→ `$t.p.init`。每一步在上一步的回呼中執行 |
| `public.ts` | 建立 `importLoad.pub`：`config`（`Libary&Document/jsonDoc/config/<lang>.json`）、`lib`（`Libary&Document/libary/pub/` 圖檔）、`lang`、`libSrc` |
| `interface/publicObjec_Interface.ts` | `importLoad.pub` 的型別；**在 public.ts 加欄位時兩邊一起改** |
| `interface/` 其他檔案 | 全站共用型別：API 回應格式（`APIResFormat<T>`）、共用 enum |
| `InterfaceJsonHost.json` | `wt fe tscdb` 取得後端資料表 / enum 結構的主機清單（只用於開發時產生 `TablesAPI` / `EnumsAPI`，執行時不用） |
| `wtd.ts`、`pixelIcon.ts` | 共用 `.ts` 工具（多語系、8-bit 圖示） |

```ts
importLoad.pub.config.get("title")                 // 取設定；用「.」取深層欄位：get("page.index")
importLoad.pub.config.load("config.en",e=>{...})   // 換 config 檔 (e=="fail" 代表不存在)
```

```html
<img v-loadimg="importLoad.pub.libSrc('close.png')" />          <!-- 等圖片載入後顯示 (推薦) -->
<img v-bind:src="importLoad.pub.lib.src(on ? 'on.png' : 'off.png')" />
```

- **pub 放「載入後不變」的東西**：網站設定、公用圖檔、全站共用的小工具函式與選單清單（例：`daysOfMonth(year)`、`langSelect`）。
- **pub 不是元件 data**，修改後畫面不會自動更新。會變動且要反應在畫面上的值（目前語系、登入者）放 `main.init` 或元件 data。
- 某個畫面的文字放該專案的 wtd / `<json>`，不要放 pub。
- 要在進入點前多載入共用資源時，加在 `loadModel.ts` 的 `setPublic` 回呼中、`$t.p.init` 之前；畫面專用的資源不要放這裡（會拖慢首頁）。

---

## 2. 分層對照

### 2.1 MVVM 對應

以 `shop/view/index` 為例：

| MVVM | 檔案 | 職責 |
|---|---|---|
| **View** | `view/index.html`（+ `index.scss`） | 畫面：樣板與樣式 |
| **ViewModel** | `view/index.ts` | 畫面的狀態與事件：渲染用的 `data`、樣板呼叫的 `action`、生命週期 |
| **Controllers** | `controllers/index.ts` | 數據溝通：在 view 與 model 之間傳遞數據（設定值、執行狀態），並負責載入 / 注入 model（`$m`、`$an`） |
| **Model** | `model/index.ts` | 運行函式：商業邏輯 function |

> 這個框架在標準 MVVM 之外多了 **Controllers** 層。ViewModel 只管畫面，數據與 model 的載入交給 controllers，運算交給 model。

### 2.2 什麼時候要建 `view/`

`view/` 用來放「**畫面**」。下列情況需要新增一組 view（`view/X.ts` + `view/X.html`，用 `wt fe new view <專案> <名稱>` 建立）：

- **載入畫面類**：一個獨立的頁面或畫面，例如專案入口畫面 `view/index`、使用者頁 `view/userset`。
- **需要再加入另一個子頁**：父畫面的 `temp` 要掛上一個子頁時，子頁本身就是一組 view，例如 `shop/main.ts` 的 `temp` 掛上 `@view/index`。

只是畫面中重複出現的小區塊時，不用另建一組 view，依需求二選一：

| 需求 | 做法 |
|---|---|
| 純 html 片段，共用父畫面的資料與 action（提示文字、列表項目、表單區塊） | 只建 `temp/<路徑>.html`，在父樣板用 `<totemp>` 嵌入（見 §9） |
| 有自己的 data / action / 生命週期的元件 | `wt fe new doc <專案> temp/<路徑>.html`（同時產生 ts），由父層 `temp` 掛載 |

每一組 view 都可以有同名的 `controllers/X.ts`、`model/X.ts`，分工照下表。

### 2.3 檔案分工

一個畫面 `X` 由下列檔案組成，各層只做自己的事：

| 層 | 檔案 | 放什麼 | 不放什麼 |
|---|---|---|---|
| **ViewModel** | `view/X.ts` | `data`：**直接渲染於樣板的變數**<br>`action`：樣板事件（轉呼叫 `$t.$m`）、只供樣板用的 style / 顯示計算<br>`init` / `temp` / `completed` 生命週期 | 商業邏輯、設定值、計時器狀態 |
| **View** | `view/X.html` | 樣板：綁定 `data`、呼叫 `action` | `<style>`（改寫在 `X.scss`）、邏輯運算 |
| | `view/X.scss` | 版面樣式、`transition`（Sass 變數 / mixin / 巢狀，加註解） | `@keyframes` 動畫（改寫在 animateModel） |
| | `view/X_Interface.ts` | View 的 `Data`、`Action` 型別，以及渲染資料的型別（例：`Animal`、`Food`） | 設定類型別 |
| | `view/X_VueTemp.ts` | `$t` 的完整型別 = View Data + Controllers Data + 父層注入 + `VueTemplate` | — |
| **Controllers** | `controllers/X.ts` | `data`：**與 model 溝通的數據**，包含設定值（`conf`）、執行狀態（`game`：流水號、計時器）<br>`completed`：**注入 `$m`、`$an`** | 渲染變數、商業邏輯 |
| | `controllers/X_Interface.ts` | Controllers `Data` 型別、設定類型別（例：`AnimalKind`、`MeadowConfig`）、`$m` / `$an` 型別 | — |
| **Model** | `model/X.ts` | **商業邏輯 function**：讀 controllers 的數據，寫 view 的渲染變數，呼叫 `$an` 播動畫 | DOM 操作、事件物件（`MouseEvent`）、動畫細節 |
| **Animate** | `animateModel/<名稱>.ts` | 用 `pb.el` 寫的動畫（取代 css `@keyframes`） | 商業邏輯 |

### 2.4 檔案命名：主檔與副檔

同一個畫面（或樣板元件、子專案入口）的檔案**共用一個主名稱**，用後綴分出副檔。工具依主名稱配對，名稱與大小寫必須一致：

| 檔案 | 角色 | 會被封裝成元件？ |
|---|---|---|
| `view/X.ts` | 主檔：ViewModel（data / action / 生命週期） | 是 |
| `view/X.html` | 樣板（View）；與 `X.ts` 組成樣板 `view_X` | 是 |
| `view/X.scss` | 樣式（需登錄 package.json） | 是（css） |
| `view/X_Interface.ts` | 型別：Data、Action、渲染資料 | 否（只被 import） |
| `view/X_VueTemp.ts` | `$t` 的完整型別 | 否（只被 import） |
| `controllers/X.ts`、`controllers/X_Interface.ts` | 同名 controllers 與其型別；`controllers/X.ts` 自動與 `view/X` 合併 | 是 / 否 |
| `model/X.ts` | 同名 model（商業邏輯） | 由 import 帶入 |

- 子專案入口：`main.ts`、`main.html`、`main_Interface.ts`、`main_VueTemp.ts`。
- 樣板元件：`temp/<路徑>/X.ts`、`.html`、`.scss`、`X_Interface.ts`、`X_VueTemp.ts`。
- **不要手動建立整組檔案**：用右鍵「新增前端頁面...」或 `wt fe new view / doc`，會一次產生並登錄 package.json。

### 資料流

```
使用者事件 View (X.html)
   │  v-on:click="feedAll()"
   ▼
ViewModel action (view/X.ts)    ← 只做轉接：把 DOM 事件換算成純數值
   │  $t.$m.feedAll()
   ▼
Model (model/X.ts)              ← 商業邏輯
   │  讀  $t.conf / $t.game      (controllers 數據)
   │  寫  $t.foods / $t.tip ...  (view 渲染變數)
   │  呼叫 $t.$an.drop(food)     (動畫)
   ▼
Vue 重新渲染 X.html  +  animateModel 對元素播放 pb.el 動畫
```

---

## 3. 生命週期

### 3.1 執行順序

```
【建立 Vue 之前】(oderLoad.Co)
 1. 合併 data：controllers.data 併入 view.data (同名時 view 勝出；請勿重名)
 2. 加入保留 key：data.v (框架使用，請勿自訂 v)
 3. 註冊 funComputed / watch (view 與 controllers 都有效)

【Vue created hook】
 4. $t.import 掛上 (import.url / import.p / import.m)
 5. props：父層 <component> 傳入的屬性 ($attrs) 複製到 $t
 6. view.action($t)：回傳的 function 掛到 $t 上 (樣板可呼叫)
 7. getJson：<json> 標籤資料
 8. view.init($t)
      └ init 執行完 → 核心自動執行 view.temp($t)，非同步註冊子樣版 (不需呼叫 toLoad)
 9. discreteModelLoad (若有：view / controllers，非同步載入 tsc model)
10. controllers.completed($t)    ← 先
11. view.completed($t)           ← 後

【Vue mounted 之後】
12. DOM 產生 → $t.$el 可用
```

### 3.2 各階段守則

| 階段 | 用途 | 守則 |
|---|---|---|
| `data` (view) | 渲染變數初始值 | 只放樣板會用到的；陣列 / 物件給空值，真正內容在 model 的 reset / start 建立 |
| `data` (controllers) | 設定、執行狀態 | 設定寫死在這裡；執行狀態給初始值（例：`timer:0`） |
| `action` | 樣板方法 | 在 `init` **之前**就掛上，所以 init 內可以呼叫 |
| `init` (view) | 樣版初始化 | 選用。`init` 執行完後核心會**自動執行 `temp`**（順序固定 init → temp → completed），**不需要寫 `$t.import.toLoad()`**。此時 **`$m`、`$an` 還不存在**，不可使用 |
| `temp` | 子樣版 | 回傳 `{ 名稱: $t.import.url("@view/xxx").exportVue({...}) }`；跨專案樣板要用 `$t.import.p.<專案>(...)` 先載入專案（見 §6） |
| `completed` (controllers) | 注入 model | `$t["$m"] = new toModel($t)`、`$t["$an"] = new animate_xxx($t)` |
| `completed` (view) | 啟動 | 可以使用 `$m` / `$an`，例：`$t.$m.start()` |

### 3.3 注意事項

- **controllers 的 `init`、`action`、`temp` 不會被框架呼叫。** controllers 只有 `data`、`completed`、`discreteModelLoad`、`funComputed`、`watch` 有效。
- **view 沒有 `completed` 時，controllers 的 `completed` 也不會執行**（沒有 `discreteModelLoad` 的情況），結果是 `$m` 沒有被注入。需要 `$m` 時，view 一定要寫 `completed`，即使內容是空的。
- **`completed` 執行時 DOM 可能還沒產生。** 沒有 `discreteModelLoad` 時，`completed` 會在 Vue `created` 裡同步執行，這時元素還不在畫面上。要操作 DOM 或 `pb.el` 時，請用 `$t.$nextTick(...)` 或等待元素出現，例：
  ```ts
  const whenReady = (id:string, fn:()=>void, tries=50)=>
      pb.el.id(id).exist ? fn() : (tries>0 && setTimeout(()=>whenReady(id,fn,tries-1),50));
  ```
- **元件移除時用 `leave`（destroyed / unmounted）收尾；事件用 `pb.el` 的 `{ owner:$t }` 會自動解除（§4.4.1）。** 計時器或常駐動畫也可以在迴圈裡判斷元件是否已離開 document（`pb.el.doc.contains($t.$el)`），離開就停止，例：
  ```ts
  start = ()=>{ $t.game.timer = setInterval(()=>{ if(!pb.el.doc.contains($t.$el)) return this.stop(); this.tick(); }, $t.conf.tickMs); };
  stop  = ()=>{ clearInterval($t.game.timer); $t.game.timer = 0; };
  ```
- **`data` 的複本（實測）**：以 `exportVue` 建立的元件，每個實例拿到 data 的 `JSON.parse(JSON.stringify(...))` 複本（陣列不共用；函式消失、`Date` 變字串），所以 data 只放可 JSON 化的初始值。沒有經過 `exportVue` 的樣板會共用同一個 data 物件，請在 model 的 reset 中重新指定新陣列（`$t.animals = [...]`）。
- **同名合併（實測，學習網「controller / view 運行週期」探測元件）**：
  - data 同名：**view 勝出**；watch 同名：**只有 controllers 的會觸發**。
  - `exportVue({x})` 的 x 如果 view.data 也宣告了，**傳入值會被忽略**。exportVue 的 key 只宣告在 `X_VueTemp.ts`，不要寫進 view.data。
  - exportVue 傳入的值不經過複製（例：`main` 是同一個物件）。
- **`funComputed` 會執行很多次**：註冊樣板時先以空物件 `{}` 呼叫一次取得 key，之後每次讀取 computed 都會呼叫。只回傳計算定義，不要寫副作用。
- **實測順序**：`view.action` → `view.init` → `view.temp`（init 後自動執行）→ `controllers.completed`（注入 `$m`）→ `view.completed`（DOM 尚未產生）→ `$nextTick`（DOM 出現）。`controllers.init` 不會被呼叫。
- **v-if 會重建、v-show 會保留**：v-if 切換＝新實例、全部階段重跑、資料歸零。

### 3.4 簡化寫法（核心新功能，舊寫法照常可用；Vue 2 / Vue 3 核心寫法相同）

```ts
// view/detail.ts：不必寫 init，也不必為了 $m 寫空的 completed
export default {
data:{ price:0 },
temp:($t)=>({ child:$t.import.url("@view/child").exportVue({ main:$t.main }) }),   // init 後自動執行
funcFilters:($t)=>({ twd:(v:number)=>"NT$ " + Math.round(v) }),                   // → {{ $f.twd(price) }}
ready:($t)=>{ $t.$m!.start(); },     // DOM 已產生 (Vue mounted)：可直接做動畫
leave:($t)=>{ $t.$m!.stop(); },      // 元件移除 (Vue destroyed / unmounted)：清計時器、監聽
action:$t=>({ ... })
} as vueComponentModel<...>;

// controllers/detail.ts
export default {
data:{ run:{ timer:0 } },
inject:{ $m:toModel, $an:animate_detail },   // completed 前自動 new 並注入
} as vueModelControllers<...>;
```

| 新功能 | 規則 |
|---|---|
| 不需 toLoad | `init` 執行完後核心自動執行 `temp`，順序固定 init → temp → completed；舊程式在 init 呼叫 `$t.import.toLoad()` 仍可（不會重複執行）。`$t.import.p.<專案>(…).toLoad()` 是掛上子專案樣板，**仍須呼叫** |
| `controllers.completed` | 一律執行（不再依賴 view 有沒有 completed） |
| `inject` | `{ $m:Class, $an:Class }`，在 controllers.completed 之前注入；`$t` 已有同名時不覆蓋 |
| `ready` | DOM 已產生；controllers 先、view 後；有 discreteModelLoad 時可能早於 completed |
| `leave` | 元件被移除（v-if false、父層重建）；v-show 隱藏不會觸發 |
| `$f` 格式化函式 | 全站：`init/main.ts` 的 `.addFormat("名稱", fn)`；元件：`funcFilters`（同名時元件優先）。樣板建議寫 `{{ $f.名稱(值) }}`（可多個參數）；舊的 `{{ 值 \| 名稱 }}` 在 Vue 2 與 Vue 3 核心（@vue/compat）都能用（已實測），但 Vue 3 官方已移除 filter，新程式請用 `$f` |

---

## 4. 各層寫法

### 4.1 ViewModel — `view/X.ts`

```ts
export default {
data:{                       // 只放直接渲染的變數
    show:false,
    animals:[],
    hearts:0
},
temp:($t)=>({}),             // init 執行完後自動執行 (不需 toLoad)
completed:($t)=>{
    $t.$m.start();           // controllers.completed 已注入 $m
    $t.show = true;
},
action:$t=>{
    return{
        feedAll:()=>$t.$m.feedAll(),                 // 純轉接
        clickGround:(e:MouseEvent)=>{                // DOM 事件 → 純數值，再交給 model
            var r = (e.currentTarget as HTMLElement).getBoundingClientRect();
            $t.$m.clickGround((e.clientX-r.left)/r.width*100,(e.clientY-r.top)/r.height*100);
        },
        posStyle:(x:number,y:number)=>({left:x+"%",top:y+"%"})   // 只供樣板的 style 計算
    } as indexView.Action
}
} as vueComponentModel<indexView.Data,indexVueTemp>;
```

- `action` 回傳的 function 型別寫在 `X_Interface.ts` 的 `ActionFunction`（選用屬性 `?`）。
- `action` 內不要寫超過「轉接 + 換算」的邏輯。只要開始有 if / 迴圈處理資料，就移到 model。

### 4.2 Controllers — `controllers/X.ts`

```ts
export default {
data:{
    conf:{ groundTop:60, maxAnimals:12, tickMs:50, kinds:[...] },  // 設定
    game:{ seq:0, timer:0, attached:false }                        // 執行狀態
},
completed:($t)=>{
    $t["$an"] = new animate_index($t);    // 動畫 model
    $t["$m"]  = new toModel($t);          // 商業邏輯 model
}
} as vueModelControllers<indexControllers.Data,indexVueTemp>;
```

- `$m`、`$an` 寫在 `controllers/X_Interface.ts` 的 `joinModeldownFormat`。它們不屬於 `data`，但型別要讓 `$t` 看得到。
- 把 `$an` 這種注入物件寫進 **view 的 `Data`** 會造成封裝錯誤 `TS2352 Property '$an' is missing`，因為 view 的 `data` 物件裡沒有它。

### 4.3 Model — `model/X.ts`

```ts
let $t:indexVueTemp;
const rand = (a:number,b:number)=> a + Math.random()*(b-a);   // 純函式放 class 外

export default class index
{
    constructor($tObj:indexVueTemp){ $t = $tObj; }

    /** 對外：view action 呼叫 */
    feedAll = ()=>{
        for(var i=0;i<4;i++) this.addFood(rand(8,92),this.randGroundY());
        $t.tip = "開飯囉！";
    };

    /** 對內輔助 */
    private randGroundY = ()=> rand($t.conf.groundTop,$t.conf.groundBottom);
}
```

- 方法一律用**箭頭函式屬性**（`name = ()=>{}`）。這樣傳給 `setInterval` 或回呼時不會遺失 `this`。
- 只供內部使用的方法加 `private`。對外方法要寫 JSDoc，說明參數單位（例：`xPct` 代表場景寬度 %）。
- 參數用純數值或資料物件，**不接收 `MouseEvent` / `HTMLElement`**，換算交給 view action 處理。
- 需要動畫時呼叫 `$t.$an.xxx()`，model 不直接使用 `pb.el`。

### 4.4 Animate — `animateModel/<名稱>.ts`

參照 `init/animateModel/author.ts`。

```ts
pb.el.id("元素id").animate(
    {"duration":0.6,"delay":0,"count":1,"timing":"ease-out"},   // 動畫基本配置
    {"0%":{"transform":"scale(1)"},"100%":{"transform":"scale(1.2)"}}   // 影格
).frame(()=>{ /* 播完後 */ }).remove();   // remove = 播完後移除產生的 style
```

守則：

1. **同一個元素一律用 `pb.el.id(id)` 從頭取。** 產生的 style 名稱由呼叫鏈決定（例：`i_divd_<id>ani`），從同一條路徑取，新動畫才會覆蓋舊的。
2. **`count:"infinite"` 要放在呼叫鏈最後。** 接在無限動畫後面的 `.frame()` / `.remove()` 永遠不會執行。要停止無限動畫，請另外呼叫 `pb.el.id(id).remove()`。
3. **`animate` 會覆蓋整個 `transform`。** 已經用 `transform` 定位的元素（例：`translate(-50%,-100%)`），請在內層加一個 `<span>` 專門做動畫，或在影格中寫回原本的 transform。
4. **Vue `v-for` 產生的元素要等 DOM 更新後再取用**（`$nextTick` 或輪詢 `pb.el.id(id).exist`）。
5. 動畫元素的 id 規則集中定義（例：在 animateModel 檔內 `const elId = { body:(id:number)=>'shop_body_'+id }`），並與 `X.html` 保持一致。
6. 一次性動畫結尾要接 `.remove()`，避免 `<style>` 越積越多。
7. 要在播完後才把元素從資料中移除時，使用 `.frame(()=>移除資料).remove()`。這個順序可以避免 style 先被移除而閃回原位。

### 4.4.1 元素、事件與捲動：一律用 `pb.el`（取代原生 DOM）

**不要直接寫** `addEventListener`、`removeEventListener`、`document.getElementById`、`querySelector`、`scrollIntoView`、`getBoundingClientRect`、`classList`。只有第三方套件內部可以例外。改用 `pb.el`，自動解除、節流、型別都一起得到；核心是 ES5，vue2（IE11）與 vue3 相同。

| 原生寫法 | `pb.el` |
|---|---|
| `window.addEventListener("scroll", f)` | `pb.el.win.on("scroll", f, { owner:$t, throttle:"frame" })` |
| `window.removeEventListener("scroll", f)` | `pb.el.win.off("scroll", f)` |
| `document.addEventListener("click", f)` | `pb.el.doc.on("click", f)` |
| `el.addEventListener("click", f)` | `pb.el.id("x").on("click", f)`、`pb.el.of(el).on(…)` |
| `document.getElementById("x")` | `pb.el.id("x").get`（型別 `HTMLElement \| null`，先判斷 `.exist`） |
| `document.querySelector(".x")` / `querySelectorAll` | `pb.el.q(".x")` / `pb.el.qa(".x")`；元素內：`pb.el.id("box").q(".x")` |
| `el.scrollIntoView({ behavior:"smooth" })` | `pb.el.id("x").scrollTo({ smooth:true, block:"start", offset:80 })`（offset 避開固定導覽列） |
| `window.scrollTo(0, 0)` | `pb.el.win.scrollTo({ top:0 })` |
| `el.getBoundingClientRect()` | `pb.el.id("x").rect()`（不存在時 `null`） |
| `box.contains(e.target)` | `pb.el.id("box").contains(e)` |
| `e.target.closest("li")` | `pb.el.of(e).closest("li")` |
| `classList.add/remove/toggle/contains` | `pb.el.id("x").cls.add / remove / toggle(name, force?) / has` |
| `setAttribute` / `dataset` | `pb.el.id("x").attr(name, value)` / `.data(name, value)`（`null` = 移除） |
| `querySelectorAll(".x").forEach(…)` | `pb.el.qa(".x").list((el, i)=>…)`（`el` 是元素包裝，可直接 `cls` / `attr` / `animate`） |
| 點外面關閉（`document` click + `contains`） | `pb.el.id("menu").outside("click", ()=>{ $t.open = false; }, { owner:$t })`（在 `ready` 掛，元素要已存在，見守則 5） |

守則：

1. **回呼 `(el, e)`**：`el` 是元素包裝（可直接 `animate` / `style`），`e` 是原生事件，依事件名稱有型別，例如 `on("keydown", (el, e)=>e.key)`。既有的 `on("click", a=>a.animate(…))` 不用改。
2. **元件裡掛在 `window` / `document` 的事件一定加 `owner:$t`**：元件移除（leave）時自動解除，不要再寫 `$t.$on("hook:beforeDestroy")` 或 `removeEventListener`。
3. **scroll / resize / mousemove / touchmove 加 `throttle:"frame"`**（每個畫面最多一次）或毫秒數；scroll、touch、wheel 預設 passive。只需要一次的用 `once:true`。
4. **列表用 `delegate`**：只在外層掛一個，`on("click", (el, e)=>…, { delegate:".item" })`，`el` 是被點到的項目。**點外面關閉**用 `outside`。
5. **`pb.el.id(...)` 是呼叫當下取元素**：元素的事件在 `ready`（DOM 已產生）掛；在 `completed` 或更早掛時，請在事件當下才取元素，例：`pb.el.doc.on("click", (el, e)=>{ if(!pb.el.id("menu").contains(e)) … })`。
6. **模組自己管理監聽時**：保留包裝 `const cv = pb.el.of(canvas)`，停止時 `cv.off()` 一次解除；`window` 的用 `pb.el.win.off(type, fn)` 指定函式，不要 `pb.el.win.off("scroll")` 全部解除，否則會影響其他元件。
7. 同一個目標的同一種事件只掛一個原生監聽（`window.__wtHub`），再分派給所有訂閱者，元件多也不會增加原生監聽。
8. 型別：`elEventOpt`、`elScrollOpt`、`elRect`（`models/SysConfig_Interface/animate.ts`）。成員都在 `elTools`（`pb.el.id` / `of` / `q` / `qa` 取得的元素都有），`AnimateAction` 只是 `animate()` 的動畫設定。學習網「深入高階 › pb.el」有示範。

### 4.5 View 樣板 — `view/X.html`

- 一律寫 `v-bind:` / `v-on:` 完整語法，與既有專案一致。
- 動態 class 用物件語法：`v-bind:class="{'is-selected':a.id==selectedId}"`。
- 會被 `pb.el` 動畫控制的元素要給 id。`v-for` 的項目用 `v-bind:id="'shop_body_'+a.id"`。
- 動畫元素若需要隨時存在（例如要能移除它的動畫），用 `v-show`，不要用 `v-if`。
- class 加上專案前綴（例：`shop-`），避免與其他專案衝突，因為各專案的 css 都是全域的。

### 4.6 View 樣式 — `view/X.scss`

- 檔案名稱與畫面同名，並加入 `package.json` 的 `inputFiles`（放在 `X.ts` 之後，與 init 相同）。
- **同名配對、跟隨載入**：有 `.ts` 的 `X.html` 會自動配對同資料夾的 `X.scss` / `.sass` / `.css`（temp 元件相同；`main.html` ↔ `main.scss` 是專案入口樣式）。樣式在該樣板**第一次載入時**才下載：debug 為獨立的 `<專案>/c<n>.css`，release 與樣板合併成 `<專案>temp/t<n>.txt`。
- html 內的 `<style>` 會被抽出併入同一份 css；`<totemp>` 嵌入的子 html 沒有自己的 `.ts`，樣式寫在父畫面的 scss。
- **css 是全域的**：選擇器一律加專案前綴或根元素 id（例：`.shop-`、`#shop_main`）。
- 其他樣式來源：`src/models` 的 css（全站共用，`$t.m.css.<名稱>`）、extendsComponent 的 `.vue` `<style>`（封裝進核心）、`package.json` 中沒有配對的獨立 `.css`（→ `<專案>.min.css`）。
- 結構：變數 → mixin → 依區塊分段（`// ---------- 區塊 ----------`）。
- 每個選擇器以 `{/* 說明 */` 開頭，屬性旁用 `//` 補充。
- 只寫靜態樣式與 `transition`。動畫統一寫在 animateModel，請在註解標明對應的方法（例：`/* 雲 (飄動動畫：animateModel/index.ts ambient) */`）。

### 4.7 全站共用 .vue 元件 — `extendsComponent/<資料夾>/<名稱>.vue`（vue2 / vue3 核心寫法相同）

```
extendsComponent/input/open.vue        → 標籤 <input-open>（路徑去掉 .vue，/ 換成 -）
extendsComponent/input/open_VueTemp.ts → props 型別
```

```html
<template><div id="pubExtendsComponent"><input type="text" v-model="anwA" /></div></template>
<style lang="scss">#pubExtendsComponent { input { width:100px; } }</style>
<script lang="ts">
import {PublicComponentInterface} from "../../src/models/vueSDK";
import getVueTemp from "./open_VueTemp";
export default {
    props:{ anwA:{ type:String, default:"null", required:true } },
    action:($t)=>({})
} as PublicComponentInterface<getVueTemp>;
</script>
```

- 封裝進核心 `worldTravelerBuildVue.min.js`：不必 import、不必列入 `package.json`，所有子專案直接用標籤。缺少 `<template>` / `<script>` 時 wt 會警告。
- 只有 `props`、`action`、`completed`；資料從 props 來。`props:false` 或不寫 = 自動繼承父層屬性。
- props 可用 camelCase（`anwA`）：封裝後 html 屬性會轉小寫，核心以小寫註冊 props，再以 computed 別名讓樣板 / `$t` 用原名稱取值。父層寫 `v-bind:anwA="..."`。
- 對 props 用 `v-model`：改的是元件內的值，不會改父層；父層值更新時元件會改回顯示父層的值。要回傳給父層請用 `$emit`。
- 核心內建 `<load-img :source="jObj" src="x.png" />`。
- 選擇：只是拆檔 → `<totemp>`；全站共用、只靠 props 的小元件 → extendsComponent；需要自己的資料 / 生命週期 / 離散載入 → temp 元件。extendsComponent 隨核心在首頁就下載，請保持小。

---

## 5. 型別放置

| 型別 | 位置 |
|---|---|
| view 渲染資料（`Animal`、`Food`、`Particle`）、view `Data` / `Action` | `view/X_Interface.ts` |
| 設定 / 執行狀態（`AnimalKind`、`MeadowConfig`、`MeadowRuntime`）、controllers `Data` | `controllers/X_Interface.ts` |
| 注入物件 `$m`、`$an` | `controllers/X_Interface.ts` 的 `joinModeldownFormat` |
| `$t` 完整型別 | `view/X_VueTemp.ts`（extends 以上各型別 + `VueTemplate`） |

`X_Interface.ts` 之間可以互相 import 型別，例如 view 的 `Animal extends AnimalKind`。

---

## 6. 跨專案引用

- `Component($t).import(temp=>temp.shop.view_index)` **只能引用同一專案的樣板**。它只會產生 `import.url('shop@view/index')`，不會下載 `shop.min.js`。
- 要引用其他專案，必須先非同步載入：

```ts
// 父層 view completed 中
$t.import.p.shop(InsertTemp=>
    InsertTemp("shopTemp", tempObj=>tempObj.exportVue({ main:$t.main })).toLoad());
```

```html
<component v-bind:is="getVue(this,'shopTemp')"></component>
```

await 寫法（`$t.import.p.<專案>()` 回傳 Promise，結果是 insert 函式；拿到後**一定要呼叫**，否則其他樣板載入會一直等待）：

```ts
loadShop:async ()=>{
    const insert = await $t.import.p.shop();
    insert("shopTemp", tempObj=>tempObj.exportVue({ main:$t.main })).toLoad();
}
```

---

## 7. 封裝 / Debug 注意

- 新增畫面用 `wt fe new view <專案> <名稱>`，它會同時更新 `package.json`。
- 新增 `.scss` 時，記得把它加入 `package.json` 的 `inputFiles`。
- `model/`、`animateModel/` 的 `.ts` **不用**加入 `package.json`。它們由 view / controllers import，會一起被封裝。
- 以 `<totemp>` 嵌入的 html 片段、`<json src>` / `props` 引用的 `.json` **不用**加入 `package.json`。封裝時會讀取並內嵌；debug 中修改它們也會觸發重建。
- **`wt fe debug` 執行中新增的子專案不會被監看。** 新增專案後請重啟：`docker restart <工作區>-bundle-1`。
- 確認是否重建成功：`docker logs --tail 20 <工作區>-bundle-1`，TypeScript 錯誤會列在這裡。
- 不要修改 `dir/`（封裝輸出）。
- TS 模型 / TS 套件的 `tsconfig.json` 不用填 `target`、`lib`、`module`：
  - 新建時（`wt fe new tsc`、右鍵新增）、封裝或 debug 時，會依核心自動填入，手動修改無效；
  - vue2 = `es5`，lib 為 dom、es5、scripthost、es2015.promise（async/await 需要）；vue3 = `es2020`，lib 為 dom、es2020、scripthost；module 一律 AMD。
- view `.ts` 與 `.html` 的 `<script lang="ts">` 沒有 tsconfig：
  - 封裝時一樣依核心編譯，vue2 用到 ES2015+ API（例如 `find`、`Object.assign`）會出現 TS2550 與提示；
  - VS Code 擴充 0.3.28 起，外掛讀取 `src/init/main.ts` 的 `toVueVersion`，讓編輯器套用相同的 target / lib，切換核心後自動更新。
- vue2 核心用到 ES2015+ API（`find`、`Object.assign`、`Map`…）會出現 TS2550 警告：改用 ES5 寫法，或改 `.toVueVersion("vue3")`。
- 換核心只改 `src/init/main.ts` 的 `.toVueVersion(...)`（§1.1.1），不要在 `worldtraveler.json`、`.env`、`docker-compose.yml` 設定 target。

---

## 8. 文字集 / 靜態資料：`<json>`

畫面用的文字（翻譯）、選項清單、靜態設定，寫成 `<json>` 標籤，在元件中以 `getJson(key)` 取用，**不要寫死在 ts 或 html 文字中**。

### 8.1 三種寫法

```html
<!-- view/eventEdit.html (樣板最後面) -->

<!-- A. 直接寫在 html：map 指定掛載路徑 (以 . 分層) -->
<json map="tw.createPanel">
{ "title":"標題", "date":"開賽日期", "placeInput":"請輸入" }
</json>
<json map="en.createPanel">
{ "title":"title", "date":"start date", "placeInput":"input" }
</json>

<!-- B. 引用 json 檔：src 路徑以「這個 html 檔所在資料夾」為基準 -->
<json map="tw" src="../temp/eventEdit/lang/tw.json"></json>
<json map="en" src="../temp/eventEdit/lang/en.json"></json>

<!-- C. 不寫 map：內容直接合併到最上層 -->
<json>{ "pageSize":20 }</json>
```

上例合併後的資料：

```json
{ "tw": { "createPanel":{...}, ...tw.json 的內容 }, "en": {...}, "pageSize":20 }
```

### 8.2 取用

```html
<!-- 樣板中直接呼叫 -->
<div>{{getJson("tw").createPanel.title}}</div>
```

```ts
// view/X.ts action：依目前語系取文字 (語系來源依專案而定，例：$t.main.init.lang)
action:$t=>({
    lang:()=> $t.getJson<langFormat>($t.main.init.lang),
    createText:()=> $t.lang().createPanel,
} as X_View.Action)
```

```html
<input v-bind:placeholder="createText().placeInput" />
```

- 型別（`langFormat`）寫在 `view/X_Interface.ts`，讓 `getJson<T>` 有提示。
- 多語系建議：每個語系一個 `<json map="語系.區塊">` 或一個 `lang/<語系>.json`，各語系的 key 結構必須相同。

### 8.3 合併規則與範圍

- 同一個元件的所有 `<json>`（**含 `<totemp>` 嵌入的子樣板裡的 `<json>`**）會深層合併成一份：物件逐層合併、陣列串接。
- 同一個 key 若是字串 / 數字，**先出現的值有效**，後面的不會覆蓋。不要在兩處定義同一個 key。
- `getJson` 的範圍是「一個有 ts 的元件」（view，或有 ts 的 temp 元件）。父元件的 json，子元件（另一個 ts）拿不到；需要時用 `exportVue({...})` 傳下去。
- 跨專案共用的靜態資料（全站設定、共用字典）放 `Libary&Document/jsonDoc/`，以 `importLoad.m.json['資料夾_檔名']` 取用。
- `<json>` 內容必須是合法 JSON（key 用雙引號）。

### 8.4 多語系網站：wtd（worldTraveler translation document）

畫面文字要支援多種語言時，使用 wtd，不要在程式中 `if(lang==...)`：

```
src/<專案>/temp/translation/<語系>/<文件>.json      例：temp/translation/en/home.json
```

```html
<!-- 使用它的 html：每個語系一行 -->
<json map="tw.home" src="../temp/translation/tw/home.json"></json>
<json map="en.home" src="../temp/translation/en/home.json"></json>
```

```ts
import wtd from "../../config/wtd";                 // src/config/wtd.ts

action:$t=>({ text:()=>wtd.doc<HomeText>($t,"home") })   // 目前語系；缺少時回退預設語系
wtd.set($t.main, "ja");                              // 切換語系 (存在 main.init.lang，所有子專案共用)
```

- 語系清單與預設語系在 `src/config/wtd.ts`（`wtdLangs`、`wtdDefault`）；預設語系也可在 `worldtraveler.json` 的 `frontend.translationDefault` 設定（wt 檢查的基準）。
- 各語系的 json **結構必須與預設語系相同**（key、陣列長度）；wt 封裝時會比對並在 log 列出 `⚠ wtd：…`。
- 子元件（樣板元件、其他子專案）要取用語系時，父層 `exportVue({ main:$t.main })` 傳下 `main`。
- 程式碼範例（`code` 之類的欄位）不翻譯；文字中的識別名稱（函式、路徑）保持原樣。
- 與 jsonDoc 的分工：wtd = 各專案的畫面文字；`Libary&Document/jsonDoc` = 全站共用設定（見 §12.4）。

---

## 9. 巢狀樣板：`<totemp>`

`<totemp>相對路徑.html</totemp>` 會在**封裝時**把另一個 html 檔的內容展開到這個位置，可多層巢狀。展開後就是父樣板的一部分，**共用父元件的 `$t`（data、action、getJson）**，不是另一個 Vue 元件。

### 9.1 路徑

- 路徑以「**含有這個 `<totemp>` 的 html 檔所在資料夾**」為基準；`..` 往上一層。開頭的 `/` 會被忽略，效果同相對路徑。
- 巢狀時，每一層都以**自己的檔案位置**為基準：

```
temp/sendMessage/dataSourcePanel.html          → <totemp>dataSourcePanel/sendMessageFormat.html</totemp>
temp/sendMessage/dataSourcePanel/sendMessageFormat.html
                                               → <totemp>sendMessageFormat/content.html</totemp>
temp/sendMessage/dataSourcePanel/sendMessageFormat/content.html
                                               → <totemp content="...">../../../rowInfoPanel.html</totemp>  (= temp/rowInfoPanel.html)
```

- 路徑錯誤時，畫面上會出現 `unknow <路徑>`。

### 9.2 傳參數：`@v{名稱}`

`<totemp>` 上的一般屬性會成為參數，子樣板中以 `@v{屬性名}` 代換（封裝時的文字代換，可含 html 與 `{{ }}`）：

- **寫法**：`@v{名稱}`，`v` 代表傳入的值（value）。名稱可用英數、底線、`$`、`-`、`.` 與 `[索引]`，大括號內可加空白，例如 `@v{ content }`。
- **為什麼不用 `@>名稱<@`（舊寫法）**：
  - 舊寫法含 `<`，VS Code 會標成紅色，HTML 解析也可能把它誤當成標籤；
  - 舊寫法仍可使用，輸出和新寫法完全相同；
  - VS Code 擴充會提示改寫，提供一鍵轉換。
- **只認完整格式**：誤打的 `@>`、`@v{` 不會吃掉後面的內容，會原樣保留，VS Code 以黃色警告提示。
- **沒有傳入值**：封裝出現警告「`<totemp>` 參數沒有傳入值：@v{名稱}」，畫面上顯示 `@v{名稱}`，方便發現。
- **VS Code 擴充（0.3.28 起）**：
  - 參數會加上底色框，後面以灰色斜體顯示父層實際傳入的值；
  - hover 可看到每個引用此樣板的 `<totemp>` 和它傳入的值；
  - 輸入 `@v{` 會列出可用的參數；
  - `<totemp>` 內的路徑、`props`、`<json src>` 可以開啟：標籤上方的「開啟 …」直接點擊，或 ⌘ / Ctrl + 點擊、F12、hover 的「開啟 ↗」。

```html
<!-- temp/rowInfoPanel.html (共用的提示列) -->
<span class="info"><img class="img-icon" v-bind:src="importLoad.pub.lib.src('info.png')" />@v{content}</span>
```

```html
<!-- 使用 -->
<totemp content="需與計時廠商測試開始時間相同">../rowInfoPanel.html</totemp>
<totemp content='注意："{{val.name}}" 存檔後立即生效'>../rowInfoPanel.html</totemp>
```

- 參數只作用在被引用的那個檔案。

### 9.3 Vue 屬性與外框：`v-*`、`:`、`@`、`class`、`style`、`id`、`tag`

這些屬性**不是參數**，而是加在子樣板的外框元素上：

```html
<totemp v-if="val.sendMessageOpen">dataSourcePanel/sendMessageFormat.html</totemp>
<!-- 展開為 <temp v-if="val.sendMessageOpen">...子樣板...</temp> -->

<totemp v-if="val.dataSource" tag="span" content="資料源">../rowErrorInfoPanel.html</totemp>
<!-- tag 指定外框標籤：<span v-if="val.dataSource">... -->
```

- 沒有這類屬性時，子樣板直接展開，不加外框。
- 外框預設是 `<temp>` 標籤（不影響版面時可不理會；需要特定標籤時用 `tag`）。

### 9.4 用 json 檔產生重複項目：`props`

```json
// temp/menu/menuProps.json  (可寫 /* */ 註解)
[
    { "style":"left",  "name":"pageIndex", "temp":"indexTemp" },
    { "style":"right", "name":"pageEvent", "temp":"eventTemp" }
]
```

```html
<!-- temp/menu.html -->
<totemp props="/menu/menuProps.json" panelTagNu="0">/menu/item.html</totemp>
<totemp props="/menu/menuProps.json" panelTagNu="1">/menu/item.html</totemp>
```

```html
<!-- temp/menu/item.html：@v{[索引屬性名].欄位} -->
<div v-bind:class="'menu_@v{[paneltagnu].style}'" v-on:click="chooseMenu('@v{[paneltagnu].temp}')">
    {{getMenuTitle().@v{[paneltagnu].name}}}
</div>
```

- **`[ ]` 內的索引屬性名一律寫小寫**（`panelTagNu` → `[paneltagnu]`）。html 解析後屬性名會變成小寫，大小寫不同會代換失敗。
- 物件的 json 以 `@v{欄位}`、`@v{父.子}` 取用；陣列以 `@v{[0].欄位}` 或上述索引屬性取用。

### 9.5 其他標籤

> **`<json>`、`<bundle>` 只在元件頁有效**。元件頁指有同名 `.ts` 的 `.html`，例如 `view/index.html` + `view/index.ts`；只有元件頁會被封裝成元件。
> - 沒有 `.ts`、以 `<totemp>` 嵌入的子樣板裡：
>   - `<bundle>` **不會生效**，封裝會警告；
>   - `<json>` 仍會併入引用它的頁面，但封裝會警告，請移到元件頁。
> - `<totemp>` 可以巢狀，子樣板裡也能再寫 `<totemp>`（§9.1）。
> - VS Code 擴充（0.3.28 起）：
>   - 三個標籤的名稱使用專屬顏色（`worldTraveler.flagTagForeground`），行號旁顯示 📄，標籤後面有標記：⧉ 嵌入樣板、📄 文字集、📦 release 嵌入 `<專案>.min.js`；
>   - `<totemp>` / `<json src>` 上方有可點擊的「開啟 …」；
>   - 顏色、📄、「開啟 …」可用設定 `worldTraveler.flags.tagColor` / `gutterIcon` / `codeLens` 個別關閉；
>   - hover 會說明作用與實際對應的檔案；
>   - 寫錯位置、找不到檔案時，以黃色警告提示。

- `<bundle>true</bundle>`（離散資源調校）：
  - release 時把這個樣板（含 css 時為 [html, css] 一組）的壓縮內容直接寫進專案 `.min.js`，不產生 `t<N>.txt`、不發請求；debug 不影響。
  - **只看元件頁自己的 `.html` 的第一個 `<bundle>`**，`<totemp>` 子樣板裡的不算。
  - 寫在 `view/index.html` 也一樣有效，該頁的樣板會嵌入。
  - 適合：一定會顯示又很小的常駐樣板（導覽列、頁尾、對話框外框）。不適合：大型樣板、不一定會進入的畫面、常修改的樣板（一改就讓整個專案 js 快取失效）。
  - 樣板在父元件 `temp` 註冊時就開始下載，bundle 只省掉請求、不改變建立時機；要用 DevTools（Fast 3G、篩選 `temp/t`）量過再決定。release 不會刪除舊的 `t<N>.txt`。
- `<script>`、`<style>` 會被抽出，分別併入 JS / CSS；一般請改寫在 ts / scss。
- **樣板文字不要寫 `&lt;` / `&gt;`**（實測）：封裝時 html 會先解碼，`&lt;a&gt;` 會變成真的 `<a>` 標籤並吃掉後面的元素。要顯示 `<`、`>` 時，用 `{{ }}` 輸出 action 回傳的字串（例：`codeText:()=>"<img src='x'>"`）。
- **`<script>` 規則**（實測）：
  - 內容原樣放進專案 `.min.js` 的 `split_b_obj.c_JS(...)` 函式，**父層註冊這個樣板（元件定義建立）時、Vue 建立之前執行一次**，之後同一個樣板的元件實例共用、不會重跑；當下 DOM 還不存在。要對每個實例做事用 `$view.created / ready / leave`。
  - **各行直接相接**：不可用 `//` 註解（後面的程式會全部變成註解），一律 `/* */`；每個敘述以 `;` 結尾。
  - 變數只在該函式內有效，要共用請掛到 `window`；樣板不能直接呼叫 `window` 的函式，要經 view action 轉接。
  - 寫 ES5 JavaScript。要用 TypeScript 請改寫 `<script lang="ts">`（見下方）。
  - 用途：第三方套件的全域設定、全域回呼（`callback=xxx`）、舊程式碼過渡。畫面邏輯一律寫在 `.ts`。
- **`<script lang="ts">`（樣板 TypeScript）**：
  - 與子專案 view/X.ts **同一次 TypeScript 編譯**（型別檢查；vue2 → ES5、vue3 → ES2020），執行時機與 `<script>` 相同（父層註冊這個樣板時、Vue 建立之前執行一次，之後的元件實例共用）。
  - `import` 寫在 script 最前面，路徑以該 .html 的資料夾為準；可 import 值（`models/vueSDK` 的 `pb`、`ajax`、`task`、`importLoad`…）與型別。可以用 `//` 註解。不能寫 `export`。
  - 同一個 .html 的所有 ts script 合成一個函式（變數不外流，要共用掛 `window`）；與 JS `<script>` 可混用，依出現順序執行。
  - 外部檔：`<script lang="ts" src="./X.script.ts"></script>`（建議檔名 `<畫面>.script.ts`、放在 .html 旁，**不要**加進 package.json，也不要被其他 .ts import）；VS Code 有完整提示。
  - `<totemp>` 子 .html 也可寫，import 路徑以子 .html 為準；同一子樣板在一個畫面多次嵌入只執行一次。
  - 型別錯誤在封裝時以 `src/<專案>/view/X.html(行,列)` 顯示（行號同 .html）。也接受 `type="text/typescript"`。
  - **`$view`（取用同名 .ts 的 export default 與元件 `$t`）**：script 內可直接使用 `$view`（型別 `WtScriptView`，在 `models/vueSDK`）。
    - `$view.vue`：同名 .ts（`view/index.html` → `view/index.ts`）的 export default（`data`、`action`、`temp`…）。所有實例共用，修改會影響之後建立的元件；一般只讀取。
    - `$view.created($t=>{…})`：每個元件實例 Vue created 之後執行，`data`、`action` 已可用（`$m` 等 completed 才注入的值可能還沒好）。
    - `$view.ready($t=>{…})`：DOM 已產生（mounted）；`$view.leave($t=>{…})`：元件移除。script 只執行一次，回呼則在每個實例各執行一次（實測：進出 3 次 → created / ready 各 3 次、leave 2 次），不會累加。
    - `$t` 的型別來自 `vueComponentModel<Data,VueTemp>` 的第二個參數，`$t.xxx` 有完整提示與型別檢查；選擇性 action 呼叫要寫 `$t.text!()`。
    - 外部檔要用 `$view` 時寫成 `export default function($view:WtScriptView<typeof indexView>){ … }`（`import type {WtScriptView} from "../../models/vueSDK"`、`import type indexView from "./index"`）；沒寫 export default 時整個檔案就是 script 內容。
    - JS `<script>` 也可用 `$view`（沒有型別）。畫面邏輯仍以同名 .ts 為主；`$view` 適合把 script 的結果寫回 `$t`、或在 ready / leave 掛上 / 移除第三方套件。
  - **VS Code**：worldTraveler 擴充 0.3.28 起內含 TypeScript 服務外掛（wt-html-ts-plugin），.html 內 ts script 的 import、`$view`、`$t` 有提示與錯誤檢查；工作區設定 `"html.validate.scripts": false` 關閉內建 HTML 的 JavaScript 檢查。

### 9.6 何時用 `<totemp>`

| 情況 | 做法 |
|---|---|
| 同一段 html 在多處出現（提示列、表單列、列表項目） | 抽成 `temp/` 下的 html，用 `<totemp>` + 參數 |
| 畫面太長，想依區塊拆檔（搜尋區、資料區、設定區） | 每個區塊一個 html，父畫面用 `<totemp>` 組合 |
| 區塊需要自己的資料、事件、生命週期，或要動態切換 / 非同步載入 | 不用 `<totemp>`，改建有 ts 的 temp 元件或 view |

**優先用 `<totemp>` 拆檔，而不是拆成子元件。** `<totemp>` 讓 .html 直接嵌入另一個 .html，封裝時就組合完成：

- 不會多產生 Vue 元件：不需要 `.ts`、不用加入 `package.json`、不用 `Component().import` / `exportVue`。
- 直接使用父元件的 data / action / `$m`：沒有 `exportVue` 傳 JSON 複本造成的資料不同步。
- 沒有子元件的載入 / 掛載時機問題（父元件 `completed` 時子元件 DOM 可能還沒產生），也不會因子元件重新註冊或 `v-if` 切換而重建、狀態歸零。
- 複雜畫面依區塊拆成多個 html（可多層巢狀），畫面區塊與檔案一一對應，除錯時直接開對應的檔案。

---

## 10. 呼叫後端 API：`ajax`

前端與 API 走同一個網址（nginx 閘道，見 AGENTS.md「前後端共構」）：**一律用相對路徑 `/<API 名稱>/...`**，不要寫死 host / port。

### 10.1 寫法

```ts
import {ajax} from "../../models/vueSDK";

// GET (query / form)
ajax.Form.Get("/TourApi/tours")
    .Catch(e=>{ $t.apiMsg = "HTTP " + e.status; })      // 要寫在 toResponse 之前
    .toResponse<ApiResult<Tour[]>>(res=>{ $t.tours = res.Data; });

// POST JSON body
ajax.JSON.send("/TourApi/bookings")
    .input({ TourId:1, Name:"小明", People:4 })
    .Catch(e=>{ $t.bookMsg = "HTTP " + e.status; })
    .toResponse<ApiResult<Booking>>(res=>{
        if(res.Ok) $t.booking = res.Data;
        else $t.bookMsg = res.Message;
    });
```

| 方法 | 用途 |
|---|---|
| `ajax.Form.Get / Delete / Put / Post.send` | form（`application/x-www-form-urlencoded`）；GET 只有這一組 |
| `ajax.JSON.send / Put / Delete` | JSON body（`application/json`）；**`ajax.JSON` 沒有 `Get`** |
| `.input(資料)`、`.head(標頭)`、`InputUrlIDForString(id)` | 送出資料、標頭、`/路徑/{id}` |
| `.toResponse<T>(fn)` | 回應轉 JSON；`.toStringResponse(fn)` 為字串 |

### 10.2 錯誤處理（依 SDK 實際行為）

- `toResponse` **只在 HTTP 200 時呼叫**。
- 非 200 且**沒有** `.Catch`：自動重試 3 次後放棄，畫面不會有任何反應。所以**一定要寫 `.Catch`**。
- 非 200 且**有** `.Catch`：立即呼叫 `.Catch({readyState, status})`，**只拿得到狀態碼，拿不到回應內容**。
- 網路中斷 / 連線錯誤：`.Fail(fn)`。
- 所以後端的「業務錯誤」（驗證失敗、座位不足…）請回 **HTTP 200 + `{ Ok:false, Message }`**，前端才能顯示訊息；只有系統錯誤才用非 200。
- 502 = API 沒有在執行；404 = 路徑前綴錯誤（檢查 `nginx/routes/<名稱>.conf`）。

### 10.2.1 送出資料與類型（實測）

- **GET 的 `.input()` 不會送出**（瀏覽器的 GET 不帶 body），參數寫在網址：`ajax.Form.Get(url + "?id=" + id)`。
- `ajax.Form.*` 送 `a=1&b=x`；`ajax.JSON.*` 送 `{"a":1}`；`sendGzip` 送 `{"to":"<gzip base64>"}`（後端要解壓）；`UploadFile.*` 送 multipart（input 放 File / FileList）；`ajax.Stream(url).toStreamBase64Response` 下載成 data URI。
- `InputUrlIDForNumber(99)` → 網址 `/資源/99`；`head({...})` / `AuthzBearer(token)` 所有類型都可用。

### 10.2.2 與 task 搭配（實測）

- 每個 `toResponse` / `toStringResponse` / `toSubmit`… 都**回傳 task**：成功 resolve 回應資料，失敗（有 `.Catch` 或重試 3 次後）reject `{readyState, status}`。
- 可直接接 `.ContinueWith({SuccessEvent:o=>o.ObjectVal ..., CatchEvent})` / `.ContinueCatch()`。
- **依序呼叫**：ContinueWith 回傳的 task 不會被等待；在每一步裡呼叫 ajax，`.getPromise().then(r=>o.resolve(r), e=>o.reject(e))`。
- **全部完成**：`Promise.all([a.getPromise(), b.getPromise()])`；**取最快**：`task.Factory.StartNewMultipleToFirst([ajaxTaskA, ajaxTaskB])`（其他請求仍會完成）。

### 10.3 放置位置

- 呼叫寫在 **model**（`model/X.ts`），結果寫回 view 的渲染變數；view action 只轉接。
- API 前綴等設定放 **controllers** 的 data（例：`apiConf:{ base:"/TourApi" }`）。
- 回應型別寫在 `X_Interface.ts`；DB 型別可用 `wt fe tscdb` 由後端產生。

---

## 11. 非同步流程：`task`

`task.Factory` 是框架內建的 Promise 流程控制，用來寫「依序執行」、「取最快的結果」、「可取消 / 逾時」的流程。`ajax` 的 `toResponse` 也回傳 Task，可以直接串接。

### 11.1 依序流程

```ts
import {task} from "../../models/vueSDK";

const job = task.Factory.StartNew(o=>{
    o.resolve({ tourId:1 });                       // 第 1 步完成，值傳給下一步
}).ContinueWith<{tourId:number},any>({
    SuccessEvent:o=>{                              // o.ObjectVal = 上一步的值
        if(seatsOk(o.ObjectVal.tourId)) o.resolve(4);
        else o.reject("座位不足");
    },
    CatchEvent:o=>{ o.reject(o.ObjectVal); }       // 上一步 reject 時 (選用)
}).ContinueWith<number,any>({
    SuccessEvent:o=>{ $t.msg = "完成"; o.resolve(null); }
}).ContinueCatch<any>(err=>{                       // 任何一步 reject 或 Abort
    $t.msg = "流程中止：" + err;
});
```

### 11.2 方法

| 方法 | 說明 |
|---|---|
| `task.Factory.StartNew(o=>{...})` | 建立任務；呼叫 `o.resolve(值)` / `o.reject(原因)` |
| `.ContinueWith({SuccessEvent, CatchEvent?})` | 上一步 resolve 後執行 SuccessEvent（reject 時執行 CatchEvent）；值在 `o.ObjectVal` |
| `task.Factory.StartNewMultipleToFirst([t1,t2,...])` | 取**最先完成**的結果（等同 `Promise.race`）；其他任務仍會跑完但不採用 |
| `.ContinueCatch(fn)` | 整條鏈的錯誤 / 中止處理（放在最後） |
| `.Abort()` | 立即中止（目前步驟 reject，登記的子任務一起中止） |
| `.AbortAfter(ms)` | 逾時自動中止 |
| `.getPromise()` | 取得 Promise（`await`） |

### 11.3 守則（依 SDK 實際行為）

- **每一步都必須呼叫 `o.resolve(...)` 或 `o.reject(...)`**，否則流程會停在那一步，後面不會執行。
- 在 SuccessEvent 中 `return` 一個 Task（或陣列）**不會被等待**，只是登記起來讓 `Abort` 時一起中止；要等多個任務請用 `StartNewMultipleToFirst`，或在子任務完成時才呼叫 `o.resolve`。
- `ContinueCatch` 回傳的物件只有 `Abort` / `AbortAfter` / `getPromise`，請放在鏈的最後。
- 長時間任務要保存起來（controllers 的執行狀態，例：`run:{ job:null }`），在離開畫面 / 切換內容時 `Abort()`（框架沒有 destroy 生命週期）。
- 計時器（`setTimeout` / `setInterval`）一樣要在元件離開 document 時清除。
- 流程寫在 **model**；畫面上的狀態（步驟、訊息）寫回 view 的 data。

---

## 12. 外掛套件庫：`src/models`

### 12.1 js 套件 + `.ts` interface（離散載入）

第三方或既有的 js 函式庫放在 `src/models/<名稱>/`，封裝成 `models/<名稱>.min.js`，**第一次用到才下載**：

```
src/models/md5Ascii/
  md5Ascii.json   { "Name":"說明", "order":["core.js", ...] (選用) }
  main.js         套件本體：必須定義與資料夾同名的全域變數
  interface.ts    TypeScript 型別 (default export = 該全域變數的型別)
```

```js
// main.js 最後
var md5Ascii = function(){ return new getMD5Class(); };
```

```ts
// interface.ts
interface getMD5Result { hex:(s:string)=>string }
export default interface getMD5Function { ():getMD5Result; }

// 使用：回呼的 e 就是全域變數 md5Ascii (SDK 以資料夾名稱取得)
import md5 from "../../models/md5Ascii/interface";
$t.import.m.js.md5Ascii<md5>(e=>{ $t.hash = e().hex("text"); });
```

- 資料夾內所有 `.js`（含子資料夾）依路徑排序串接；需要固定順序時用 `<名稱>.json` 的 `"order"`。
- 新增 / 移除套件後執行 `wt fe sync`，`$t.import.m.js.<名稱>` 的型別（`SysConfig_Interface/ModelsInterface`）會自動更新；說明文字取自 `<名稱>.json` 的 `Name`。
- 套件本體是一般 js（不經 TypeScript 編譯），vue2 核心時請自行確保 ES5 語法（不要用 `const` / `let`、箭頭函式、樣板字串、參數列最後的逗號），封裝工具不會轉換也不會檢查；vue3 核心則可用 ES2020。

### 12.2 共用 `.ts`：直接 import

自己寫的共用工具（例：`src/config/wtd.ts`）寫成 `.ts` 後直接 `import`，封裝時打包進使用它的專案，不用登錄 package.json。
**怎麼選**：體積小、多數畫面都用 → 直接 import；體積大、只有部分畫面用 → 做成 12.1 的套件（離散載入）。

### 12.3 專案 TS 模型（商業應用程序類，離散載入）

一段完整的商業邏輯（報價、結帳、排程）寫成獨立資料夾，單獨編譯，**畫面需要時才下載**。實例：學習網 `src/learn/model/tourCalc`。

**建立**（擇一）：
- VS Code：右鍵子專案或其資料夾（例：`src/learn/model`）→ worldTraveler →「新增 TS 模型 (商業程序)...」
- 指令：`wt fe new tsc <專案> model/<名稱>`

產生 `model/<名稱>/tsconfig.json`、`main.ts`（default export class，建構子收到 `$t`），並更新 `src/<專案>/tscpackage.json` 與路徑對照 `src/models/SysConfig_Interface/tscModel/<專案>.ts`。輸出：`dir/libjs/pjtscmodel/<base64>.min.js`。

**載入**（controllers）：

```ts
import tscM from "../../models/SysConfig_Interface/tscModel/<專案>";
const M = new tscM();

export default {
    discreteModelLoad:{ $m:M.model_<名稱> }          // 簡化寫法；可多個 { $m:M.model_a, $calc:M.model_b }
    // 原寫法 (仍可用)：tsc=>tsc(new tscM()).toMap(map=>[map.model_<名稱>]).CreateJson(m=>({ $m:m.model_<名稱> }))
} as vueModelControllers<...>;
```

```ts
// controllers/X_Interface.ts：$m 的型別只用 import(...) 取型別
interface joinModeldownFormat { $m?:import("../model/<名稱>/main").default }
```

- 有 discreteModelLoad 時，**completed 會等模型下載完才執行**（completed 裡一定有 `$m`；ready 可能較早）。
- 有 `tsconfig.json` 的資料夾就是 TS 模型，裡面不能放樣板文件。
- 移除：右鍵資料夾 →「移除 (前端)」，或 `wt fe remove tsc <專案> model/<名稱>`。

### 12.3.1 models TS 套件（全站共用的 TypeScript 原始碼套件）

`src/models/<名稱>/` 有 `tsconfig.json` 就是 TypeScript 套件，全站任何子專案都可以離散載入。實例：學習網 `src/models/fxFormat`。

**建立**（擇一）：
- VS Code：右鍵 `src/models` → worldTraveler →「新增 TS 套件 (models)...」
- 指令：`wt fe new tsc models <名稱>`（名稱需為英文開頭的識別字，載入後是全域變數 `<名稱>`）

產生 `<名稱>.json`（`Name` 為型別提示說明）、`tsconfig.json`、`main.ts`，並更新 `src/models/tscpackage.json` 與 `ModelsInterface/js.ts`。輸出：`dir/libjs/models/<base64(名稱)>.min.js`。

**載入**（和 js 套件同一個入口，回呼收到 main.ts 的 class）：

```ts
import type fxFormat from "../../models/fxFormat/main";   // ⚠ 一律 import type

$t.import.m.js.fxFormat<fxFormat>(C=>{
    const fx = new C($t);
    $t.price = fx.money(1234, "JPY");
});
```

- 移除：右鍵 `src/models/<名稱>` →「移除 (前端)」，或 `wt fe remove tsc models <名稱>`。

### 12.3.1-a async / await 載入（js 套件、TS 套件、子專案共用）

- `$t.import.m.js.<名稱>()`、`$t.import.p.<專案>()` 都回傳 Promise；回呼可省略。結果 = 回呼收到的值（TS 套件是 class、js 套件是全域變數、子專案是 insert 函式）。
- 只在 `async` 的 action / model 方法裡 await；`init` / `temp` / `completed` 等生命週期**不會等待** async 函式。
- 專案 TS 模型用 `discreteModelLoad`，completed 時 `$t.$m` 已就緒，不需要 await。
- vue2（ES5）由 TypeScript 自動轉換 async / await，瀏覽器需有 Promise（IE11 需 polyfill）。
- 需要載入狀態（complete / fail）時用回呼的第二個參數。

```ts
runAll:async ()=>{
    const C = await $t.import.m.js.fxFormat<fxFormat>();           // 等下載完成
    const [C2, md5] = await Promise.all([                           // 同時下載多個
        $t.import.m.js.fxFormat<fxFormat>(), $t.import.m.js.md5Ascii<md5Fn>() ]);
    $t.price = new C($t).money(1234, "JPY");
}
```

### 12.3.2 離散載入模型的型別與打包規則（兩種 TS 模型共用）

- **只能用 `import type` / `import("...")` 取型別。** 一般 `import` 會把模型程式碼打包進專案 `.min.js`，失去離散載入的意義。
- 封裝工具會自動移除「只被型別引用」的模型程式碼；偵測到值 import 時，bundle log 會列出 `⚠ … 被直接 import (非 import type)`。
- 選擇方式：畫面專屬小邏輯 → `model/X.ts`；完整商業程序 → 專案 TS 模型；全站共用的 TypeScript 工具 → models TS 套件；第三方 js → `src/models/<名稱>/main.js` + `interface.ts`；很小的共用函式 → 共用 `.ts` 直接 import。

### 12.4 共用樣式與 jsonDoc

- `src/models/<名稱>.css`（或資料夾內的 .css / .scss）→ `models/<名稱>.min.css`，例：`$t.m.css.sit(e=>{...})`（`src/config/loadModel.ts`）。
- `Libary&Document/jsonDoc/<資料夾>/<檔>.json` → `models/jsonDoc_<資料夾>_<檔>.min.js`，以 `jObj().load("<資料夾>.<檔>", e=>{...})` 載入，適合全站共用設定。

---

## 13. 檢查清單

新增或修改畫面時逐項確認：

- [ ] 新畫面 / 新子頁有建立對應的 `view/`（小區塊用 `temp/`）
- [ ] view `data` 只有樣板會用到的變數
- [ ] view `action` 只做轉接、換算、樣板用的 style 計算
- [ ] 設定值、執行狀態放在 controllers `data`
- [ ] `$m` / `$an` 在 controllers `completed` 注入，型別寫在 controllers interface
- [ ] 商業邏輯放在 model，方法是箭頭函式屬性，內部方法加 `private`，並寫 JSDoc
- [ ] model 不碰 DOM 事件物件，也不直接使用 `pb.el`
- [ ] 沒有直接寫 `addEventListener` / `removeEventListener` / `getElementById` / `querySelector` / `scrollIntoView` / `getBoundingClientRect`，一律用 `pb.el`；元件掛在 `window` / `document` 的事件都有 `owner:$t`，高頻事件有 `throttle`（§4.4.1）
- [ ] 動畫寫在 animateModel，`.scss` 裡沒有 `@keyframes`
- [ ] 掛上子專案用 `$t.import.p.<專案>(…).toLoad()` 或 `(await $t.import.p.<專案>())(…).toLoad()`（元件自己的 temp 不需 toLoad）
- [ ] 需要等套件 / 子專案載入完成才往下：在 async action 裡 `await $t.import.m.js.<名稱>()`（生命週期函式不會等待）
- [ ] 需要 DOM 的操作有等 `$nextTick` 或等元素出現
- [ ] 有計時器的話，會在元件離開 document 時停止
- [ ] `.scss` 已加入 `package.json`，class 有專案前綴
- [ ] `docker logs` 沒有 TypeScript 錯誤
- [ ] 畫面文字 / 多語系 / 靜態選項用 `<json map>` 管理，沒有寫死在 ts 裡（§8）
- [ ] `<totemp>` 路徑以「含此標籤的 html 檔」為基準，畫面上沒有出現 `unknow ...`（§9）
- [ ] `<totemp>` 參數用 `@v{名稱}`（不用舊寫法 `@>名稱<@`）；`props` 索引參數名稱在子樣板中用小寫（`@v{[idx].name}`）；封裝沒有「參數沒有傳入值」警告
- [ ] API 用相對路徑 `/<API 名稱>/...`；GET 用 `ajax.Form.Get`；每個呼叫都有 `.Catch`（§10）
- [ ] 業務錯誤由後端回 200 + `Ok:false`，前端顯示 `Message`（§10.2）
- [ ] task 每一步都有 resolve / reject；長任務在離開時 `Abort()`（§11）
- [ ] 同一畫面的檔案共用主名稱（`X.ts` / `X.html` / `X.scss` / `X_Interface.ts` / `X_VueTemp.ts`），用工具建立（§2.4）
- [ ] 多語系文字放在 `temp/translation/<語系>/`，以 `wtd.doc` 取用；各語系結構與預設語系相同，wt log 沒有 `⚠ wtd`（§8.4）
- [ ] js 套件的 main.js 定義了與資料夾同名的全域變數，並有 interface.ts；新增後執行 `wt fe sync`（§12）
