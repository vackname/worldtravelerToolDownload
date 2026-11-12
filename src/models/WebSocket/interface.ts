interface input
{
    /** socket status
     * 1."connect" websocket 連線成功
     * 2."close" websocket 已關閉
     * 3."recevied" websocket 其它 client 回傳訊息
     * 4."send" 自己 send 的訊息
     * 5."messageLoss" websocket 其它 client 回傳訊息異常(undefined)
    */
    error:string,
    /**
     * 接收訊息 data
    */
    mes:string,
    /**
     * server response data
     */
    obj:string,
    /**
     * 接收、發訊 client 端 unix 時間
    */
    t:number
}
export default interface webSocket
{
    new (url:String):webSocket;
    /** websocket connection */
    connect:()=>void,
    /** 取得 websocket server message */
    input:(mes:input)=>void,
    /** send message websocket */
    sendMes:(mes:string)=>void,
}