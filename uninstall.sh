#!/usr/bin/env bash
# worldTraveler 開版初始包：移除執行環境 (不刪除你的程式碼)
#
#   ./uninstall.sh [--extension] [--images] [--all]
#     (預設)        停止前端 debug / nginx / Redis / 後端 API 與 debug 容器、移除 docker 網路
#     --extension   一併移除 VS Code 擴充功能
#     --images      一併刪除 worldtravelervue-* 映像檔 (其他工作區若仍在使用請勿加)
#     --all         以上全部
set -euo pipefail
cd "$(dirname "$0")"
_lang="${WT_LANG:-${LC_ALL:-${LC_MESSAGES:-${LANG:-zh}}}}"
case "$_lang" in zh*|ja*|ZH*|JA*) ZH=1;; *) ZH=0;; esac
m() { if [ "$ZH" = 1 ]; then printf '%s' "$1"; else printf '%s' "$2"; fi; }
EXT=0; IMG=0
for a in "$@"; do case "$a" in --extension) EXT=1;; --images) IMG=1;; --all) EXT=1; IMG=1;; -h|--help) if [ "$ZH" = 1 ]; then sed -n '2,8p' "$0"; else printf '%s\n' 'Remove the worldTraveler runtime (your code is kept)' '  ./uninstall.sh [--extension] [--images] [--all]' '    (default)     stop frontend debug / nginx / Redis / backend API and debug containers, remove the docker network' '    --extension   also uninstall the VS Code extension' '    --images      also delete the worldtravelervue-* images (skip if other workspaces still use them)' '    --all         all of the above'; fi; exit 0;; esac; done

[ -f docker-compose.yml ] && docker compose --profile redis --profile api down 2>/dev/null && echo "✔ $(m "已停止前端 debug、nginx、Redis、後端 API 容器 (Redis 資料 volume 保留)" "Stopped frontend debug, nginx, Redis and backend API containers (the Redis data volume is kept)")"
# VS Code F5 留下的後端 debug 容器 (名稱 <compose 專案>_<語言>_<專案>)
PROJECT="$(grep '^WT_PROJECT=' .env 2>/dev/null | cut -d= -f2 || true)"
if [ -n "$PROJECT" ]; then
  ids="$(docker ps -aq --filter "name=^${PROJECT}_" || true)"
  [ -n "$ids" ] && docker rm -f $ids >/dev/null && echo "✔ $(m "已移除後端 debug 容器" "Removed backend debug containers")"
fi
NET="$(grep '^WT_NETWORK=' .env 2>/dev/null | cut -d= -f2 || true)"
if [ -n "$NET" ] && docker network inspect "$NET" >/dev/null 2>&1; then
  docker network rm "$NET" >/dev/null 2>&1 && echo "✔ $(m "已移除 docker 網路" "Removed docker network") $NET" || echo "⚠ $(m "網路仍有容器使用 (例如後端 debug 容器)，未移除" "The network is still used by containers (for example backend debug containers); not removed"): $NET"
fi
if [ $EXT = 1 ]; then
  CODE="$(command -v code || echo "/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code")"
  "$CODE" --uninstall-extension worldtraveler.worldtraveler >/dev/null 2>&1 && echo "✔ $(m "已移除 VS Code 擴充功能" "Uninstalled the VS Code extension")" || echo "⚠ $(m "未移除擴充功能 (請在 VS Code 擴充功能面板手動解除安裝)" "The extension was not removed (uninstall it from the VS Code Extensions view)")"
fi
if [ $IMG = 1 ]; then
  docker image ls --format '{{.Repository}}:{{.Tag}}' | grep 'worldtravelervue-' | xargs -r docker image rm >/dev/null && echo "✔ $(m "已刪除 worldtravelervue-* 映像檔" "Deleted the worldtravelervue-* images")"
fi
echo "$(m "完成。程式碼 (src/、DotNetProject/ ...) 與 .worldtraveler/、.env 保留未動；如要重新安裝請執行 ./install.sh" "Done. Your code (src/, DotNetProject/ ...), .worldtraveler/ and .env are untouched; run ./install.sh to install again")"
