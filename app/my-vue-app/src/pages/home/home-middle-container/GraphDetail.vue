<script lang="ts" setup>
import {nextTick, defineProps, provide, onMounted} from "vue";
import EChart, {INIT_OPTIONS_KEY} from "vue-echarts";
import {use} from "echarts/core";
import {CanvasRenderer} from "echarts/renderers";
// 引入Radar图模型
import {BarChart} from "echarts/charts";
// 引入需要用到的配置项组件
import {
  TooltipComponent,
  GridComponent
} from "echarts/components";

use([CanvasRenderer, BarChart,
  TooltipComponent,
  GridComponent]);
console.log("echarts", EChart);
defineProps<{ option: any }>();
</script>

<template>
  <div id="detail-wrapper">
    <div class="graph-show-region">
      <slot name="title" >
        <h2>title</h2>
      </slot>

      <EChart class="e-charts" :option="option" :autoresize="true"/>
    </div>
    <div class="rank-show-region">
      <slot name="rank-title">
        <h2>rank-title</h2>
      </slot>
      <slot name="rank">
        <div> 1 name ticket</div>
      </slot>
    </div>
  </div>

</template>


<style scoped lang="scss">
#detail-wrapper {
  display: flex;

  .graph-show-region {
    flex: 3;

    .e-charts {
      height: 170px;
      width: 100%;
    }
  }

  .rank-show-region {
    flex: 1;
  }
}
</style>
