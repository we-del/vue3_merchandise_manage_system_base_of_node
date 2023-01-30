<template>
  <el-row class="tac">
    <el-col :span="4">
      <h5 class="mb-2">Default colors</h5>
      <el-menu
          default-active="2-2"
          :default-openeds="['1','2']"
          active-text-color="#ace"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          :router="true"
      >
        <el-menu-item index="home">
          <el-icon>
            <HomeFilled/>
          </el-icon>
          <span>首页</span>
        </el-menu-item>
        <el-sub-menu index="1">
          <template #title>
            <el-icon>
              <Lock/>
            </el-icon>
            <span>权限管理</span>
          </template>
          <el-menu-item index="1-1">用户管理</el-menu-item>
          <el-menu-item index="1-2">角色管理</el-menu-item>
          <el-menu-item index="1-3">菜单管理</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="2">
          <template #title>
            <el-icon><ShoppingBag /></el-icon>
            <span>商品管理</span>
          </template>
          <el-menu-item index="2-1">平台管理</el-menu-item>
          <el-menu-item index="2-2">Spu管理</el-menu-item>
          <el-menu-item index="2-3">Sku管理</el-menu-item>
        </el-sub-menu>

      </el-menu>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import {
  HomeFilled,
  Lock,
  ShoppingBag
} from '@element-plus/icons-vue'

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>
