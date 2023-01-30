<script lang="ts" setup>
import {reactive, onMounted, ref,provide} from "vue";
import EChart,{UPDATE_OPTIONS_KEY} from "vue-echarts";
import {use} from "echarts/core";
import {CanvasRenderer} from "echarts/renderers";
import {BarChart,PieChart} from "echarts/charts";
import {TooltipComponent, GridComponent} from "echarts/components";

// import {getSalaryRankReq} from "@/api/home";
import {getSaleRankReq} from "@/api/charts";
import {SellPercentData} from "@/interface";

use([CanvasRenderer, BarChart, TooltipComponent, PieChart,GridComponent]);

const onlineData = reactive<SellPercentData[]>([]);
const shopData = reactive<SellPercentData[]>([]);
const data = reactive<SellPercentData[]>([]);
const name = ref("线上销售");
const isOnline = ref(true);
let option = reactive({
  tooltip: {
    trigger: 'item',
  },
  grid: {
    left: '10%',
    right: '10%',
    bottom: '10%',
    top: '10%'
  },
  series: [
    {
      // name: isOnline ? '线上销售' : '门店销售',
      // name为一个Ref代理，在使用时和template中用法一致，直接传入即可，底层会使用value属性得到值，且是一个响应式数据，
      // 如果使用 name.value(option自然在script标签内)则读取的是一个常量值
      name,
      type: 'pie',
      radius: ['60%', '90%'],
      emphasis: {
        label: {
          show: true,
          fontSize: '10',
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      // 只有表达式的结果值为一个代理数据时，页面在重绘时才会调用get方法，如果不是则，其在被当作启动值时，已经被消耗
      // data: isOnline ? onlineData : shopData
      data
    }
  ]
});

/**
 @description: 转换图表数据流
 @param flag 用于判断当前点击的是什么tab
 */
const toggleGraph = (flag: boolean) => {
  isOnline.value = flag;


  while (data.length > 0) data.pop(); // 清空data数据
  if (flag) {
    onlineData.forEach((obj: SellPercentData) => data.push(obj));
    name.value = '线上销售';
  } else {
    shopData.forEach((obj: SellPercentData) => data.push(obj));
    name.value = '门店销售';
  }
  console.log(name);

  console.log(option);
  // @ts-ignore
  provide(UPDATE_OPTIONS_KEY,option);
}

onMounted(async () => {
  const res = await getSaleRankReq();
  if (res.data.status === 0) { // 0 表示数据获取成功
    // 将从服务器获取的数据添加到数据源中(因为是代理页面会进行重绘)
    res.data.data.online.name.forEach((val: any) => {
      onlineData.push({name: val});
    })
    res.data.data.online.value.forEach((value: number, index: number) => {
      onlineData[index].value = value;
    })
    res.data.data.shop.name.forEach((val: any) => {
      shopData.push({name: val});
    })
    console.log(res.data.data);
    res.data.data.shop.value.forEach((value: number, index: number) => {
      console.log(index);
      console.log(shopData[index]);
      shopData[index].value = value;
    })

    onlineData.forEach((obj: SellPercentData) => data.push(obj))
  }
})
</script>

<template>
  <div id="wrapper">
    <div class="toggle-region">
      <h3>销售额类别占比</h3>
      <div class="toggle">
        <div :class=" isOnline ? 'selected':''" @click="toggleGraph(true)">线上</div>
        <div :class=" !isOnline ? 'selected':''" @click="toggleGraph(false)">门店</div>
      </div>
    </div>
    <EChart :option="option" :style="{height:'200px',marginTop: '40px'}" :autoresize="true"/>
  </div>
</template>


<style scoped lang="scss">
#wrapper {
  padding: 10px;
  background-color: white;
  .toggle-region {
    margin-top: 20px;
    display: flex;

    h3 {
      flex: 3;
      padding: 0;
      margin: 0;
    }

    .toggle {
      display: flex;
      flex: 1;

      div {
        height: 30px;
        width: 65px;
        border: 1px solid #ccc;
        text-align: center;
        line-height: 30px;

      }
    }
  }
}

.selected {
  background-color: #409eff;
  color: white;
}
</style>
