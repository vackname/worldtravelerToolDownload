interface ModelLoadFun<T>
{
    /** 注冊載入物件 */
    (ModelObject:T):any
}

interface ModelLoad<T>
{
    /** create model json 物件 */
    CreateJson:(ModelObject:ModelLoadFun<T>)=>T
}

/** 選用Map 物件 */
type MapObj<T> = (map:T)=>Array<any> | any

interface addModelMap<T>
{
    /** 注冊 model map */
    toMap:(Map:MapObj<T>)=>ModelLoad<T>
}

/** 離散式 model 載入 */
export default interface discreteModelLoad
{
    /**
     * @param JoinModel 專案Model 放置 path
     */
    <T>(JoinModel:T):addModelMap<T>
}
