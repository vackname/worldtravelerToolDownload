<!-- 自定義框架 使用 path input/open ex: <input-open v-bind:anwA='anwA' /> -->
<template>
<span><img id="onlyTest" v-loadimg="use()" /><span>{{title}}</span></span>
</template>
<style lang="scss">
#onlyTest
{
    border: 1px solid #FF8800;
    border-radius:5px;
    width:50px;
}
</style>
<script lang="ts">
import {PublicComponentInterface} from "../../src/models/vueSDK";
import getVueTemp from "./img2_VueTemp";// 樣版 this interface

/** 自定義擴充組件 */
export default {
    props:{
        title:{
            type:String,
            default:"我是自定義組件"
        },
        src:String,
        source:Object,
        show:{
            type:Boolean,
            default:true
        }
    },
    action:($t)=>
    {
        return {
            use:()=>
            {
                return {'source':$t.source,'src':$t.src,'show':$t.show};
            }
        }
    }
} as PublicComponentInterface<getVueTemp>;
</script>