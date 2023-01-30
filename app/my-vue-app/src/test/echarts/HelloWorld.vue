<!--<template>-->
<!--  <v-chart class="chart" :option="option"/>-->
<!--</template>-->
<!--<script>-->

<!--import {use} from "echarts/core";-->
<!--import {CanvasRenderer} from "echarts/renderers";-->
<!--import {PieChart, LineChart, BarChart} from "echarts/charts";-->
<!--import {-->
<!--  TitleComponent,-->
<!--  TooltipComponent,-->
<!--  LegendComponent,-->
<!--  GridComponent,-->

<!--} from "echarts/components";-->
<!--import VChart, {THEME_KEY} from "vue-echarts";-->
<!--import {ref, defineComponent} from "vue";-->

<!--use([-->
<!--  CanvasRenderer,-->
<!--  PieChart,-->
<!--  TitleComponent,-->
<!--  TooltipComponent,-->
<!--  LegendComponent,-->
<!--  LineChart,-->
<!--  GridComponent,-->
<!--  BarChart-->
<!--]);-->

<!--export default defineComponent({-->
<!--  name: "HelloWorld",-->
<!--  components: {-->
<!--    VChart-->
<!--  },-->
<!--  provide: {-->
<!--    [THEME_KEY]: "dark"-->
<!--  },-->
<!--  setup: () => {-->
<!--    const option = ref({-->
<!--      xAxis: {-->
<!--        show:false,-->
<!--        type: 'category',-->
<!--        boundaryGap: false,-->
<!--        // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']-->
<!--      },-->
<!--      yAxis: {-->

<!--        show:false,-->
<!--        type: 'value'-->
<!--      },-->
<!--      tooltip:{},-->
<!--      series: [-->
<!--        {-->
<!--          data: [820, 932, 901, 934, 1290, 1330, 1320],-->
<!--          type: 'line',-->
<!--          areaStyle: {}-->
<!--        }-->
<!--      ]-->

<!--    });-->

<!--    return {option};-->
<!--  }-->
<!--});-->
<!--</script>-->

<!--<style scoped>-->
<!--.chart {-->
<!--  height: 400px;-->
<!--}-->
<!--</style>-->