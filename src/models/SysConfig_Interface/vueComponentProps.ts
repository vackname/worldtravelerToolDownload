/** 預設值程序設定設定 */
interface defaultColum
{
    <T>():T
}

/** 欄位 驗證型態 */
interface PropsColum
{
    /** 參數容許 型態 */
    type: Object | String | Number | Boolean | (StringConstructor|NumberConstructor|BooleanConstructor|ObjectConstructor)[],
    /** 預設參數設定 value | function 運算*/
    default?: any | defaultColum,
    /** 傳入參數必為 指定 type, default=false=不啟用  */
    required?: boolean,
    /** 驗證參數 */
    validator?:<T>(value:T)=>boolean
}

/** props 承接參數 typeof */
export type propsTypeObj = PropsColum | Object | String | Number | Boolean | (StringConstructor|NumberConstructor|BooleanConstructor|ObjectConstructor)[];
/** props 承接參數(序列或自己本身type) */
export interface PropsObj
{
    [name:string]:propsTypeObj
}