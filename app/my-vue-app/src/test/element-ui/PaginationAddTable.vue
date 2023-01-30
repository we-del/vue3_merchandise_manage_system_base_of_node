<!--<script lang="ts" setup>-->
<!--import {ref} from "vue";-->
<!--import Layout from "@/layout/Layout.vue";-->
<!--import Slider from "@/components/Slider.vue";-->
<!--import NavHeader from "@/components/NavHeader.vue";-->
<!--import {ROUTERS} from "@/config";-->

<!--const {USER_MANAGE, AUTH_MANAGE} = ROUTERS;-->

<!--const testSizeChange = (n:any)=>{-->
<!--  alert(n);-->
<!--}-->
<!--const testPageChange = (n:any)=>{-->
<!--  alert(n);-->
<!--}-->
<!--</script>-->

<!--<template>-->
<!--  <Layout>-->
<!--    <template #slider>-->
<!--      <Slider :page="USER_MANAGE" :default-spread="[AUTH_MANAGE]"/>-->
<!--    </template>-->
<!--    <template #header>-->
<!--      <NavHeader>-->
<!--        <template #title>-->
<!--          <div class="title">用户管理</div>-->
<!--        </template>-->
<!--      </NavHeader>-->
<!--    </template>-->
<!--    <template #content>-->
<!--      <el-card class="box-card" ref="card">-->
<!--        <template #header>-->
<!--          <div class="card-header">-->
<!--            <el-button class="button" type="primary">添加用户</el-button>-->
<!--          </div>-->
<!--        </template>-->
<!--        <el-table-->
<!--            :data="tableData"-->
<!--            :style="{width: '100%'}"-->
<!--        >-->
<!--          <el-table-column prop="date" label="Date"  width="180"/>-->
<!--          <el-table-column prop="name" label="Name" width="180"/>-->
<!--          <el-table-column prop="address" label="Address" />-->
<!--        </el-table>-->
<!--        <el-pagination background layout="prev, pager, next" :total="1000"-->
<!--                       @size-change="testSizeChange" @current-change="testPageChange"/>-->
<!--      </el-card>-->
<!--    </template>-->
<!--  </Layout>-->
<!--</template>-->


<!--<style scoped lang="scss">-->
<!--.card-header {-->
<!--  display: flex;-->
<!--  justify-content: space-between;-->
<!--  align-items: center;-->
<!--}-->

<!--.text {-->
<!--  font-size: 14px;-->
<!--}-->

<!--.item {-->
<!--  margin-bottom: 18px;-->
<!--}-->

<!--.box-card {-->

<!--  width: 100%;-->
<!--  height: 100%;-->
<!--}-->
<!--</style>-->
