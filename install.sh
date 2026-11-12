#!/usr/bin/env bash
# worldTraveler 開版初始包：一鍵安裝
#
# ★ 商業版：使用線上映像檔 f01592000/worldtravelervue-command:prod_2611120531、f01592000/worldtravelervue-web:prod_2611120531
#   (寫入 .env 的 WT_REGISTRY=f01592000/、WT_VERSION=prod_2611120531；docker-compose.yml 依此選用。換版本：WT_VERSION=<版號> ./install.sh)
#
#   ./install.sh [--name <工作區名稱>] [--port <網頁 port>] [--redis] [--no-vscode] [--no-start]
#     --port 未指定時：沿用 .env，否則自 9788 起找第一個未被使用的 port
#     --redis       一併啟用 Redis 7.4 (之後也可在 VS Code 右鍵 DotNetProject → worldTraveler → 啟用 / 停用 Redis)
#
# 會做的事 (可重複執行，已完成的步驟會略過)：
#   1. 檢查 Docker (必要)、.NET 10 / VS Code (建議)
#   2. 準備映像檔 worldtravelervue-command / worldtravelervue-web
#        本機已有 → 使用；設定 WT_REGISTRY → docker pull；否則由原始碼建置 (WT_SOURCE 或 ../worldTravelerBuildVue)
#   3. 初始化工作區：worldtraveler.json、工作區金鑰、.env、docker 網路
#   4. 安裝 VS Code 擴充功能 (tool/worldtraveler-*.vsix)
#   5. 啟動前端 debug (docker compose up -d)，開啟瀏覽器與 VS Code
set -euo pipefail
cd "$(dirname "$0")"
# 訊息語系：WT_LANG / LC_ALL / LC_MESSAGES / LANG 為 zh*、ja* → 中文，其他 → 英文 (寫入 .env 的 WT_LANG，wt 也依此輸出)
_lang="${WT_LANG:-${LC_ALL:-${LC_MESSAGES:-${LANG:-zh}}}}"
case "$_lang" in zh*|ja*|ZH*|JA*) ZH=1; WTL=zh;; *) ZH=0; WTL=en;; esac
m() { if [ "$ZH" = 1 ]; then printf '%s' "$1"; else printf '%s' "$2"; fi; }
usage_en() {
  cat <<'USAGE'
worldTraveler starter package: one-step install

  ./install.sh [--name <workspace name>] [--port <web port>] [--redis] [--no-vscode] [--no-start]
    --port   default: keep the value in .env, otherwise the first free port from 9788
    --redis  also enable Redis 7.4 (later: right-click DotNetProject → worldTraveler → Enable / Disable Redis 7.4)

What it does (safe to run again; finished steps are skipped):
  1. Check Docker (required), .NET 10 / VS Code (recommended)
  2. Prepare the images worldtravelervue-command / worldtravelervue-web
       already local → use them; WT_REGISTRY set → docker pull; otherwise build from source (WT_SOURCE or ../worldTravelerBuildVue)
  3. Initialize the workspace: worldtraveler.json, workspace secrets, .env, docker network
  4. Install the VS Code extension (tool/worldtraveler-*.vsix)
  5. Start frontend debug (docker compose up -d) and open the browser and VS Code
USAGE
}
WS="$(pwd)"

NAME="$(basename "$WS")"; PORT=""; VSCODE=1; START=1; REDIS=0
VER="${WT_VERSION:-prod_2611120531}"; REG="${WT_REGISTRY:-f01592000/}"
while [ $# -gt 0 ]; do
  case "$1" in
    --name) NAME="$2"; shift 2;;
    --port) PORT="$2"; shift 2;;
    --target) m "--target 已停用：輸出語法由 src/init/main.ts 的 toVueVersion 決定 (vue2 = ES5、vue3 = ES2020)" "--target is no longer used: the output syntax follows toVueVersion in src/init/main.ts (vue2 = ES5, vue3 = ES2020)"; echo; shift 2;;
    --redis) REDIS=1; shift;;
    --no-vscode) VSCODE=0; shift;;
    --no-start) START=0; shift;;
    -h|--help) if [ "$ZH" = 1 ]; then sed -n '2,15p' "$0"; else usage_en; fi; exit 0;;
    *) echo "$(m "未知參數" "Unknown option"): $1"; exit 1;;
  esac
done
NAME="$(echo "$NAME" | sed 's/[^A-Za-z0-9_]/_/g; s/^[^A-Za-z]/w&/')"

c_ok()   { printf '\033[32m✔ %s\033[0m\n' "$*"; }
c_warn() { printf '\033[33m⚠ %s\033[0m\n' "$*"; }
c_err()  { printf '\033[31m✘ %s\033[0m\n' "$*"; }
step()   { printf '\n\033[1m[%s] %s\033[0m\n' "$1" "$2"; }

step 1/5 "$(m "檢查環境" "Check environment")"
command -v docker >/dev/null && docker info >/dev/null 2>&1 || { c_err "$(m "需要 Docker 並已啟動" "Docker is required and must be running") (https://docs.docker.com/get-docker/)"; exit 1; }
c_ok "Docker $(docker version --format '{{.Server.Version}}')"
if command -v dotnet >/dev/null && dotnet --list-sdks 2>/dev/null | grep -q '^10\.'; then c_ok ".NET SDK $(dotnet --version)"
else c_warn "$(m "未偵測到 .NET 10 SDK：前端可正常使用；新增 .NET 後端與 debug 需要安裝" ".NET 10 SDK not found: the frontend works; creating and debugging .NET backends needs it") (https://dotnet.microsoft.com/download)"; fi
CODE=""
if [ $VSCODE = 1 ]; then
  for c in code "/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code"; do command -v "$c" >/dev/null 2>&1 && { CODE="$c"; break; }; done
  [ -n "$CODE" ] && c_ok "VS Code CLI" || c_warn "$(m "找不到 VS Code 的 code 指令：稍後請手動安裝 tool/ 內的 .vsix (見 READ.md)" "VS Code's code command not found: install the .vsix in tool/ by hand later (see READ.en.md)")"
fi

step 2/5 "$(m "準備映像檔" "Prepare images")"
need=()
for img in command web; do docker image inspect "${REG}worldtravelervue-$img:$VER" >/dev/null 2>&1 || need+=("$img"); done
if [ ${#need[@]} -eq 0 ]; then c_ok "$(m "映像檔已存在" "Images already present") (worldtravelervue-*:$VER)"
elif [ -n "$REG" ]; then
  for img in "${need[@]}"; do docker pull "${REG}worldtravelervue-$img:$VER"; done; c_ok "$(m "已下載映像檔" "Images downloaded")"
else
  SRC="${WT_SOURCE:-$WS/../worldTravelerBuildVue}"
  [ -x "$SRC/docker/build-images.sh" ] || { c_err "$(m "找不到映像檔，也找不到原始碼" "No images and no source found") ($SRC). $(m "請設定 WT_REGISTRY 或 WT_SOURCE" "Set WT_REGISTRY or WT_SOURCE")"; exit 1; }
  echo "$(m "由原始碼建置" "Building from source") ($SRC)$(m "，首次約需數分鐘..." ", the first time takes a few minutes...")"; "$SRC/docker/build-images.sh" "$VER" >/dev/null; c_ok "$(m "已建置映像檔" "Images built")"
fi
CMD_IMG="${REG}worldtravelervue-command:$VER"

step 3/5 "$(m "初始化工作區" "Initialize workspace")"
# 網頁 port：--port → .env 既有值 → 9788 起第一個未被使用的 port (避免與其他專案衝突)
port_busy() { (exec 3<>"/dev/tcp/127.0.0.1/$1") 2>/dev/null; }
if [ -z "$PORT" ]; then
  PORT="$(grep '^WT_PORT=' .env 2>/dev/null | cut -d= -f2 || true)"
  if [ -z "$PORT" ]; then PORT=9788; while port_busy "$PORT"; do PORT=$((PORT+1)); done; fi
fi
# 工作區 id：以路徑雜湊產生 (同一路徑重複安裝結果相同)；docker 名稱 = 名稱-id，不會與其他專案相撞
WSID="$(printf '%s' "$WS" | shasum | cut -c1-6)"
run_wt() { docker run --rm --user "$(id -u):$(id -g)" -e WT_LANG="$WTL" -e HOME=/tmp -e DOTNET_CLI_HOME=/tmp -e WT_WORKSPACE_ID="$WSID" -e WT_PORT="$PORT" -v "$WS:/workspace" -w /workspace "$CMD_IMG" "$@"; }
run_wt init --name "$NAME" | grep -v "找不到 docker\|建立 docker 網路\|docker not found\|docker network" || true
# .env：補上使用者身分與參數 (wt init 產生，含工作區金鑰)
setenv() { grep -q "^$1=" .env && sed -i.bak "s#^$1=.*#$1=$2#" .env || echo "$1=$2" >> .env; rm -f .env.bak; }
setenv WT_UID "$(id -u)"; setenv WT_GID "$(id -g)"; setenv WT_PORT "$PORT"; setenv WT_VERSION "$VER"; setenv WT_REGISTRY "$REG"; setenv WT_LANG "$WTL"
if [ $REDIS = 1 ] && ! grep -q '^COMPOSE_PROFILES=.*redis' .env; then
  cur="$(grep '^COMPOSE_PROFILES=' .env | cut -d= -f2 || true)"; setenv COMPOSE_PROFILES "${cur:+$cur,}redis"
fi
NET="$(grep '^WT_NETWORK=' .env | cut -d= -f2)"
create_net() {
  docker network create "$NET" >/dev/null 2>&1 && return 0
  # Docker 預設位址池用完時 (all predefined address pools have been fully subnetted)：改用 10.231.x.0/24 中第一個未使用的網段
  local used; used=$(docker network inspect $(docker network ls -q) -f '{{range .IPAM.Config}}{{.Subnet}} {{end}}' 2>/dev/null)
  for i in $(seq 1 254); do
    case " $used " in *" 10.231.$i.0/24 "*) continue;; esac
    docker network create --subnet "10.231.$i.0/24" "$NET" >/dev/null 2>&1 && { c_warn "$(m "Docker 預設網段已用完，改用" "Docker's default address pools are used up; using") 10.231.$i.0/24"; return 0; }
  done
  c_err "$(m "無法建立 Docker 網路" "Cannot create the Docker network") $NET ($(m "可執行 docker network prune 清除未使用的網路" "run docker network prune to remove unused networks"))"; exit 1
}
docker network inspect "$NET" >/dev/null 2>&1 || create_net
c_ok "$(m "工作區" "Workspace") $NAME ($(m "compose 專案" "compose project") $(grep '^WT_PROJECT=' .env | cut -d= -f2), $(m "docker 網路" "docker network") $NET, $(m "網頁 port" "web port") $PORT)"

step 4/5 "$(m "安裝 VS Code 擴充功能" "Install the VS Code extension")"
VSIX="$(ls tool/worldtraveler-*.vsix 2>/dev/null | sort -V | tail -1 || true)"
if [ $VSCODE = 0 ]; then c_warn "$(m "已略過" "Skipped") (--no-vscode)"
elif [ -z "$VSIX" ]; then c_warn "$(m "tool/ 內沒有 .vsix" "No .vsix in tool/")"
elif [ -z "$CODE" ]; then c_warn "$(m "請手動安裝：VS Code → 擴充功能 → ⋯ → 從 VSIX 安裝" "Install it by hand: VS Code → Extensions → ⋯ → Install from VSIX") → $VSIX"
else "$CODE" --install-extension "$VSIX" --force >/dev/null && c_ok "$(m "已安裝" "Installed") $(basename "$VSIX")"; fi

step 5/5 "$(m "啟動前端 debug" "Start frontend debug")"
if [ $START = 0 ]; then c_warn "$(m "已略過 (--no-start)，之後可執行" "Skipped (--no-start); later run"): docker compose up -d"
else
  docker compose up -d >/dev/null 2>&1 || { c_err "$(m "docker compose 啟動失敗，請執行 docker compose up 查看原因" "docker compose failed to start; run docker compose up to see why")"; exit 1; }
  printf '%s' "$(m "等待首次封裝" "Waiting for the first bundle")"
  for i in $(seq 1 120); do docker compose logs bundle 2>&1 | grep -q "debug 就緒\|debug ready" && break; printf '.'; sleep 1; done; echo
  c_ok "$(m "前端 debug" "Frontend debug"): http://127.0.0.1:$PORT ($(m "nginx 閘道；後端 API 走 /<API 名稱>/" "nginx gateway; backend APIs at /<API name>/"))"
  grep -q '^COMPOSE_PROFILES=.*redis' .env && c_ok "Redis 7.4: $(m "容器內" "inside containers") redis:6379, $(m "本機" "this machine") $(docker compose port redis 6379 2>/dev/null)"
  if command -v open >/dev/null; then open "http://127.0.0.1:$PORT"; elif command -v xdg-open >/dev/null; then xdg-open "http://127.0.0.1:$PORT" >/dev/null 2>&1 || true; fi
fi
[ -n "$CODE" ] && "$CODE" "$WS" >/dev/null 2>&1 || true

if [ "$ZH" = 1 ]; then printf '\n\033[1m完成！\033[0m 下一步請看 READ.md 的「啟用點」。\n'; else printf '\n\033[1mDone!\033[0m Next, see "Entry points" in READ.en.md.\n'; fi
