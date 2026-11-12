import objJsTypeFun from '../vueModelsJSTypeScript';
import objJsFun from '../vueModelsJS';
/** 載入models js source物件 */
export default interface models
{
 /** JWTCrypto encode */
 JWTCrypto:objJsFun,
 /** to QRDecode */
 QRDecoder:objJsFun,
 /** Web Socket */
 WebSocket:objJsFun,
 /** web rtc 使用 */
 adapterRTC:objJsFun,
 /** chart 圓餅圖 */
 d3v4Chart:objJsFun,
 /** models->debugBundleWebSocket */
 debugBundleWebSocket:objJsFun,
 /** vide hls */
 hls:objJsFun,
 /** md5 decode/encode */
 md5Ascii:objJsFun,
 /** create qrcode */
 qrcode:objJsFun,
 /** vide js */
 video:objJsFun
}
