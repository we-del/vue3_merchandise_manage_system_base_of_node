<script lang="ts" setup>
import {reactive, onMounted,ref} from "vue";
import EChart from "vue-echarts";
import {use} from "echarts/core";
import {CanvasRenderer} from "echarts/renderers";
import {BarChart} from "echarts/charts";
import {TooltipComponent, GridComponent} from "echarts/components";

// import {getSearchWorkReq} from "@/api/home";
import {getSearchWordReq} from "@/api/charts";
import {SearchWordData} from "@/interface";

use([CanvasRenderer, BarChart, TooltipComponent, GridComponent]);

const axisShow = reactive<string[]>([]);
const searchData = reactive<number[]>([]);
const userData = reactive<number[]>([]);
const option = reactive({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    left: '10%',
    right: '10%',
    bottom: '10%',
    top: '10%'
  },
  xAxis: [
    {
      type: 'category',
      data: axisShow,
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: [
    {
      name: '搜索量',
      type: 'bar',
      data: searchData,
      colorBy: 'data',
    },
    {
      name: '用户量',
      type: 'bar',
      data: userData,
      colorBy: 'data',
    }
  ]
});
onMounted(async () => {
  const res = await getSearchWordReq();
  if (res.data.status === 0) {
    console.log(res);
    res.data.data.forEach((obj: SearchWordData) => {
      axisShow.push(obj.word);
      userData.push(obj.user);
      searchData.push(obj.count);
    })
  }
})
const eChartsRef = ref();
console.log("eChartsRef",eChartsRef);
</script>

<template>
  <div id="wrapper">

    <h3>线上热门搜索</h3>
    <EChart :option="option" :style="{height:'200px'}" ref="eChartsRef"/>
  </div>
</template>


<style scoped lang="scss">
#wrapper {
  height: 100%;
  padding: 10px;
  background-color: white;

}
</style>
