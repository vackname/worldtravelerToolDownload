interface getMD5Result
{
    /** md5 to hex*/
    hex:(s:string)=>string,
    /** md5 to base64 */
    b64:(s:string)=>string,
    /** md5*/
    str:(s:string)=>string,
    /** md5 hex 漢明碼*/
    hex_hmac:(key:string, data:string)=>string,
    /** md5 hex 漢明碼 to base64*/
    b64_hmac:(key:string, data:string)=>string,
    /** md5 漢明碼*/
    str_hmac:(key:string, data:string)=>string,
}

/** md5 取用 */
export default interface getMD5Function
{
    ():getMD5Result;
}