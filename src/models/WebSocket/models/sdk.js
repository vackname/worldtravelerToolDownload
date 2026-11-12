wSocket.prototype.input = function(s)
{//被取代使用 代理接收訊息 function
    console.log(s);
};

wSocket.prototype.connect = function()
{
    var $t = this;
    var wSocketFun = function()
    {//websocket 起動註冊
        $t.socket = new WebSocket($t.uri);
        $t.socket.onopen = function (e)
        { 
            if(e!=undefined)
            { 
                $t.input({error:"connect",mes:"opened",obj:e,t:pb.unixReNow()});
            }
        };
        $t.socket.onclose = function (e) {
            if(e!=undefined){ 
                $t.input({error:"close",mes:"closed",obj:e}); 
            }
        };

        $t.socket.onmessage = function (e) {
            if(e!=undefined)
            { 
                $t.input({error:"received",mes:e.data,obj:e}); 
            }
            else
            {
                $t.input({error:"messageLoss",mes:e.data,obj:e}); 
            }
            //socket.close();異常強制關閉
        };
        $t.socket.onerror = function (e) { 
            if(e!=undefined)
            {  
                $t.input({error:"error",mes:e.data,obj:e,t:pb.unixReNow()}); 
            }
            pb.LogindelCookie("WSCookieKey");//驗證cookie kill
        };
    };

    wSocketFun();//進入 webSocket    
};

wSocket.prototype.sendMes = function(text) 
{
    this.input({error:"send",mes:text,obj:{e:"empty"},t:pb.unixReNow()}); 
    this.socket.send(text);
};