<script lang="ts" setup>

// 三方库
import {ref, onMounted, reactive,toRef, provide} from "vue";
import {ElMessage, ElMessageBox,} from 'element-plus';
import Dayjs from "dayjs";

// 布局组件
import Layout from "@/layout/Layout.vue";
import Slider from "@/components/Slider.vue";
import NavHeader from "@/components/NavHeader.vue";

// 自定义组件
import AddRole from "./AddRole.vue";
import AuthTree from "./AuthTree.vue";
// 配置项
import {ROUTERS} from "@/config";
import {removeRoleReq, addRoleReq, getRoleListReq, updateRoleAuthReq} from "@/api/role";
import {PAGE_SIZE} from "@/config";

const {ROLE_MANAGE, AUTH_MANAGE} = ROUTERS;

// 存储当前所处分页
const curPage = ref<number>(1);

// 当前需要展示的数据数
const dataTotal = ref<number>(0);

// 是否展示对话框对话框是否开启
const showDialog = ref<boolean>(false);

// 当前执行的角色操作 (为 -1 表示没有点击任何操作，为0时表达式点击新增角色，为1时表示点击更新角色)
// 当前执行的角色操作 (为false时表达式点击新增角色，为true时表示点击更新角色)
const userUpdateOpe = ref<boolean>(false);

// 是否加载
const isLoading = ref<boolean>(true);

// 服务器返回的数据
const serveData = reactive<any[]>([]);

// 所有需要展示的数据
const allData = reactive<any[]>([]);

// 用于存储当前可选择的角色身份
const dialogTreeVisible = ref<boolean>(false);

// 当前表单页需要展示的数据
const tableData = reactive<any[]>([]);


const curUpdateRow = reactive<{ [propsName: string]: any }>({});

// 向其被包裹组件提供可读写的该状态
provide("dialogTreeVisible",dialogTreeVisible); // treeDialog显示状态
provide("curUpdateRow",curUpdateRow); // 当前选中的行信息


/**
 @description: 用于重新获得角色列表
 */

const updateRoleList = async () => {
  // 获得所有角色列表
  const res = await getRoleListReq();
  if (res.data.status === 0) {
    console.log("res@", res);
    const distData = res.data.data;


    // 清空原存储数组
    while (tableData.length > 0) tableData.pop();
    while (serveData.length > 0) serveData.pop();
    while (allData.length > 0) allData.pop();


    // proxy: 无法改变代理指向，只能在其数据源上进行数据更新
    distData.forEach((obj: any) => serveData.push(obj))
    // ref : 改变代理指向，因为其返回的refImpl对象通过value改变数据源


    serveData.forEach((role: any) => {

      const roleCopy = {...role};
      roleCopy.create_time = Dayjs(role.create_time).format('YYYY-MM-DD HH:mm:ss');
      roleCopy.auth_time = Dayjs(role.auth_time).format('YYYY-MM-DD HH:mm:ss');
      // 对原对象进行拷贝，避免影响原数据，知道层数可以使用 ... 不知道则需要使用JSON进行序列化


      // 将该数组的role_id作为key,匹配role对象的name属性作为值
      // roleObj[user['role_id']] = targetRole.name;

      // 删除不需要的属性
      // Reflect.deleteProperty(userCopy, 'password');
      // Reflect.deleteProperty(userCopy, 'role_id');
      //
      // // 设置新的属性
      // Reflect.set(userCopy, 'role', targetRole.name);

      // 添加到展示表中
      allData.push(roleCopy);
    })
    // 更新加载状态
    isLoading.value = false;

    // 将该数组的role_id作为key,匹配role对象的name属性作为值
    // serveData.roles.forEach((role: any) => roleObj[role['_id']] = role.name)


    // 改变数据长度
    dataTotal.value = allData.length;


    // 改变当前tableData原数据的数据显示
    // splice会修改原数组，并将截取的数据进行返回
    // tableData.push(...([...allData].reverse().splice((curPage.value - 1) * PAGE_SIZE, PAGE_SIZE)))
    tableData.push(...([...allData].splice((curPage.value - 1) * PAGE_SIZE, PAGE_SIZE)))
  }
}

// 用于发送ajax请求，并更新数据源进行页面重绘
onMounted(() => {
  updateRoleList();
});


/**
 @description: 更新当前页的数据
 */
const updateCurPage = (page: number) => {
  // 清空tableData的数据
  while (tableData.length > 0) tableData.pop();
  curPage.value = page;
  // 获得当前代理的最新数据
  tableData.push(...([...allData].splice((curPage.value - 1) * PAGE_SIZE, PAGE_SIZE)))
}

/**
 @description: 更新dialog的显示和隐藏
 */
const updateDialogVisible = (flag: boolean) => {
  showDialog.value = flag;
  userUpdateOpe.value = flag;
}

/**
 @description: 更新指定行的数据
 */
const updateCurRow = (row: any) => {
  console.log("row", row);
  // 更改当前dialog的显示状态
  dialogTreeVisible.value = true;
  Object.keys(row).forEach((key: any) => curUpdateRow[key] = row[key])
}


/**
 @description: 删除指定行的数据
 */
const removeCurRow = (row: any) => {
  console.log("row", row);
  const roleId = row._id;
  ElMessageBox.confirm(`确定要删除角色 "${row.name}" 吗？`, "删除角色", {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: "warning"
  }).then(async () => {
    const res = await removeRoleReq({roleId});
    if (res.data.status === 0) {
      ElMessage({type: 'success', message: '删除成功'});
      updateRoleList();
    }
  }).catch(() => new Promise(() => {
  }))


}

</script>

<template>
  <Layout>
    <template #slider>
      <Slider :page="ROLE_MANAGE" :default-spread="[AUTH_MANAGE]"/>
    </template>
    <template #header>
      <NavHeader>
        <template #title>
          <div class="title">角色管理</div>
        </template>
      </NavHeader>
    </template>
    <template #content>
      <el-card class="box-card" ref="card">
        <template #header>
          <div class="card-header">
            <el-button class="button" type="primary" @click="showDialog=true;userUpdateOpe=false;">添加角色</el-button>
          </div>
        </template>
        <el-table
            v-loading="isLoading"
            :data="tableData"
            :style="{width: '100%'}"
            border
        >
          <el-table-column prop="name" align="center" label="角色名" width="180"/>
          <el-table-column prop="create_time" align="center" label="创建时间" width="180"/>
          <el-table-column prop="auth_time" align="center" label="授权时间"/>
          <el-table-column prop="auth_name" align="center" label="授权人"/>
          <el-table-column align="center" label="操作">
            <template #default="scope">
              <el-button size="small" @click="updateCurRow(scope.row)"
              >权限
              </el-button
              >
              <el-button
                  size="small"
                  type="danger"
                  @click="removeCurRow(scope.row)"
              >删除
              </el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-pagination background layout="prev, pager, next" :total="dataTotal" :page-size="PAGE_SIZE"
                       @current-change="updateCurPage" class="pagination"/>
      </el-card>

      <AddRole :dialog-visible="showDialog" @updateDialogVisible="updateDialogVisible"
               @updateRoleList="updateRoleList"/>
      <AuthTree @updateRoleList="updateRoleList"/>
      <!--      角色显示新增或更新角色-->
      <!--      <UpdateDialog :dialog-visible="showDialog" @updateDialogVisible="updateDialogVisible"-->
      <!--                    @updateRoleList="updateRoleList" :curUpdateRow="curUpdateRow"-->
      <!--                    :user-update-ope="userUpdateOpe" :role-obj="roleObj" v-if="userUpdateOpe"/>-->
      <!--      <AddDialog :dialog-visible="showDialog" @updateDialogVisible="updateDialogVisible" v-else-->
      <!--                 :role-obj="roleObj" @updateRoleList="updateRoleList"/>-->
    </template>
  </Layout>
</template>


<style scoped lang="scss">
.card-header {
  display: flex;
  justify-content: space-between;
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
</style>
