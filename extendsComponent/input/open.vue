<!-- 自定義框架 使用 path input/open ex: <input-open v-bind:anwA='anwA' /> -->
<template>
<div id="pubExtendsComponent">
    <input type="text" v-model="anwA" />{{anwA}}
</div>
</template>
<style lang="scss">
#pubExtendsComponent
{
    input
    {
        width:100px;
    }
}
</style>
<script lang="ts">
import {PublicComponentInterface} from "../../src/models/vueSDK";
import getVueTemp from "./open_VueTemp";// 樣版 this interface

/** 自定義擴充組件 */
export default  {
    props:{
        anwA:
        {
            type:String,
            default:"null",
            required:true,
        }
    },
    action:($t)=>
    {
        return {

        };
    }
} as PublicComponentInterface<getVueTemp>;
</script>