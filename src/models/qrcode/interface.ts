/** QRCODE setting*/
interface QRKeyVal
{
    /** 内容 */
    text?:string,
    /** img width px*/
    width:number,
    /** img height px*/
    height:number,
    /** 前景色 */
    colorDark?:string|"#000000",
    /** 背景色 */
    colorLight?:string|"#ffffff",
    /** 容錯率
     * L 7%
     * M 15%
     * Q 25%
     * H 30%
     */
    correctLevel?:number
}

/** 容錯率 */
interface getCorrectLevel
{
    /** 7% */
    L:number| 1, 
    /** 15% */
    M:number| 0, 
    /** 25% */
    Q:number| 3, 
    /** 30% */
    H:number| 2
}

/** QRCode create new QRCode(x:?)
 * canvas get div element
 * 
 * svg to html
 *   <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
 *      <g id="qrcode"/>
*   </svg>
 */
export default interface QRCode
{
    new (el:HTMLElement,json:QRKeyVal):QRCode;

    /** data convert to QRCode Img */
    makeCode:(val:string)=>void;
    /** remove element */
    clear:()=>void;
    CorrectLevel:getCorrectLevel;
}