/** 
 sample enum
 */
export enum Enum_EnumSample
{
 /** 
 未發佈 */
 publsh=0,

 /** 
 第二樣本 */
 sec=1,


}

/** 
 sample enum
 */
export const Enum_view_EnumSample = (key:string)=>
{

  switch(key){
   case "publsh":
    return "['未發佈','未发布','not of publish','未発表']";

   case "sec":
    return "['秒','sec','sec','sec']";


  }
  return 'null'
}


