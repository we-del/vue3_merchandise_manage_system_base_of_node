<script lang="ts" setup>

// 三方库
import {ref, onMounted, reactive, provide} from "vue";
import {useRouter, useRoute} from "vue-router";
import {ElMessage, ElMessageBox} from 'element-plus';
import Dayjs from "dayjs";

// 布局组件
import Layout from "@/layout/Layout.vue";
import Slider from "@/components/Slider.vue";
import NavHeader from "@/components/NavHeader.vue";

import {
  ArrowLeft
} from '@element-plus/icons-vue'

// 配置项
import {ROUTERS, BASE_URL} from "@/config";
import {getSingleMerchandiseReq} from "@/api/merchandise";
import {getSingleCategoryReq} from "@/api/category";
// import {PAGE_SIZE} from "@/config";


const {ITEM_MANAGE, MERCHANDISE_MANAGE} = ROUTERS;

const serverData = reactive<any>({});

const merchandiseMessage = reactive<any>({});


const {go} = useRouter();
const {params} = useRoute();
onMounted(async () => {
  const res = await getSingleMerchandiseReq(params as { productId: string });
  if (res.data.status === 0) {
    console.log(res);
    const distData = res.data.data;
    Object.keys(distData).forEach((key: string) => serverData[key] = distData[key]);
    Object.keys(serverData).forEach((key: string) => merchandiseMessage[key] = serverData[key]);
    const categoryId = serverData.categoryId;
    const res1 = await getSingleCategoryReq({categoryId});
    if (res1.data.status === 0) {
      merchandiseMessage.categoryName = res1.data.data.name;
    }
  }
});
</script>

<template>
  <Layout>
    <template #slider>
      <Slider :page="MERCHANDISE_MANAGE" :default-spread="[ITEM_MANAGE]"/>
    </template>
    <template #header>
      <NavHeader>
        <template #title>
          <div class="title">商品管理</div>
        </template>
      </NavHeader>
    </template>
    <template #content>
      <el-card class="box-card" ref="card">
        <template #header>
          <div class="card-header">
            <el-button type="primary" link @click="go(-1)" :icon="ArrowLeft">
              返回
            </el-button>
            <div :style="{marginLeft:'10px',fontSize:'20px'}">商品详情</div>
          </div>
        </template>
        <div class="merchandise-row">
          <h2>商品名称：</h2>
          <span>{{ merchandiseMessage.name }}</span>
        </div>
        <div class="merchandise-row">
          <h2>商品描述：</h2>
          <span>{{ merchandiseMessage.desc }}</span>
        </div>
        <div class="merchandise-row">
          <h2>商品价格：</h2>
          <span>￥ {{ merchandiseMessage.price }}</span>
        </div>
        <div class="merchandise-row">
          <h2>商品分类：</h2>
          <span>{{ merchandiseMessage.categoryName }}</span>
        </div>
        <div class="merchandise-row">
          <h2>商品图片：</h2>
          <span>
            <el-image :preview-src-list="[BASE_URL+'/upload/'+img]" lazy :src="BASE_URL+'/upload/'+img"
                      alt="merchandise" :style="{height:'100px'}"
                      v-for=" img in merchandiseMessage.imgs"/>
          </span>
        </div>
        <div class="merchandise-row">
          <h2>商品详情：</h2>
          <!--          vue展示字符串的html-->
          <span v-html="merchandiseMessage.detail"></span>
        </div>
      </el-card>


    </template>
  </Layout>
</template>


<style scoped lang="scss">
.card-header {
  display: flex;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {

  width: 100%;
  height: 100%;
}

.pagination {
  margin: 40px 0 0 30%;
}

#search-region {
  display: flex;
}

.merchandise-row {
  display: flex;
  align-items: center;

}
</style>
