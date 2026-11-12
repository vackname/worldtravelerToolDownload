# worldTraveler 開版初始包

> English version: [READ.en.md](READ.en.md)

TypeScript + Vue 2 前端框架，搭配 .NET 10 / Python 3.14 / Go 1.27 後端的集成開發環境。
前端存檔後約 **1 秒**瀏覽器就會自動重新載入；後端在 VS Code 按 F5 就能在 Docker 中設中斷點除錯。

---

## 1. 一鍵安裝

```bash
./install.sh
```

| 需求 | 必要性 | 用途 |
|---|---|---|
| Docker（已啟動） | **必要** | 前端封裝、debug 網頁、後端 debug 容器 |
| VS Code + `code` 指令 | 建議 | 右鍵生成專案、F5 除錯（`install.sh` 會自動安裝擴充功能） |
| .NET 10 SDK | 建議 | 新增 .NET 後端與方案檔維護（只寫前端可以不裝） |

`install.sh` 依序完成以下 5 步，可以重複執行，已完成的步驟會自動略過：

1. **檢查環境**：Docker、.NET 10、VS Code。
2. **準備映像檔**（`worldtravelervue-command`、`worldtravelervue-web`），依序判斷：
   - 本機已經有，就直接使用。
   - 設定了 `WT_REGISTRY=<帳號>/`，就從該 registry 下載。
   - 都沒有，就從原始碼建置（`WT_SOURCE=<worldTravelerBuildVue 路徑>`，預設為 `../worldTravelerBuildVue`）。
3. **初始化工作區**：建立 `worldtraveler.json`、隨機的工作區金鑰（`.worldtraveler/`）、`.env`、docker 網路。
   Docker 名稱一律是「工作區名稱-6 碼 id」（例：`myshop-3f9a1c`），容器、網路、volume 都不會與其他專案相撞；網頁 port 自動避開已被使用的 port。
4. **安裝 VS Code 擴充功能**：`tool/worldtraveler-*.vsix`。
5. **啟動前端 debug**（web + bundle + nginx 閘道）並開啟 http://127.0.0.1:<port>（安裝結束時會顯示）。

常用參數：

```bash
./install.sh --name myShop        # 工作區名稱 (預設為資料夾名稱)
./install.sh --port 9800          # 網頁 port (預設：自 9788 起第一個未被使用的 port)
./install.sh --redis              # 一併啟用 Redis 7.4
./install.sh --no-vscode          # 不安裝 VS Code 擴充功能
./install.sh --no-start           # 只安裝，不啟動 debug
```

**移除**：`./uninstall.sh` 停止所有容器（前端、nginx、Redis、後端 API 與 debug 容器）、移除網路，不會刪除你的程式碼。
- 加 `--extension`：同時移除 VS Code 擴充功能。
- 加 `--images`：同時刪除映像檔。
- 加 `--all`：以上全部。

---

## 2. 啟用點：從安裝到第一個畫面

### 2.1 開始開發的 4 個入口

| 入口 | 怎麼做 | 結果 |
|---|---|---|
| **前端 debug** | VS Code 左下角狀態列「**wT 前端 debug**」（`install.sh` 已啟動） | 存檔 → 自動封裝 → 瀏覽器自動重新載入 |
| **新增前端頁面** | 在 `src` 底下任何位置按右鍵 → **新增前端頁面...** | 建立畫面或樣板元件，並排開啟 html / ts |
| **新增後端專案** | 在 `DotNetProject` / `PythonProject` / `goProject` 按右鍵 → **新增後端專案...** | 產生專案、Dockerfile、`.vscode/launch.json` debug 設定；webapi 另加 `docker-compose.yml` 服務與 nginx 路由 `/<名稱>/` |
| **後端除錯** | VS Code「執行與偵錯」選「Docker dotnet / python / go:<名稱>」→ F5 | 在 Docker 中執行並停在中斷點；網頁經 `/<名稱>/` 直接呼叫到 debug 中的 API |

### 2.2 前端程式從哪裡開始執行

```
瀏覽器開啟 http://127.0.0.1:<port>  (nginx 閘道)
  └─ /libjs/worldTravelerBuildVue.min.js      框架核心 (Vue 2.7 + SDK)，自動載入下一步
      └─ src/config/loadModel.ts              ★ 載入順序：共用 css → public.ts → 進入點子專案
          └─ src/init/main.ts + main.html     ★ 首頁子專案 (網站入口)
              └─ src/init/view/index.*        首頁畫面
```

- **改首頁**：從 `src/init/view/index.html`（樣板）和 `index.ts`（資料、事件）開始。
- **範例子專案**：`src/aa` 示範了畫面切換、子樣板、TS 模型、Task 非同步流程，可以參考或刪除（右鍵 `src/aa` → worldTraveler → 移除）。
- **呼叫後端 API**：用相對路徑 `/<API 名稱>/...`，例：`ajax.Form.Get("/OrderApi/orders")`。

### 2.3 前端與後端 API 共構（同一個網址）

網頁與 API 走同一個網址，前端不需要知道 API 的 port，也沒有 CORS 問題：

```
http://127.0.0.1:<port>  ──▶ nginx
                               ├─ /                → 前端網頁 (dir/)
                               └─ /OrderApi/orders → OrderApi.api/orders
                                                       ├ F5 debug 中的容器（停在中斷點）
                                                       └ 或 compose 服務 api-orderapi（不除錯時）
```

| 想做的事 | 做法 |
|---|---|
| 新增 API | 右鍵 `DotNetProject` → 新增後端專案... → webapi。自動加入 `docker-compose.yml` 的 `api-<名稱>` 服務與 `nginx/routes/<名稱>.conf` |
| 除錯 API | 執行與偵錯選「Docker dotnet:<名稱>」→ F5。會先停止同名的 compose 服務，再由 debug 容器接手，網頁不用改 |
| 不除錯，全部 API 一起跑 | 右鍵 `DotNetProject` → worldTraveler → **以容器啟動全部後端 API**（`docker compose --profile api up -d --build`） |
| Redis 7.4 | 右鍵 `DotNetProject` → worldTraveler → **啟用 / 停用 Redis**。後端連線主機 `redis:6379`；本機用 `docker compose port redis 6379` 查 port |
| 改 API 路徑前綴 | 編輯 `nginx/routes/<名稱>.conf`，再 `docker compose exec nginx nginx -s reload` |

### 2.4 目錄

```
src/                    前端原始碼 (config 入口設定、models 共用元件與 SDK 型別、init / aa 子專案)
extendsComponent/       自訂 Vue 元件 (.vue)
Libary&Document/        圖片 (libary) 與多語系 JSON (jsonDoc)
dir/                    封裝輸出 = 網站根目錄 (自動產生，勿手改 dir/libjs)
DotNetProject/          .NET 10 後端 (第一個專案建立時會加入 ConfigForSystem 共用庫)
PythonProject/ goProject/
tool/                   VS Code 擴充功能安裝檔 (.vsix)
AGENTS.md CLAUDE.md     給 AI 的專案指引 (見第 3 節)
createVueRule.md        前端開發守則 (AI 與開發者共用)
docker-compose.yml .env 前端 debug + nginx + Redis + 後端 API 服務 (.env 含金鑰，勿提交)
nginx/                  閘道設定：default.conf、routes/<API 名稱>.conf
```

### 2.5 VS Code 擴充功能（`tool/worldtraveler-*.vsix`）

圖示是 8-bit 紅帽子地球（側臉露齒笑）。在 `src/` 底下的 html 有以下輔助：

| 功能 | 說明 |
|---|---|
| 樣板標籤 | `<totemp>` / `<json>` / `<bundle>` 使用專屬顏色、行號旁 📄、標籤後面的標記（嵌入樣板 / 文字集 / release 嵌入），寫錯位置以黃色警告 |
| 路徑開啟 | `<totemp>` 的子樣板路徑、`props`、`<json src>`：點標籤上方的「開啟 …」，或 ⌘ / Ctrl + 點擊、F12 |
| `<totemp>` 參數 | 子樣板裡的 `@v{名稱}` 顯示父層傳入的值，hover 看來源，輸入 `@v{` 有補完 |
| html 內的 TypeScript | `<script lang="ts">` 有型別、補完與錯誤檢查；`pb.el` 等 API 有中文說明 |

顏色、📄、「開啟 …」可在設定 `worldTraveler.flags.*` 個別關閉；介面文字依 VS Code 語言顯示繁中或英文。

### 2.6 部署：多個前端站台（子網域 / `?wtsite=`）

同一個網站可以服務多個專案的前端：其他專案 `wt fe build` 的 `dir/` 放到 `wwwroot/<站台>/`，再設定 `WorldTraveler:Sites`（或環境變數 `WT_SITES=a,b`）。

```
https://example.com           → wwwroot/libjs/      (預設)
https://b.example.com         → wwwroot/b/libjs/    (子網域 b)
https://example.com/?wtsite=b → wwwroot/b/libjs/
```

首頁用 `CoreSelect.Tag(HttpContext)` 輸出核心，前端程式不用改。詳見 `createVueRule.md`「多個前端站台」。

---

## 3. 與 AI 協作

這個框架**不是**一般的 Vue / webpack 專案。AI 如果沒有指引，常會寫成 npm 套件、改 tsconfig，或漏掉 `package.json` 的登錄。初始包已經準備好讓 AI 自動讀取的指引檔：

| 檔案 | 給誰讀 | 內容 |
|---|---|---|
| `AGENTS.md` | 所有 AI 程式助手（Claude Code、Codex、Cursor 等） | 目錄、前端框架慣例、後端分類、指令、禁止事項 |
| `createVueRule.md` | AI 修改前端前必讀（AGENTS.md 已要求） | 前端開發守則：入口點、MVVM 分層、生命週期、`<json>` 文字集、`<totemp>` 巢狀樣板、樣板 `<script lang="ts">` 與 `$view`、`<bundle>`、檢查清單 |
| `CLAUDE.md` | Claude Code（以 `@AGENTS.md` 匯入同一份內容） | — |
| `.github/copilot-instructions.md` | GitHub Copilot | 同 AGENTS.md |
| 各後端專案內的 `AGENTS.md` | AI 修改該專案時 | 該語言範本的分類與建置方式 |

> 有自己團隊的規則時，請寫進 `AGENTS.md` 的最後面，三種 AI 工具都會讀到；前端寫法的規則請補進 `createVueRule.md`。

### 3.1 建議的工作方式

1. **建檔交給工具，內容交給 AI**：先用右鍵（或 `wt` 指令）建立頁面或專案，再請 AI 填寫內容。這樣 `package.json`、型別對照、`.sln`、`launch.json` 都會一致。
2. **一次一個畫面**：說清楚子專案、畫面名稱、要顯示的資料和互動。
3. **請 AI 自行驗證**：封裝成功、TypeScript 沒有錯誤，再交回給你。

### 3.2 範例提示詞

```text
在 src/init 新增畫面 productList：表格列出商品 (名稱、價格、庫存)，資料先用假資料，
點擊列時切換到 productDetail 畫面。請先用 wt 建立畫面，再寫內容，最後執行前端封裝確認沒有錯誤。
```

```text
新增 .NET webapi 專案 OrderApi，提供 GET /orders 回傳訂單清單 (先用記憶體資料)，
並讓 src/init/view/index 以相對路徑 /OrderApi/orders 呼叫這支 API 顯示訂單數量。
```

```text
OrderApi 的資料表類別加上 [DBM] 屬性後，用 wt fe tscdb 產生 TypeScript 介面，
並把前端的訂單型別改用 src/models/SysConfig_Interface/JsonInterface/db.ts 的介面。
```

### 3.3 AI 可以自行執行的指令

AI 可在終端機執行以下指令，確認自己的修改正確。不需要本機 Node，前端指令都在 Docker 中執行：

```bash
# 前端：建立 / 封裝 / 檢查 (TypeScript 錯誤會以 ⚠ 列出)
docker run --rm -v "$PWD:/workspace" worldtravelervue-command:dev fe new view <子專案> <畫面>
docker run --rm -v "$PWD:/workspace" worldtravelervue-command:dev fe build
docker compose logs --tail 20 bundle        # 查看 debug 監看的重建結果

# 後端 (需 .NET 10；擴充功能內建的 wt)
dotnet ~/.vscode/extensions/worldtraveler.worldtraveler-*/tool/wt.dll new dotnet webapi -o OrderApi
dotnet build *.slnx
```

### 3.4 請 AI 遵守的規則（已寫在 AGENTS.md）

- **不要動生成檔**：不要修改 `dir/` 與 `src/models/SysConfig_Interface/ProjectMap` 等自動產生的檔案。
- **不要改架構**：不要把前端改成 webpack、vite 或 npm 套件，也不要把 tsconfig 的 target 改成 ES2015 以上。框架會以 `new` 呼叫使用者函式，必須編譯成 ES5 語意。
- **新增頁面用工具**：新增或移除頁面、專案一律用 `wt` 或右鍵，不要手動建檔。

---

## 4. 日常指令速查

| 目的 | VS Code | 指令 |
|---|---|---|
| 前端 debug 開始 / 停止 | 狀態列「wT 前端 debug」 | `docker compose up -d` / `docker compose down` |
| 新增前端頁面 | 右鍵 → 新增前端頁面... | `wt fe new view <專案> <名稱>` |
| 新增前端子專案 | 右鍵 `src` → worldTraveler → 新增前端子專案 | `wt fe new project <名稱>` |
| 前端正式封裝 | 右鍵 `src` → worldTraveler → 前端 release 封裝 | `wt fe build [--target es2020]` |
| 新增 / 移除後端 | 右鍵 `DotNetProject` 等 | `wt new dotnet webapi -o <名稱>` / `wt remove dotnet <名稱> --yes` |
| 以容器啟動全部 API | 右鍵 `DotNetProject` → worldTraveler → 以容器啟動全部後端 API | `docker compose --profile api up -d --build` |
| Redis 啟用 / 停用 | 右鍵 `DotNetProject` → worldTraveler → 啟用 / 停用 Redis | `.env` 的 `COMPOSE_PROFILES=redis` 後 `docker compose up -d` |
| 由 DB 產生介面 | 命令面板 → worldTraveler: 由後端 DB 產生... | `wt fe tscdb --url http://127.0.0.1:<port>` |

`wt` 在本初始包中的兩種用法：
- 前端指令：`docker run --rm -v "$PWD:/workspace" worldtravelervue-command:dev <指令>`
- 後端指令：`dotnet <擴充功能目錄>/tool/wt.dll <指令>`

---

## 5. 疑難排解

| 狀況 | 處理 |
|---|---|
| 瀏覽器沒有自動重新載入 | `docker compose logs bundle` 確認有「重建」訊息；確認網址是 `127.0.0.1:<port>` 而不是 `localhost` |
| 右鍵沒有 worldTraveler 選項 | 確認根目錄有 `worldtraveler.json`（執行 `./install.sh`），並重新載入 VS Code 視窗 |
| 想換網頁 port | `./install.sh --port 9800`（寫入 `.env` 的 `WT_PORT`），之後 `docker compose up -d` 會使用新 port |
| 網頁呼叫 API 回 502 | 該 API 沒有在執行：F5 啟動 debug，或「以容器啟動全部後端 API」 |
| 網頁呼叫 API 回 404 | 路徑前綴錯誤：檢查 `nginx/routes/<名稱>.conf`（預設 `/<名稱>/`） |
| 後端 F5 失敗 | 確認已安裝 .NET 10 與 VS Code「Container Tools」擴充功能（`.vscode/extensions.json` 已推薦） |
| 想從頭再來 | `./uninstall.sh` 後再執行 `./install.sh`（工作區金鑰保留不變） |

---

## 6. 授權

- **程式碼**：Apache License 2.0（`LICENSE`），免費提供給全世界的人使用、修改與再散布，包括商業用途。
- **名稱與圖示**：「worldTraveler」名稱與 8-bit 紅帽子地球圖示屬於 Chung, Chi-Wen（台灣），不包含在程式碼授權裡（Apache-2.0 第 6 條）。可以原樣使用、轉發與介紹官方工具；用於自己的產品、修改版或申請商標需要書面同意，見 `TRADEMARKS.md`。
- 你用這個初始包開發的專案屬於你自己，可以自行決定授權；第三方元件（Vue.js、pako、TypeScript 等）維持各自的授權。
