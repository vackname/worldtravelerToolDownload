[中文版 (Chinese version)](READ.md)

# worldTraveler Starter Package

An integrated development environment for a TypeScript + Vue 2 frontend framework with .NET 10 / Python 3.14 / Go 1.27 backends.
About **1 second** after you save frontend code, the browser reloads automatically. For the backend, press F5 in VS Code to debug with breakpoints inside Docker.

> The extension and wt show Chinese when VS Code / the system language is Chinese or Japanese, and English otherwise.

---

## 1. One-step Install

```bash
./install.sh
```

| Requirement | Needed? | Used for |
|---|---|---|
| Docker (running) | **Required** | Frontend bundling, the debug site, backend debug containers |
| VS Code + the `code` command | Recommended | Right-click project generation, F5 debugging (`install.sh` installs the extension automatically) |
| .NET 10 SDK | Recommended | Adding .NET backends and maintaining solution files (not needed if you only write frontend code) |

`install.sh` runs these 5 steps in order. You can run it again at any time; steps that are already done are skipped:

1. **Check the environment**: Docker, .NET 10, VS Code.
2. **Prepare the images** (`worldtravelervue-command`, `worldtravelervue-web`), checked in this order:
   - If they already exist locally, use them.
   - If `WT_REGISTRY=<account>/` is set, pull them from that registry.
   - Otherwise, build them from source (`WT_SOURCE=<path to worldTravelerBuildVue>`, default `../worldTravelerBuildVue`).
3. **Initialize the workspace**: create `worldtraveler.json`, a random workspace key (`.worldtraveler/`), `.env`, and the docker network.
   Docker names always take the form "workspace name-6-character id" (e.g. `myshop-3f9a1c`), so containers, networks and volumes never collide with other projects; the site port automatically avoids ports already in use.
4. **Install the VS Code extension**: `tool/worldtraveler-*.vsix`.
5. **Start frontend debug** (web + bundle + nginx gateway) and open http://127.0.0.1:<port> (shown when installation finishes).

Common options:

```bash
./install.sh --name myShop        # workspace name (default: folder name)
./install.sh --port 9800          # site port (default: first free port from 9788 up)
./install.sh --redis              # also enable Redis 7.4
./install.sh --no-vscode          # don't install the VS Code extension
./install.sh --no-start           # install only, don't start debug
```

**Uninstall**: `./uninstall.sh` stops all containers (frontend, nginx, Redis, backend APIs and debug containers) and removes the network. It does not delete your code.
- Add `--extension`: also remove the VS Code extension.
- Add `--images`: also delete the images.
- Add `--all`: all of the above.

---

## 2. Getting Started: From Install to the First Page

### 2.1 Four entry points for development

| Entry point | How | Result |
|---|---|---|
| **Frontend debug** | "**wT Frontend debug**" in the VS Code status bar, bottom left (already started by `install.sh`) | Save → auto bundle → browser reloads automatically |
| **New frontend page** | Right-click anywhere under `src` → **New Frontend Page...** | Creates a view or template component and opens the html / ts side by side |
| **New backend project** | Right-click `DotNetProject` / `PythonProject` / `goProject` → **New Backend Project...** | Generates the project, Dockerfile and `.vscode/launch.json` debug config; a webapi also gets a `docker-compose.yml` service and the nginx route `/<name>/` |
| **Backend debugging** | In VS Code "Run and Debug", pick "Docker dotnet / python / go:<name>" → F5 | Runs in Docker and stops at breakpoints; the site calls the API being debugged directly via `/<name>/` |

### 2.2 Where frontend code starts running

```
Browser opens http://127.0.0.1:<port>  (nginx gateway)
  └─ /libjs/worldTravelerBuildVue.min.js      framework core (Vue 2.7 + SDK), loads the next step automatically
      └─ src/config/loadModel.ts              ★ load order: shared css → public.ts → entry sub-project
          └─ src/init/main.ts + main.html     ★ home sub-project (site entry)
              └─ src/init/view/index.*        home page
```

- **Changing the home page**: start from `src/init/view/index.html` (template) and `index.ts` (data, events).
- **Example sub-project**: `src/aa` demonstrates switching views, sub-templates, TS models and Task async flows. Use it as a reference or delete it (right-click `src/aa` → worldTraveler → Remove (Frontend)).
- **Calling backend APIs**: use relative paths `/<API name>/...`, e.g. `ajax.Form.Get("/OrderApi/orders")`.

### 2.3 Frontend and backend APIs on the same URL

The site and the APIs share one URL, so the frontend never needs to know API ports and there are no CORS issues:

```
http://127.0.0.1:<port>  ──▶ nginx
                               ├─ /                → frontend site (dir/)
                               └─ /OrderApi/orders → OrderApi.api/orders
                                                       ├ container under F5 debug (stopped at a breakpoint)
                                                       └ or the compose service api-orderapi (when not debugging)
```

| To do this | Do this |
|---|---|
| Add an API | Right-click `DotNetProject` → New Backend Project... → webapi. The `api-<name>` service in `docker-compose.yml` and `nginx/routes/<name>.conf` are added automatically |
| Debug an API | In Run and Debug pick "Docker dotnet:<name>" → F5. The compose service of the same name is stopped first and the debug container takes over; the site needs no changes |
| Run all APIs together without debugging | Right-click `DotNetProject` → worldTraveler → **Run All Backend APIs in Containers (No Debug)** (`docker compose --profile api up -d --build`) |
| Redis 7.4 | Right-click `DotNetProject` → worldTraveler → **Enable / Disable Redis 7.4**. Backends connect to host `redis:6379`; locally, find the port with `docker compose port redis 6379` |
| Change an API path prefix | Edit `nginx/routes/<name>.conf`, then run `docker compose exec nginx nginx -s reload` |

### 2.4 Directory layout

```
src/                    frontend source (config entry settings, models shared components and SDK types, init / aa sub-projects)
extendsComponent/       custom Vue components (.vue)
Libary&Document/        images (libary) and i18n JSON (jsonDoc)
dir/                    bundle output = site root (generated; don't edit dir/libjs by hand)
DotNetProject/          .NET 10 backends (the ConfigForSystem shared library is added with the first project)
PythonProject/ goProject/
tool/                   VS Code extension installer (.vsix)
AGENTS.md CLAUDE.md     project guidance for AI (see section 3)
createVueRule.md        frontend development rules (shared by AI and developers)
docker-compose.yml .env frontend debug + nginx + Redis + backend API services (.env holds keys; don't commit it)
nginx/                  gateway config: default.conf, routes/<API name>.conf
```

### 2.5 VS Code extension (`tool/worldtraveler-*.vsix`)

The icon is the 8-bit red-hat Earth (laughing side profile). For html under `src/` it provides:

| Feature | Description |
|---|---|
| Template tags | `<totemp>` / `<json>` / `<bundle>` get their own color, a 📄 in the gutter and a marker after the tag (template / text set / embedded in release); misplaced tags get a yellow warning |
| Open paths | `<totemp>` template paths, `props` and `<json src>`: click "Open …" above the tag, or ⌘ / Ctrl + click, or F12 |
| `<totemp>` parameters | `@v{name}` in a template shows the value passed by the parent; hover shows where it comes from; typing `@v{` completes names |
| TypeScript in html | `<script lang="ts">` gets types, completion and error checking; APIs such as `pb.el` have docs |

The color, 📄 and "Open …" can each be turned off with the `worldTraveler.flags.*` settings; the UI follows the VS Code language (Traditional Chinese or English).

### 2.6 Deploy: multiple frontend sites (subdomain / `?wtsite=`)

One website can serve several projects' frontends: put another project's `wt fe build` output (`dir/`) in `wwwroot/<site>/` and set `WorldTraveler:Sites` (or the environment variable `WT_SITES=a,b`).

```
https://example.com           → wwwroot/libjs/      (default)
https://b.example.com         → wwwroot/b/libjs/    (subdomain b)
https://example.com/?wtsite=b → wwwroot/b/libjs/
```

The home page outputs the core with `CoreSelect.Tag(HttpContext)`; frontend code doesn't change. See "Multiple frontend sites" in `createVueRule.md`.

---

## 3. Working with AI

This framework is **not** a regular Vue / webpack project. Without guidance, AI tools often turn it into npm packages, change tsconfig, or forget to register files in `package.json`. The starter package already includes guidance files that AI tools read automatically:

| File | Read by | Contents |
|---|---|---|
| `AGENTS.md` | All AI coding assistants (Claude Code, Codex, Cursor, etc.) | Layout, frontend framework conventions, backend structure, commands, things not to do |
| `createVueRule.md` | Required reading before AI edits the frontend (AGENTS.md requires it) | Frontend rules: entry points, MVVM layering, lifecycle, `<json>` text sets, `<totemp>` nested templates, template `<script lang="ts">` and `$view`, `<bundle>`, checklist |
| `CLAUDE.md` | Claude Code (imports the same content via `@AGENTS.md`) | — |
| `.github/copilot-instructions.md` | GitHub Copilot | Same as AGENTS.md |
| `AGENTS.md` inside each backend project | AI editing that project | That language template's structure and build steps |

> For your own team's rules, add them at the end of `AGENTS.md` so all three AI tools read them; add frontend coding rules to `createVueRule.md`.

### 3.1 Recommended way of working

1. **Let the tooling create files, let the AI write content**: create the page or project with the right-click menu (or `wt` commands) first, then ask the AI to fill it in. That keeps `package.json`, the type map, `.sln` and `launch.json` consistent.
2. **One page at a time**: be clear about the sub-project, page name, the data to show and the interactions.
3. **Have the AI verify its own work**: bundling succeeds and there are no TypeScript errors before it hands back to you.

### 3.2 Example prompts

```text
Add a view productList in src/init: a table listing products (name, price, stock), using mock data for now;
clicking a row switches to the productDetail view. First create the view with wt, then write the content, and finally run the frontend bundle to confirm there are no errors.
```

```text
Add a .NET webapi project OrderApi that provides GET /orders returning a list of orders (in-memory data for now),
and have src/init/view/index call this API via the relative path /OrderApi/orders to show the number of orders.
```

```text
After adding the [DBM] attribute to OrderApi's table classes, generate TypeScript interfaces with wt fe tscdb,
and switch the frontend order type to the interface in src/models/SysConfig_Interface/JsonInterface/db.ts.
```

### 3.3 Commands the AI can run itself

The AI can run these commands in the terminal to confirm its changes. No local Node is needed; frontend commands all run in Docker:

```bash
# Frontend: create / bundle / check (TypeScript errors are listed with ⚠)
docker run --rm -v "$PWD:/workspace" worldtravelervue-command:dev fe new view <sub-project> <view>
docker run --rm -v "$PWD:/workspace" worldtravelervue-command:dev fe build
docker compose logs --tail 20 bundle        # see the debug watcher's rebuild results

# Backend (requires .NET 10; the wt bundled with the extension)
dotnet ~/.vscode/extensions/worldtraveler.worldtraveler-*/tool/wt.dll new dotnet webapi -o OrderApi
dotnet build *.slnx
```

### 3.4 Rules for the AI (already in AGENTS.md)

- **Don't touch generated files**: don't edit `dir/`, `src/models/SysConfig_Interface/ProjectMap` or other generated files.
- **Don't change the architecture**: don't convert the frontend to webpack, vite or npm packages, and don't raise the tsconfig target to ES2015 or above. The framework calls user functions with `new`, so they must compile to ES5 semantics.
- **Use the tooling to add pages**: always add or remove pages and projects with `wt` or the right-click menu, never by creating files by hand.

---

## 4. Everyday Command Reference

| Purpose | VS Code | Command |
|---|---|---|
| Start / stop frontend debug | Status bar "wT Frontend debug" | `docker compose up -d` / `docker compose down` |
| New frontend page | Right-click → New Frontend Page... | `wt fe new view <project> <name>` |
| New frontend sub-project | Right-click `src` → worldTraveler → New Frontend Project... | `wt fe new project <name>` |
| Frontend release bundle | Right-click `src` → worldTraveler → Frontend Release Bundle | `wt fe build [--target es2020]` |
| Add / remove a backend | Right-click `DotNetProject` etc. | `wt new dotnet webapi -o <name>` / `wt remove dotnet <name> --yes` |
| Run all APIs in containers | Right-click `DotNetProject` → worldTraveler → Run All Backend APIs in Containers (No Debug) | `docker compose --profile api up -d --build` |
| Enable / disable Redis | Right-click `DotNetProject` → worldTraveler → Enable / Disable Redis 7.4 | Set `COMPOSE_PROFILES=redis` in `.env`, then `docker compose up -d` |
| Generate interfaces from the DB | Command Palette → worldTraveler: Generate TypeScript / Go Interfaces from Backend DB | `wt fe tscdb --url http://127.0.0.1:<port>` |

Two ways to run `wt` in this starter package:
- Frontend commands: `docker run --rm -v "$PWD:/workspace" worldtravelervue-command:dev <command>`
- Backend commands: `dotnet <extension folder>/tool/wt.dll <command>`

---

## 5. Troubleshooting

| Problem | Fix |
|---|---|
| The browser doesn't reload automatically | Check `docker compose logs bundle` for rebuild messages; make sure the URL is `127.0.0.1:<port>`, not `localhost` |
| No worldTraveler items in the right-click menu | Make sure `worldtraveler.json` exists at the root (run `./install.sh`), then reload the VS Code window |
| Want a different site port | `./install.sh --port 9800` (writes `WT_PORT` in `.env`); `docker compose up -d` then uses the new port |
| API calls from the site return 502 | That API isn't running: start it with F5 debug, or "Run All Backend APIs in Containers (No Debug)" |
| API calls from the site return 404 | Wrong path prefix: check `nginx/routes/<name>.conf` (default `/<name>/`) |
| Backend F5 fails | Make sure .NET 10 and the VS Code "Container Tools" extension are installed (recommended in `.vscode/extensions.json`) |
| Want to start over | Run `./uninstall.sh`, then `./install.sh` again (the workspace key is kept) |

---

## 6. License

- **Code**: Apache License 2.0 (`LICENSE`), free for everyone in the world to use, modify and redistribute, including commercially.
- **Name and logo**: the name "worldTraveler" and the 8-bit red-hat Earth logo belong to Chung, Chi-Wen (Taiwan) and are not covered by the code license (Apache-2.0 Section 6). You may use, redistribute and present the official tool as is; using them for your own product, a modified version or a trademark requires written permission. See `TRADEMARKS.md`.
- Projects you build with this starter are yours to license as you choose; third-party components (Vue.js, pako, TypeScript, etc.) keep their own licenses.
