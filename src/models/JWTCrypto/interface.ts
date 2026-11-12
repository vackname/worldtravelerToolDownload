

interface JWTCrypto
{
    /* 
    * @param Header json
    * @param Payload json
    * @param Secret secret key 原生未加密
    */
    CreateJWT:(Header:any, Payload:any, Secret:string)=>string
}

/** jwt create 取用 */
export default interface JWTCryptoAction
{
    ():JWTCrypto;
}