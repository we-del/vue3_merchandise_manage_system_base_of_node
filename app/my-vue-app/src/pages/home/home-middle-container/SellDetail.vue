<script lang="ts" setup>
import {reactive, onMounted} from "vue";
import GraphDetail from "@/pages/home/home-middle-container/GraphDetail.vue";
// import {getSellYearAxisReq, getSellYearDataReq, getSellRankReq} from "@/api/home";
import {getSellYearAxisReq, getSellYearReq, getSellRankReq} from "@/api/charts";
import {RankData} from "@/interface";

const axisShow = reactive<number[]>([]);
const data = reactive<number[]>([]);
const rankData = reactive<RankData[]>([]);
onMounted(async () => {
  // 获得sellYear数据
  const res1 = await getSellYearReq();
  // 获得sellYearAxis
  const res2 = await getSellYearAxisReq();
  // 获得SellRank数据
  const res3 = await getSellRankReq();
  if (res1.data.status === 0) {
    res1.data.data.forEach((val: number) => data.push(val));
  }
  if (res2.data.status === 0) {
    res2.data.data.forEach((val: number) => axisShow.push(val));
  }
  if (res3.data.status === 0) {
    res3.data.data.forEach((val: RankData) => rankData.push(val));
  }
  console.log(res1, res2);

  // 处理图片过渡
  // setTimeout(() => {
  //   isLoading.value = false;
  // }, (Math.floor(Math.random() * 300)) + 300)
});
// 图标配置项
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
      axisTick: {
        alignWithLabel: true
      }
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: [
    {
      name: '销售量',
      type: 'bar',
      barWidth: '60%',
      data,
      itemStyle:{
        color:"#f59f77"
      }
    }
  ]


});
const colorRank = ['#f8d657', '#d7d7d7', '#eec8b5'];
</script>
<template>
  <GraphDetail :option="option">
    <template #title="a">
      <h3>销售额</h3>
    </template>
    <template #rank-title>
      <h3>门店销售额排名</h3>
    </template>
    <template #rank>
      <div id="rank-region">
        <div id="rank-wrapper" v-for="(shop,i) in rankData" :style="i < 3 ? {color:colorRank[i]}:''">
          <div class="shop-rank">{{ shop.no }}</div>
          <div class="shop-name">{{ shop.name }}</div>
          <div class="shop-sell">{{ shop.money }}</div>
        </div>
      </div>
    </template>
  </GraphDetail>
</template>


<style scoped lang="scss">
#rank-region {
  display: flex;
  flex-flow: column nowrap;
  height: 100%;
  overflow: auto;

  #rank-wrapper {
    display: flex;
    margin-top: 5px;

    .shop-rank {
      flex: 1;
      margin-left: 10px;
    }

    .shop-name {
      flex: 3;
    }

    .shop-sell {
      flex: 1;
    }
  }
}
</style>
