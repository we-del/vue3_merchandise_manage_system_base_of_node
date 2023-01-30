<script lang="ts" setup>
import {reactive, onMounted, toRefs} from "vue";

// 引入Echarts模块收集器函数
import {use} from "echarts/core";
// 引入canvas面板
import {CanvasRenderer} from "echarts/renderers";
// 引入Radar图模型
import {RadarChart} from "echarts/charts";
// 引入需要用到的配置项组件
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from "echarts/components";
// 引入VChart模块收集容器
import VChart from "vue-echarts";
import theme from "./infographic.project";

use([
  CanvasRenderer,
  RadarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
]);
console.log(theme);
const data1 = reactive([4200, 3000, 20000, 35000, 50000, 18000]);
const data2 = reactive([5000, 14000, 28000, 26000, 42000, 21000]);
const boundary = [6500, 16000, 30000, 38000, 52000, 25000];
const option = reactive({
  title: {
    text: 'Basic Radar Chart'
  },
  legend: {
    data: ['Allocated Budget', 'Actual Spending']
  },
  radar: {
    // shape: 'circle',
    indicator: [
      {name: 'Sales', max: boundary[0]},
      {name: 'Administration', max: boundary[1]},
      {name: 'Information Technology', max: boundary[2]},
      {name: 'Customer Support', max: boundary[3]},
      {name: 'Development', max: boundary[4]},
      {name: 'Marketing', max: boundary[5]}
    ]
  },
  series: [
    {
      name: 'Budget vs spending',
      type: 'radar',
      data: [
        {
          value: data1,
          name: 'Allocated Budget'
        },
        {
          value: data2,
          name: 'Actual Spending'
        }
      ]
    }
  ]
});
type n = number;
let num: n = 1;
console.log(typeof num);
// onMounted(() => {
//   console.log("timer");
//   setInterval(() => {
//     const BASE_NUMBER = 30;
//     const RANGE = 100;
//     for (let i = 0; i < data1.length; i++) {
//       if (data1[i] < boundary[i]) {
//         data1[i] += Math.floor(Math.random() * RANGE) + BASE_NUMBER;
//
//       } else {
//         data1[i] -= Math.floor(Math.random() * RANGE) + BASE_NUMBER;
//       }
//       if (data2[i] < boundary[i]) {
//         data2[i] += Math.floor(Math.random() * RANGE) + BASE_NUMBER;
//
//       } else {
//         data2[i] -= Math.floor(Math.random() * RANGE) + BASE_NUMBER;
//       }
//     }
//   }, 100);
// })
</script>

<template>
  <!--   传入option配置项-->
  <VChart :option="option" class="radar" :theme="theme"/>
</template>


<style scoped lang="scss">
//给canvas设置高度用于面板显示
.radar {
  height: 400px;
}
</style>
