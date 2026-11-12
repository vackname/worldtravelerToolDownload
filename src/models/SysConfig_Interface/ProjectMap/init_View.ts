export default class init
{
 /** Project[init]->Temp[temp/index/AuthorAnimate] */
 temp_index_AuthorAnimate:string='init@temp/index/AuthorAnimate';
 /**  頁尾 (文字在 temp/translation/<tw|en>/start.json 的 foot)  */
 temp_index_foot:string='init@temp/index/foot';
 /**  導覽列：標誌、區塊連結、語系切換 (中文 / English)  */
 temp_index_head:string='init@temp/index/head';
 /** 
 * 首頁 (ViewModel)：只放畫面事件與樣板掛載；資料在 controllers/index.ts，商業邏輯在 model/indexTsc。
 * 文字在 temp/translation/<tw|en>/start.json (<json map> 載入)。
  */
 view_index:string='init@view/index';
}
