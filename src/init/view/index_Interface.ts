import * as interfaceFormat from "../../models/vueTemplateFormat";

/** template watch */
export interface Watch extends interfaceFormat.addVueWatch
{
}

/** template computed */
export interface Computed extends interfaceFormat.addVueComputedFormat
{
}

/** template Filter */
export interface Filter extends interfaceFormat.addVueFilterFunctionFormat
{
}

/** 首頁文字 (temp/translation/<tw|en>/start.json) */
export interface StartText
{
    nav:{ quick:string, demos:string, docs:string, switchTo:string },
    hero:{ badge:string, title:string, lead:string, start:string, docs:string, hint:string },
    quick:{ title:string, steps:Array<{ t:string, d:string, f:string }> },
    demos:{ title:string, lead:string, items:{ [key:string]:any }, code:{ [key:string]:string } },
    foot:{ name:string, edit:string, docs:string, rule:string }
}

/** template Action/methods (only support Function) */
interface ActionFunction
{
    /** 首頁文字 (中文 / 日文 → tw，其他 → en) */
    text?:()=>StartText,
    /** 捲動到區塊 */
    go?:(id:string)=>void,
    /** model：抽一個目的地 */
    pickPlace?:()=>void,
    /** task：執行三個步驟 */
    runTask?:()=>void,
    /** 子專案：載入 aa */
    loadAa?:()=>void,
    /** urlHistory：寫入網址並重新整理 */
    saveToUrl?:()=>void,
    /** models 套件：產生 JWT */
    makeJwt?:()=>void
}

/** template Action/methods */
export interface Action extends interfaceFormat.addVueAction,ActionFunction
{
}

/** view index 數據 */
export interface Data extends ActionFunction
{
    /** model 載入完成 (controllers.completed 設定) */
    mLoad:boolean,
    /** 樣板 TypeScript 範例：index.html inline <script lang="ts"> 以 $view.created 寫入 */
    tsInline:string,
    /** 樣板 TypeScript 範例：index.script.ts 以 $view.ready 寫入 */
    tsSrc:string
}
