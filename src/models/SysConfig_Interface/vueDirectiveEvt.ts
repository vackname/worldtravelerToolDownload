import {elOnly} from "./animate";
/** 綁定參數 format */
interface binding<T>
{
    /** 指令名，不包括 前綴  ex v-test:hello='runFunction()'  參數='test'*/
    name:string,
    /** 指令綁定 value/function ex v-test:hello='runFunction()' 參數取得運算=runFunction()*/
    value:T,
    /** 綁定值 表達式或變量名 ex v-test='runFunction()' 參數='runFunction'*/
    expression:string,
    /** 綁定指令參數 ex v-test:hello='runFunction()' 參數='hello=' */
    arg:string
    /** 取修飾詞  ex v-test:hello.foo.bar='runFunction()' 參數 json={ foo: true, bar: true } */
    modifiers:any
}


/** 綁定參數 format */
interface binding_update_componentUpdated<T> extends binding<T>
{
    /** 指令改綁前參數 */
    oldValue:T
}

/** 調用 function */
interface vueDirectFun<T>
{

    /**
     * 調用 function
     * @param el html element
     * @param binding 綁定參數詳細資訊
     * @param vnode 編緝生成虛擬節點
    */
    (el:elOnly, binding?:binding<T>, vnode?:Array<string>):void
}

/** 調用 function */
interface vueDirectFun_update_componentUpdated<T>
{

    /**
     * 調用 function
     * @param el html element
     * @param binding 綁定參數詳細資訊
     * @param vnode 編緝生成虛擬節點
     * @param oldVnode 上一個虛擬節點
    */
    (el:elOnly, binding?:binding_update_componentUpdated<T>, vnode?:Array<string>,oldVnode?:Array<string>):void
}

/** 生命周期起用時機 */
interface addDevfun_ary
{
    /** 生命啟用周期 */
    evt:string,
    /** 執行指令 function */
    fun:vueDirectFun_update_componentUpdated<any> |  vueDirectFun<any>
}

/** 建置 自定義function */
interface addDvFun_format
{
    (command:string,ary:Array<addDevfun_ary>):void
}

/** add 自定義 function */
var addDvFun:addDvFun_format = eval("psylAddVueD");

interface getVueDvObject
{
    /** 指令命名 */
    command:string,
    /** 事件程序 */
    ary:Array<addDevfun_ary>
}

/** 當前註冊 指令 */
var getVueDAry:Array<getVueDvObject> = eval("getVueDirectiveAry");

/** 指令事件 */
interface addDvEvtFun
{
    /**
     * 事件程序
    */
    (evt:vueDirLi):addDevfun_ary
}

/** create 事件 */
class vueDirLi
{
    /** 只調用一次，指令第一次綁定到元素時調用，啟用函數可以定義一個在綁定時執行一次初始化 ex v-foot:aa.dd.cc='okFunction()'
     * @param fun 調用 function
     */
    bind = <T>(fun:vueDirectFun<T>)=>
    {
        return {
            evt:'bind',
            fun:fun
        } as addDevfun_ary;
    }

    /** 初始綁定元素插入父節點調用 (注入於元素 ex: v-foucs)
     * @param fun 調用 function
     */
    inserted = <T>(fun?:vueDirectFun<T>)=>
    {
        return {
            evt:'inserted',
            fun:((fun!=null && fun!=undefined)?fun:function(){ })
        } as addDevfun_ary;
    }

    /** 被綁定元素所在的模板更新時調用 (可以忽略不必要的模板更新) ex v-foot:aa.dd.cc='okFunction()'
     * @param fun 調用 function
     */
    update = <T>(fun:vueDirectFun_update_componentUpdated<T>)=>
    {
        return {
            evt:'update',
            fun:fun
        } as addDevfun_ary;
    }

    /** 被綁定元素所在模版完成一次更新周期調用 ex v-foot:aa.dd.cc='okFunction()'
     * @param fun 調用 function
     */
    componentUpdated = <T>(fun:vueDirectFun_update_componentUpdated<T>)=>
    {
        return {
            evt:'componentUpdated',
            fun:fun
        } as addDevfun_ary;
    }

    /** 只調用一次，指令與元素解綁時機調用 ex v-foot:aa.dd.cc='okFunction()'
     * @param command 指令名(需為 lowercase)
     * @param fun 調用 function
     */
    unbind = <T>(fun:vueDirectFun<T>)=>
    {
        return {
            evt:'unbind',
            fun:fun
        } as addDevfun_ary;
    }
}

/** 全域式自定義指令 */
export default class vueDirectiveEvt
{
    /** 指令名 */
    private comval:string='';

    /** 運行生命周期 */
    private ary:Array<addDevfun_ary>= [];

    /**
     *  @param command 指令名(需為 lowercase)
     */
    constructor(command:string)
    {
        this.comval = command;
    }

    /** create 事件(每個程序皆為唯一性) */
    add = <T>(fun:addDvEvtFun)=>
    {
        this.ary.push(fun(new vueDirLi()));
        return this;
    }

    /** 注冊 全域設定(default->自動註冊) */
    toRegister=()=>
    {
        /** only 指令測 */
        var commandFlag:boolean = true;
        var vue$t = this;
        getVueDAry.forEach((val,nu)=>{
            if(val.command==vue$t.comval.toLowerCase())
            {
                commandFlag = false;
                console.error("error exist command(Name->"+val.command+")");
            }

            if(commandFlag)
            {//檢測是否有重復crate 運行程序
                /** 偵聽程序是否存在異常建置 */
                var commandFlag_fun:boolean = true;
                /** 執行程序 */
                var funNameAry:Array<string> = [];
                val.ary.forEach((val2,nu2)=>
                {
                    if(funNameAry.indexOf(val2.evt)>-1)
                    {
                        commandFlag_fun=false;
                        console.error("not only for create Function to command(Name->"+val.command+",fun->"+val2.evt+")");
                    }
                    else
                        funNameAry.push(val2.evt);
                });

                if(!commandFlag_fun)
                    commandFlag = false;
            }
        });

        if(commandFlag)
            addDvFun(this.comval.toLowerCase(),this.ary);//注冊
    }
}