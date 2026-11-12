/**
 * load async function
*/
interface AsyncFun
{
    /**
     * @param e type =(complete = 載入成功！)(fail = 載入失敗！)
    */
    (e:string):void
}


/**
 *  file css name(function)
*/
export default interface objCssFun{
    /**
     * @param fun load async function
    */
    (fun:AsyncFun):void;
}
