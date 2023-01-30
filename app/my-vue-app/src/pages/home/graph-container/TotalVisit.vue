<script lang="ts" setup>
import {reactive, computed} from "vue";
import DetailCollect from "@/pages/home/graph-container/DetailCollect.vue";
// import {getVisitReq} from "@/api/home";
import {getDayVisitReq} from "@/api/charts";
import EChart from "vue-echarts";
import {use} from "echarts/core";
import {CanvasRenderer} from "echarts/renderers";
// 引入Radar图模型
import {LineChart} from "echarts/charts";
// 引入需要用到的配置项组件
import {
  TooltipComponent,
  GridComponent
} from "echarts/components";

use([CanvasRenderer, LineChart,
  TooltipComponent,
  GridComponent]);

const showData = reactive<any>({});
const data = reactive<number[]>([]);
getDayVisitReq().then(res => {
  if (res.data.status === 0) {
    Object.keys(res.data.data).forEach(key => {
      showData[key] = res.data.data[key];
    })
    showData.visitTrend.forEach((n: number) => data[data.length] = n);
  }
  console.log(data);
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
    formatter: ' {c}'
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
      type: 'line',
      areaStyle: {},
      itemStyle:{
        color:"#ace"
      },
      smooth:true
    },
  ]

});
</script>

<template>
  <DetailCollect :isLoadingDone="!(dataLen > 0)">
    <template v-slot:title>
      <div class="title">访问量</div>
      <div class="icon-info">
        <i>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-info"></use>
          </svg>
        </i>
      </div>
    </template>
    <template v-slot:content>
      <h3> {{ showData.visitTotal }}</h3>
      <!--      Echart一定要给宽高，因为其依赖宽高样式进行显示-->
      <EChart :option="option" :autoresize="true" :style="{height:'50%'}"/>
    </template>
    <template v-slot:footer>
      <div>日访问量{{ showData.visitToday }}</div>
    </template>
  </DetailCollect>
</template>


<style scoped lang="scss">

</style>
