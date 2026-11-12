interface TaskAbortAfter
{
    /** 等候時間最大值(強制關閉執行序)
     * @param ms  單位毫秒
     */
    (ms:number):Promise<any>
}

interface anchorValueObj
{
    /** 
     * @param  Value 錨點參數物件
     */
    (Value:any):void
}
interface EventJsonFun<T>
{
    (resolve:TaskContinueWitchFun<T>):TaskFactoryObj|Array<TaskFactoryObj>|void,
}

/** 僅取first */
interface MultipleToFirstEventJsonFun<T>
{
    (resolve:TaskContinueWitchFun<T>):Array<TaskFactoryObj>|void,
}

/** 僅取first json */
interface ContinueMultipleToFirstForWithFunJson<T,T1>
{
    /** 上一個程序運行 成功事件 錨點 */
    SuccessEvent:MultipleToFirstEventJsonFun<T>,
    /** 上一個程序運行 失敗事件 錨點 */
    CatchEvent?:MultipleToFirstEventJsonFun<T1>,
}

/** add 僅取first 新執行序 */
interface TaskultipleToFirstForWith
{
    /** 
     * @param Event 錨點事件通知function
     */
    <T,T1>(Event:ContinueMultipleToFirstForWithFunJson<T,T1>):TaskFactoryObj
}

interface ContinueCatchEventFunJson<T,T1>
{
    /** 上一個程序運行 成功事件 錨點 */
    SuccessEvent:EventJsonFun<T>,
    /** 上一個程序運行 失敗事件 錨點 */
    CatchEvent?:EventJsonFun<T1>,
}

interface StartNewhObj
{
    /** 
     * @param  錨點事件通知function
     */
    (Fun:TaskEvent):void
}

/** add 新執行序 事件 */
interface TaskEvent
{
    /** 執行失敗 通知錨點 */
    reject:anchorValueObj,
    /** 執行完成 通知錨點 */
    resolve:anchorValueObj,
}

/** add 新執行序 */
interface TaskContinueWitchFun<T> extends TaskEvent
{
    /** 上一個執行 錨點 運行參數 */
    ObjectVal:T
}

/** add 新執行序 StartNew */
interface TaskStartNew
{
    /** 
     * @param  錨點事件通知function
     */
    (Fun:StartNewhObj):TaskFactoryObj
}

/** add 新執行序 */
interface TaskContinueWitch
{
    /** 
     * @param Event 錨點事件通知function
     */
    <T,T1>(Event:ContinueCatchEventFunJson<T,T1>):TaskFactoryObj
}


/** add Catch 執行序 */
interface TaskCatchFun<T>
{
    /**
     * @param ObjectVal 上一個執行 錨點 運行參數
    */
    (ObjectVal:T):void
}

/** add Catch新執行序 */
interface TaskCatch
{
    <T>(Fun:TaskCatchFun<T>):TaskFinalProcess
}

interface TaskFinalProcess
{
    /** 強制關閉執行序 */
    Abort:()=>Promise<any>,

    /** 等候時間最大值(強制關閉執行序) */
    AbortAfter:TaskAbortAfter,

    /** 執行序 await get Promise object */
    getPromise:()=>Promise<any>,
}

/** 初始化Task */
export interface TaskFactoryObj extends TaskFinalProcess
{
    /** 繼續運行 執行序 */
    ContinueWith:TaskContinueWitch,

    /** 取出 first 繼續往下執行完成 Event事件 Task */
    ContinueMultipleToFirstForWith:TaskultipleToFirstForWith,

    /** public 錯誤時機 或 abort Catch 時機(所有程序最後階段承接錯誤) */
    ContinueCatch:TaskCatch
}

/** multiple Task 事件 */
interface MultipleTaskObj
{
    /**
     * @param Multiple 多個Task
     */
    (Multiple:Array<TaskFactoryObj>):TaskFactoryObj
}

interface NewObj
{
    /** 開始事件 */
    StartNew:TaskStartNew
    /** 取出 first 執行完成 Event事件 Task */
    StartNewMultipleToFirst:MultipleTaskObj
}

/** 注入 Task.Factory */
export interface TaskObj
{
    /** Task 初始化程序 
    */
    Factory:NewObj
}