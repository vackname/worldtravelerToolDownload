import PJImport from "./ProjectMap/ProjectImportLoadList";
import importJs from "./ModelsInterface/js";
import importCss from "./ModelsInterface/css";

/** models sdk 夾 */
interface models
{
    /** css 載入 ex importLoad.[cssName]((e:string)=> {}) */
    css:importCss,
    /** model 載入 importLoad.[ModelName]((e:string)=> {}) */
    js:importJs,
}

/**
 * 載入model、project model 、css
*/
interface importLoadObj
{
    /** models sdk 夾 */
    m:models
    /** project 夾載入 importLoad.[ProjectName]((e:string)=> {}) */
    p:PJImport
}

/**
 * 載入model、project model 、css
*/
export default interface importLoad extends importLoadObj
{
    /** 任何經由 Config 注入之model */
    [name:string]:any
}