<script lang="ts" setup>
import {reactive,provide} from "vue";
import {use, registerMap} from "echarts/core";
import {GeoComponent} from "echarts/components";
import {MapChart,EffectScatterChart,ScatterChart} from "echarts/charts"
import {CanvasRenderer} from "echarts/renderers";
import VChart,{THEME_KEY} from "vue-echarts";
import mapData from "./chinaMap";

use([MapChart, CanvasRenderer, GeoComponent,EffectScatterChart,ScatterChart]);
//@ts-ignore
registerMap("chinaMap", mapData); // 此行代码运行正确但ts报错
const option = reactive({
  geo: {//地理坐标系组件。地理坐标系组件用于地图的绘制
    type: "map",
    map: "chinaMap",//使用 registerMap 注册的地图名称
    //  默认设置完地图是固定死的不能拖动
    roam: true,//否开启鼠标缩放和平移漫游。默认不开启。
    zoom: 1,//当前视角的缩放比例。越大比例越大
    center: [108.956239, 34.268309],//当前视角的中心点，用经纬度表示108.956239,34.268309
    label: {//地图上显示文字提示信息
      show: true,
      color: "#ff6600",
      fontSize: 10//字体大小
    },
    itemStyle: {//地图区域的多边形 图形样式。
      areaColor: "#ace"//地图区域的颜色。
    }
  }, series: [
    {
      type: "effectScatter", //带有涟漪特效动画的散点（气泡）图。利用动画特效可以将某些想要突出的数据进行视觉突出。
      coordinateSystem: "geo", //使用什么坐标系geo使用地理坐标系
      data: [
        {
          value: [108.956239, 34.268309],
        },
      ],
      // 这个时候地图上就会有点的涟漪效果
      rippleEffect: {
        //涟漪特效相关配置。
        number: 2, //波纹的数量。
        scale: 4, //动画中波纹的最大缩放比例
      },
      //  label:{
      //    show:true
      //  },
      itemStyle: {
        color: "red",
      },
    },
    // 也可以绘制点效果
    {
      symbolSize: 20,
      data: [
        {
          name: "北京市", // 数据项名称，在这里指地区名称
          value: [
            // 数据项值
            116.46, // 地理坐标，经度
            39.92, // 地理坐标，纬度
            340, // 北京地区的数值
          ],
        },
      ],
      type: "scatter",
      coordinateSystem: "geo",//// series坐标系类型
    },
  ],
});
provide(THEME_KEY,"dark");
function a(params:any){
  console.log(params);
}
</script>

<template>
  <VChart :option="option" class="china-graph" @click="a"/>
</template>


<style scoped lang="scss">
.china-graph {
  height: 600px;
}
</style>
