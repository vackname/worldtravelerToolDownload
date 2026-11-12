function JWTCryptoObj()
{
    this.CreateJWT = function(Header, Payload, Secret) 
    {        
        //密鑰
        var hash = CryptoJS.HmacSHA256(Payload.iss, Secret);
        var getSecret = CryptoJS.enc.Hex.stringify(hash).replace(/-/g,"").toLowerCase();
        //帳戶加密
        // Sign the JWT using KJUR.jws.JWS.sign
        var jwt = KJUR.jws.JWS.sign(
            "HS256",
            JSON.stringify(Header),
            JSON.stringify(Payload),
            { utf8: getSecret }
        );
        return jwt;
    };
};
var JWTCrypto = function(){return new JWTCryptoObj()};