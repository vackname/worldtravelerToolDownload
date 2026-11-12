/**
 * load async function
*/
interface AsyncJsFun<T>
{
    /**
     * @param e T model
    */
    (e:T):void
}


/**
 *  models name(function)
*/
export default interface objJsFun{
    /**
     * 載入 models 套件；可寫回呼，或 await 取得結果
     * @example const fx = await $t.import.m.js.fxFormat<any>();
     * @param fun load async function (可省略)
    */
    <T>(fun?:AsyncJsFun<T>):Promise<T>;
}