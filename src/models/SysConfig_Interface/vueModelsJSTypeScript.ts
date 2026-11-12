

/**
 * load async function
*/
interface AsyncJsFun<T>
{
    /**
     * @param e TypeScript 套件 main.ts 的 default class (例：new e($t))
    */
    (e:new (...args:any[]) => T):void
}


/**
 *  models name(function)
*/
export default interface objJsFun{
    /**
     * 載入 TypeScript 套件；可寫回呼，或 await 取得 class
     * @example const Cls = await $t.import.m.js.tsPkg<MyPkg>(); const o = new Cls($t);
     * @param fun load async function (可省略)
    */
    <T>(fun?:AsyncJsFun<T>):Promise<new (...args:any[]) => T>;
}