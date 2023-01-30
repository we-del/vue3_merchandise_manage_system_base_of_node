<template>
  <el-menu
      :default-active="page"
      :style="{height:'100%'}"
      @open="handleOpen"
      @close="handleClose"
      router
      :default-openeds="defaultSpread"
  >
    <el-menu-item :index="HOME">
      <el-icon>
        <HomeFilled/>
      </el-icon>
      <span>首页</span>
    </el-menu-item>
    <el-sub-menu :index="AUTH_MANAGE">
      <template #title>
        <el-icon>
          <Lock/>
        </el-icon>
        <span>权限管理</span>
      </template>
      <el-menu-item :index="USER_MANAGE">用户管理</el-menu-item>
      <el-menu-item :index="ROLE_MANAGE">角色管理</el-menu-item>
    </el-sub-menu>
    <el-sub-menu :index="ITEM_MANAGE">
      <template #title>
        <el-icon>
          <ShoppingBag/>
        </el-icon>
        <span>商品</span>
      </template>
      <el-menu-item :index="CATEGORY_MANAGE">分类管理</el-menu-item>
      <el-menu-item :index="MERCHANDISE_MANAGE">商品管理</el-menu-item>
    </el-sub-menu>

  </el-menu>
</template>

<script lang="ts" setup>
import {
  HomeFilled,
  Lock,
  ShoppingBag
} from '@element-plus/icons-vue'
import {defineProps} from "vue";
import {ROUTERS} from "@/config";
// 可以接收一个page属性，接收的props在template中可以直接使用,defineProps接收的数据会包装为一个proxy代理
const {
  HOME, USER_MANAGE, ROLE_MANAGE
  , AUTH_MANAGE, MERCHANDISE_MANAGE,CATEGORY_MANAGE,ITEM_MANAGE
} = ROUTERS;
const a = defineProps<{ page: string, defaultSpread?: string[] }>()
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>
