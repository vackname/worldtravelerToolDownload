interface nextImgLoad {
    /**
     * @param e 已載入img Array name
     */
    (e:Array<string>):void;
}

interface loadimgjsonClass
{
    /** 圖檔名 input
     * @param ary ex ["a.jpg","b.jpg"]
    */
    input:(ary:Array<string>)=>loadimgjsonClass,
    /** async wait load complete
     * @param fun 載入資訊
     */
    async:(fun:nextImgLoad)=>void
}

interface toJobjStr
{
    [x:string]:string
}


interface toJobj
{
    [x:string]:toJobjStr
}

/** load file、document */
export default interface jObj
{


    /** 當前指定容器陣列 key */
    key:string,
    /** json db */
    Jobj:toJobj,
    
    /** catch image(image 載入完成取值)
     * @param filename 檔名
     * @returns base64 image
    */
    src:(filename:string)=>string,

    /**
     * 一次性載入image (save memory)
    */
    loadimgjson:(url:string)=> loadimgjsonClass
    /**
     * 載入(image) psyl bundle libary(filefold) to img file
     * @param filefoldName 取得位於 libary\[*]之所有image json ex "AFilefold\imgfileflod"
     * @param fun async wait e="complete"=載入成功, e="fail"=載入失敗
     * */
    loadlib:(filefoldName:string,fun:(e:string)=>void)=>void,

    /**
     * 載入(json) psyl bundle models/jsonDoc/json file
     * @param filefoldName 取得位於json file(path:models\jsonDoc\[*]) ex config\title.json="config.title" 
     * @param fun async wait e="complete"=載入成功, e="fail"=載入失敗
     * */
    load:(filefoldName:string,fun:(e:string)=>void)=>void,

    /** json data(json 載入完成取值)
     * @param filename 檔名
     * @returns data json
    */
    get:(key:string)=>any,

    /**
     * remove json key&data
    */
    remove:(key:string)=>void

    /**
     * add json key & data
     * @param key create key name
     * @param data json object
    */
    add:(key:string,data:any)=>void

}