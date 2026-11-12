import PostObj from "./ajaxPostObj";
/**
 * url ID key Delete/PUt 作動 Form ajax
 */
interface urlIDObjForm extends PostObj
{
    /** Set type String delete/put 使用url ID/value */
    InputUrlIDForString:(valID:string)=>urlIDObjForm,
    /** Set type number delete/put 使用url ID/value*/
    InputUrlIDForNumber:(valID:number)=>urlIDObjForm
}


/**
 * Delete/PUT/POST Json Body
 * @param url Api 路經
*/
type goApiJsonToUrlIDForm = (url:string)=>urlIDObjForm;

/** upload file ajax */
export default interface ajaxUploadFile
{
    /** remove upload file */
    Delete:goApiJsonToUrlIDForm,

    /**
     * ajax upload file
     */
    Put:goApiJsonToUrlIDForm,

    /** Method Post */
    Post:goApiJsonToUrlIDForm,
}