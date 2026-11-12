import {importLoad} from "../../models/vueSDK";
import type {WtScriptView} from "../../models/vueSDK";
import type indexView from "./index";
// <script lang="ts" src="./index.script.ts"> 引用的外部檔 (不需要加進 package.json)
// export default function($view)：註冊 init/view/index 樣板時 (Vue 建立之前) 執行一次；$view 的型別寫出來，VS Code 就有完整提示
export default function($view:WtScriptView<typeof indexView>)
{
    $view.ready($t=>{
        // DOM 已產生；$t 有 index.ts 的 data / action
        $t.tsSrc = "models = " + Object.keys(importLoad.m.js).join(", ") + " · " + $t.text!().demos.items.htmlts.t;
    });
}
