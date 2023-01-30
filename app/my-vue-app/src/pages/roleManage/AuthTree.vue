<script lang="ts" setup>
import {inject, defineEmits, watch, ref, reactive} from "vue";


import {updateRoleAuthReq} from "@/api/role";
import {UpdateRoleReq} from "@/interface";
import userLoginStore from "@/store/UserLoginDataStore";
import {ElMessage} from "element-plus/es";

console.log("userLoginStore");
const userStore = userLoginStore();
// 接收treeDialog的显示状态
const dialogTreeVisible: any = inject("dialogTreeVisible");
const curUpdateRow: any = inject("curUpdateRow");

const emit = defineEmits(["updateRoleList"]);

const preUpdateRow: any = reactive<any>({});

// 获得el-tree节点映射
const tree = ref();
console.log(tree);


// 监视dialog是否显示（为true时显示），用于更新当前复选框的选中
watch(dialogTreeVisible, (newVal) => {

  /**
    @description: 由于tree.value && tree.value.setCheckedKeys([curUpdateRow.menus]); 存在一个bug(选中同
   一个对象选中会失效，因此需要判断是否为同一个对象)
  */

  // 说明选中的是同一个对象不做处理(此时显示唱一个选中的状态)
  if (preUpdateRow && preUpdateRow._id === curUpdateRow._id) return;

  // 在选中一个不同的行时，进行选中节点更新
  if (newVal) {
    console.log(newVal);
    console.log(tree.value);
    // ref收集的数据会预处理一遍，此时ref还未收集到虚拟dom映射，因此需要使用 tree.value && .. 去做判断

    // setCheckedNodes 会改变一次checkbox的当前状态？而非选中？
    // tree.value && tree.value.setCheckedNodes([curUpdateRow.menus]);
    // setCheckedKeys 为选中的节点（在重复点击一个相同的权限时会产生bug）
    tree.value && tree.value.setCheckedKeys([curUpdateRow.menus]);
    preUpdateRow._id = curUpdateRow._id;
  }
})

function test(a: any, b: any, c: any) {
  // console.log(a, b, c, d);
}


// 存储当前更新行的信息
const updateRole: UpdateRoleReq = {
  _id: "",
  auth_name: "",
  auth_time: 0,
  menus: curUpdateRow.menus || []
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
 @description: 点击提交后调用，用于更新角色权限
 */
const updateRoleAuth = async () => {
  updateRole.auth_name = userStore.username || "admin";
  updateRole.auth_time = Date.now();
  updateRole._id = curUpdateRow._id;
  console.log(updateRole);
  const res: any = await updateRoleAuthReq(updateRole);
  console.log(res);
  if (res.data.status === 0) {
    // 重新获得角色列表数据
    emit("updateRoleList");

    dialogTreeVisible.value = false;
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
  const distKeysArr = allChecked.checkedKeys;
  // 根据当前选中的状态返回对应的数据
  updateRole.menus = distKeysArr[0] ? distKeysArr : distKeysArr.splice(1, distKeysArr.length);
  console.log(updateRole);
}

</script>

<template>
  <el-dialog v-model="dialogTreeVisible" :title="`正在给角色 '${curUpdateRow.name}' 设置权限`">
    <el-tree
        :data="data"
        show-checkbox
        node-key="value"
        :default-checked-keys="curUpdateRow.menus"
        default-expand-all
        @check-change="test"
        @check="testCheck"
        ref="tree"
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
