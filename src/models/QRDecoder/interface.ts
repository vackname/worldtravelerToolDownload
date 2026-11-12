

interface reFunction{
  /** get image */
  decodeFromImage:(img:HTMLElement,fun:(er:boolean,result:string)=>void,catchOkCloseEvent:boolean)=>void,
  /** get video */
  decodeFromVideo:(img:HTMLElement,fun:(er:boolean,result:string)=>void,catchOkCloseEvent:boolean)=>void,
  /** get Camera */
  decodeFromCamera:(img:HTMLElement,fun:(er:boolean,result:string)=>void,catchOkCloseEvent:boolean)=>void
}

/** QRCode Decorder
 */
export interface QCodeDecoder
{
  ():reFunction
}