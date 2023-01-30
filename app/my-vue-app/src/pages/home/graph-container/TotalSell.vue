<script lang="ts" setup>
import {reactive, computed} from "vue";
import DetailCollect from "@/pages/home/graph-container/DetailCollect.vue";
// import {getSellReq} from "@/api/home";
import {getDaySellReq} from "@/api/charts";

const showData = reactive<any>({});
getDaySellReq().then(res => {
  console.log(res);
  const {data} = res;
  if (data.status === 0) {
    Object.keys(data.data).forEach(key => {
      showData[key] = data.data[key];
    })
  }
});
// 获得dataLen的长度，在使用代理改变源数据后，页面会进行重绘，所有代理(ref,Proxy,computed)会重新调用get,获取最新的数据，
// 并进行前后虚拟dom数对比渲染有差异的部分，如前后不同的key重新获得三方资源，前后不一致的响应数据重新进行渲染，非响应式数据，
// 只会显示初始值，往后其的值在改变，也不会进行显示
const dataLen = computed(() => {
  return Object.keys(showData).length;
})
</script>

<template>

  <DetailCollect :isLoadingDone="!(dataLen > 0)">
    <template v-slot:title>
      <div class="title">总销售额</div>
      <div class="icon-info">
        <i>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-info"></use>
          </svg>
        </i>
      </div>
    </template>
    <template v-slot:content>
      <h3>￥ {{ showData.salesTotal }}</h3>
      <h5>
        周同比 {{ showData.salesGrowthLastMonth }}%
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-ascending"></use>
        </svg>

        日同比 {{Math.abs( showData.salesGrowthLastDay )}}%
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-descending"></use>
        </svg>
      </h5>
    </template>
    <template v-slot:footer>
      <div>日销售额￥{{ showData.salesToday }}</div>
    </template>
  </DetailCollect>
</template>


<style scoped lang="scss">

</style>
