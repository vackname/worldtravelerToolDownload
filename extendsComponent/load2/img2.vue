<!-- 自定義框架 使用 path input/open ex: <input-open v-bind:anwA='anwA' /> -->
<template>
<span><img id="onlyTest2" v-loadimg="use()" /></span>
</template>
<style lang="scss">
#onlyTest2
{
    border: 1px solid #FF8800;
}
</style>
<script lang="ts">
import {PublicComponentInterface} from "../../src/models/vueSDK";
import getVueTemp from "./img2_VueTemp";// 樣版 this interface

/** 自定義擴充組件 */
export default {
    props:["src","source","show"],
    action:($t)=>
    {
        console.log("img2-------");
        console.log($t);
        return {
            use:()=>
            {
                return {'source':$t.source,'src':$t.src,'show':$t.show};
            }
        }
    }
} as PublicComponentInterface<getVueTemp>;
</script>