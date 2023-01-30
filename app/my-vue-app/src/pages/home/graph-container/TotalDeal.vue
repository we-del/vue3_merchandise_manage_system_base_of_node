<script lang="ts" setup>
import {reactive, computed,ref} from "vue";
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
import {getPayNumberReq} from "@/api/charts";
use([CanvasRenderer, BarChart,
  TooltipComponent,
  GridComponent]);


const showData = reactive<any>({});
const data = reactive<number[]>([]);
getPayNumberReq().then(res => {
  if (res.data.status === 0) {
    Object.keys(res.data.data).forEach(key => {
      showData[key] = res.data.data[key];
    })

    showData.payTrend.forEach((n: number) => data[data.length] = n);
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
    formatter: ' {c}',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    left: "5%",
    top: "5%",
    right: "5%",
    bottom: "5%",
  },
  xAxis: {
    show: false,
    type: 'category',
    boundaryGap: false,
    data
  },
  yAxis: {
    show: false,
    type: 'value'
  },
  series: [
    {
      data,
      type: 'bar',
      showBackground: true,
      backgroundStyle: {
        color: 'rgba(180, 180, 180, 0.2)'
      },
      // colorBy:'data',
      itemStyle:{
        color:"pink"
      }
    },

  ]

});
const eCharts = ref();
console.log("eCharts=",eCharts);
</script>

<template>
  <DetailCollect :is-loading-done="!(dataLen > 0)">
    <template v-slot:title>
      <div class="title">支付比数</div>
      <div class="icon-info">
        <i>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-info"></use>
          </svg>
        </i>
      </div>
    </template>
    <template v-slot:content>
      <h3> {{ showData.payTotal }}</h3>
      <!--      Echart一定要给宽高，因为其依赖宽高样式进行显示-->
      <EChart :option="option" :style="{height:'50%'}" :autoresize="true" ref="eCharts"/>
    </template>
    <template v-slot:footer>
      <div>转换率 {{ showData.payRate }}%</div>
    </template>
  </DetailCollect>
</template>


<style scoped lang="scss">

</style>
