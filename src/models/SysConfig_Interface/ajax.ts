import GetObj from "./ajax/ajaxGetObj";
import PostObj from "./ajax/ajaxPostObj";
import FileStreamObj from "./ajax/ajaxFileStreamObj";
import JsonObj from "./ajax/ajaxJsonObj";
import uploadObj from "./ajax/ajaxUploadFile";

/**
 * url ID key Delete/PUt 作動 Form GET ajax
 */
interface urlIDObjGETForm extends GetObj
{
    /** Set type String delete/put 使用url ID/value */
    InputUrlIDForString:(valID:string)=>urlIDObjGETForm ,
    /** Set type number delete/put 使用url ID/value*/
    InputUrlIDForNumber:(valID:number)=>urlIDObjGETForm
}


/**
 * 僅限 get 使用
 * @param url Api 路經
*/
type goApiGet = (url:string)=>urlIDObjGETForm;

/**
 * 僅限 get  stream file 使用
 * @param url Api 路經
*/
type goApiFileStream= (url:string)=>FileStreamObj;

/**
 * url ID key Delete/PUt/POST 作動 Form ajax
 */
interface urlIDObjForm extends PostObj
{
    /** Set type String delete/put 使用url ID/value */
    InputUrlIDForString:(valID:string)=>urlIDObjForm,
    /** Set type number delete/put 使用url ID/value*/
    InputUrlIDForNumber:(valID:number)=>urlIDObjForm
}

/**
 * Delete/PUT Json Body
 * @param url Api 路經
*/
type goApiJsonToUrlIDForm = (url:string)=>urlIDObjForm;


/**
 * url ID key Delete/PUT/POST 作動 Json Body ajax
 */
interface urlIDObj extends JsonObj
{
    /** Set type String delete/put 使用url ID/value*/
    InputUrlIDForString:(valID:string)=>urlIDObj,
    /** Set type number delete/put 使用url ID/value */
    InputUrlIDForNumber:(valID:number)=>urlIDObj
}

/**
 * Delete/PUT Json Body
 * @param url Api 路經
*/
type goApiJsonToUrlID = (url:string)=>urlIDObj;

/** form for post */
interface ajaxMethodFormPost
{   
    /**
     *  ajax post to gZip input for data (application/x-www-form-urlencoded)
    */
    sendGzip:goApiJsonToUrlIDForm,

    /**
     *  ajax post (application/x-www-form-urlencoded)
    */
    send:goApiJsonToUrlIDForm,
}

/** form */
interface ajaxMethodForm
{   
    /**
     *  ajax get (application/x-www-form-urlencoded)
    */
    Get:goApiGet,

    /** remove source (application/x-www-form-urlencoded)*/
    Delete:goApiJsonToUrlIDForm,

    /**
     * ajax Replace (application/x-www-form-urlencoded)(Create or Update)
     */
    Put:goApiJsonToUrlIDForm,

    /** Method Post */
    Post:ajaxMethodFormPost,

    /**
     *  ajax post file (multipart/form-data)
    */
    UploadFile:uploadObj,
}

/** json body */
interface ajaxMethodJson
{
    /** remove source (application/json)*/
    Delete:goApiJsonToUrlID,

    /**
     * ajax Replace (application/json)(Create or Update)
     */
    Put:goApiJsonToUrlID,

    /**
     *  ajax (application/json)
    */
    sendGzip:goApiJsonToUrlID,

    /**
     *  ajax (application/json)
    */
    send:goApiJsonToUrlID,
}

export interface ajax
{
    /**
     * ajax stream for File (application/octet-stream)
    */
    Stream:goApiFileStream,
    /**
     * ajax (? / form)
     */
    Form:ajaxMethodForm,

    /**  ajax (application/json) */
    JSON:ajaxMethodJson,
}