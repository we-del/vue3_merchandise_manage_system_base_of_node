<script lang="ts" setup>
import {inject, defineEmits} from "vue";


import {addRoleReq, updateRoleAuthReq} from "@/api/role";
import {UpdateRoleReq} from "@/interface";
import userLoginStore from "@/store/UserLoginDataStore";
import {ElMessage} from "element-plus/es";

console.log("userLoginStore", userLoginStore());
// 接收treeDialog的显示状态
const dialogTreeVisible: any = inject("dialogTreeVisible");
const curUpdateRow: any = inject("curUpdateRow");

const emit = defineEmits(["updateUserList"]);

function test(a: any, b: any, c: any, d: any) {
  // console.log(a, b, c, d);
}

const updateRole: UpdateRoleReq = {
  _id: curUpdateRow._id,
  auth_name: "",
  auth_time: 0,
  menus: curUpdateRow.menus
};

// tree配置对象可选值
// tree 的展示数据
// label用于展示数据 ，children用于展开子节点
// disabled 用于禁用某个节点
// class 给某个节点设置类名，可以进行样式设置
// 其余配置向不进行页面展示，只会称为该节点的额外属性
const data = [
  {
    label: '平台权限',
    children: [
      {
        label: '首页',
        value: "home",
      },
      {
        label: '商品',
        value: "prods",
        children: [
          {
            label: '分类管理',
            value: "category",
          },
          {
            label: '商品管理',
            value: "product",
          },
        ],
      },
      {
        label: '权限',
        value: "auth",
        children: [
          {
            label: "用户管理",
            value: "user",
          },
          {
            label: "角色管理",
            value: "role"
          }
        ]
      }
    ],
  },

]

/**
 @description: 当点击关闭时调用
 */
const handlerDialogClose = () => {
  dialogTreeVisible.value = false;
}

/**
 @description: 点击提交后调用
 */
const updateRoleAuth = async () => {
  updateRole.auth_name = userLoginStore().username || 'admin';
  updateRole.auth_time = Date.now();
  const res: any = await updateRoleAuthReq(updateRole);
  console.log(res);
  if (res.data.status === 0) {
    // 重新获得角色列表数据
    emit("updateUserList");

    // 进行提示
    ElMessage({
      message: "设置权限成功",
      type: "success"
    });
  } else {
    ElMessage({
      message: "网络异常，请稍后再试",
      type: "warning"
    });
  }
}

const testCheck = (curChecked: any, allChecked: any) => {
  updateRole.menus = allChecked.checkedKeys.splice(1, allChecked.checkedKeys.length);
  console.log(updateRole);
}

</script>

<template>
  <el-dialog v-model="dialogTreeVisible" title="Shipping address">
    <el-tree
        :data="data"
        show-checkbox
        node-key="value"
        :default-checked-keys="curUpdateRow.menus"
        default-expand-all
        @check-change="test"
        @check="testCheck"
    />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handlerDialogClose()">取消</el-button>
        <el-button type="primary" @click="updateRoleAuth()"
        >提交</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>
