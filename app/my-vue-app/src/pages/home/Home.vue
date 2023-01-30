<script lang="ts" setup>

// 引入 mockjs
// import "@/mock"; // 局部引入mock服务器

// 布局组件
import Layout from "@/layout/Layout.vue";
import Slider from "@/components/Slider.vue";
import NavHeader from "@/components/NavHeader.vue";
import HomeHeaderContainer from "@/pages/home/graph-container/HomeHeaderContainer.vue";
import HomeMiddleContainer from "@/pages/home/home-middle-container/HomeMiddleContainer.vue";
import HomeFooterContainer from "@/pages/home/home-footer-container/HomeFooterContainer.vue";
import {ROUTERS} from "@/config";

const {HOME} = ROUTERS;
</script>

<template>
  <Layout>
    <template v-slot:slider>
<!--      @ts-ignore-->
      <Slider :page="HOME"/>
    </template>
    <template v-slot:header>
      <NavHeader>
        <template v-slot:title>
          <div class="title">首页</div>
        </template>
      </NavHeader>
    </template>
    <template v-slot:content>
      <HomeHeaderContainer/>
      <div class="gap"></div>
      <HomeMiddleContainer/>
      <div class="gap"></div>
      <HomeFooterContainer/>
    </template>
  </Layout>
</template>


<style scoped lang="scss">
.gap {
  margin-top: 20px;
}
</style>
