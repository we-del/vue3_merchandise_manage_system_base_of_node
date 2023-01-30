<script lang="ts" setup>
import {reactive, computed, ref} from "vue";
import EChart from "vue-echarts";
import {use} from "echarts/core";
import {CanvasRenderer} from "echarts/renderers";
// 引入Radar图模型
import {BarChart} from "echarts/charts";
// 引入需要用到的配置项组件
import {
  TooltipComponent,
  GridComponent
} from "echarts/components";



import DetailCollect from "@/pages/home/graph-container/DetailCollect.vue";
// import {getActivityReq} from "@/api/home";
import {getActivityReq} from "@/api/charts";

use([CanvasRenderer, BarChart,
  TooltipComponent,
  GridComponent]);


const showData = reactive<any>({});
const data = reactive<any[]>([
  {
    value: 100,
    itemStyle: {
      normal: {
        color: '#fff'
      }
    },
    tooltip:{
      formatter:"aaa"
    }
  }
]);
getActivityReq().then(res => {
  if (res.data.status === 0) {
    Object.keys(res.data.data).forEach(key => {
      showData[key] = res.data.data[key];
    })
    data[data.length] = showData.activityRate;
  }
});
// 获得dataLen的长度，在使用代理改变源数据后，页面会进行重绘，所有代理(ref,Proxy,computed)会重新调用get,获取最新的数据，
// 并进行前后虚拟dom数对比渲染有差异的部分，如前后不同的key重新获得三方资源，前后不一致的响应数据重新进行渲染，非响应式数据，
// 只会显示初始值，往后其的值在改变，也不会进行显示
const dataLen = computed(() => {
  return Object.keys(showData).length;
})

const option = reactive({
  tooltip: {
    trigger: 'axis',
    formatter(curData:any[]){
      if(curData[0].value === 100){
        return "";
      }
      return  `${curData[0].value}`;
    },
  },
  grid: {
    left: "5%",
    top: "5%",
    right: "5%",
    bottom: "5%",
  },
  xAxis: {
    show: false,
    type: 'value',
  },
  yAxis: {
    show: false,
    type: 'category',
    data: ['1', '2']
  },
  series: [
    {
      data ,
      type: 'bar',
    },
  ]

});
</script>

<template>
  <DetailCollect :is-loading-done="!(dataLen > 0)">
    <template v-slot:title>
      <div class="title">运营活动效果</div>
      <div class="icon-info">
        <i>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-info"></use>
          </svg>
        </i>
      </div>
    </template>
    <template v-slot:content>
      <h3> {{ showData.activityRate }}%</h3>
      <!--      Echart一定要给宽高，因为其依赖宽高样式进行显示-->
      <EChart :option="option" :autoresize="true" :style="{height:'50%'}"/>
    </template>
    <template v-slot:footer>
      <div>
        周同比 {{ showData.activityGrowthLastMonth }} %
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-ascending"></use>
        </svg>
        日同比{{ Math.abs(showData.activityGrowthLastDay) }}%
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-descending"></use>
        </svg>
      </div>
    </template>
  </DetailCollect>
</template>


<style scoped lang="scss">

</style>
