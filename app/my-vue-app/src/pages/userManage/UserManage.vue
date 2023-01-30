<script lang="ts" setup>

// 三方库
import {ref, onMounted, reactive, provide} from "vue";
import {ElMessage, ElMessageBox} from 'element-plus';
import Dayjs from "dayjs";

// 布局组件
import Layout from "@/layout/Layout.vue";
import Slider from "@/components/Slider.vue";
import NavHeader from "@/components/NavHeader.vue";

// 自定义组件
import UpdateDialog from "@/pages/userManage/UpdateDialog.vue";
import AddDialog from "@/pages/userManage/AddDialog.vue";

// 配置项
import {ROUTERS} from "@/config";
import {getUserListReq, removeUserToUserListReq} from "@/api/user";
import {PAGE_SIZE} from "@/config";

const {USER_MANAGE, AUTH_MANAGE} = ROUTERS;

// 存储当前所处分页
const curPage = ref<number>(1);

// 当前需要展示的数据数
const dataTotal = ref<number>(0);

// 是否展示对话框对话框是否开启
const showDialog = ref<boolean>(false);

// 当前执行的用户操作 (为 -1 表示没有点击任何操作，为0时表达式点击新增用户，为1时表示点击更新用户)
// 当前执行的用户操作 (为false时表达式点击新增用户，为true时表示点击更新用户)
const userUpdateOpe = ref<boolean>(false);

// 是否加载
const isLoading = ref<boolean>(true);

// 服务器返回的数据
const serveData = reactive<any>({});

// 所有需要展示的数据
const allData = reactive<any[]>([]);

// 用于存储当前可选择的角色身份
const roleObj = reactive<{ [propName: string]: any }>({});

// 当前表单页需要展示的数据
const tableData = reactive<any[]>([]);


const curUpdateRow = reactive<{ [propsName: string]: any }>({});


/**
 @description: 用于重新获得角色列表
 */

const updateUserList = async () => {
  // 获得所有用户列表
  const res = await getUserListReq();
  if (res.data.status === 0) {
    const distData = res.data.data;
    // proxy: 无法改变代理指向，只能在其数据源上进行数据更新
    Object.keys(distData).forEach(key => serveData[key] = distData[key]);
    // ref : 改变代理指向，因为其返回的refImpl对象通过value改变数据源


    // 清空原存储数组
    while (tableData.length > 0) tableData.pop();
    while (allData.length > 0) allData.pop();
    serveData.users.reverse(); // 使最新的数据永远在前面
    serveData.users.forEach((user: any) => {
      const targetRole = serveData.roles.find((role: any) => role._id === user.role_id)
      user.create_time = Dayjs(user.create_time).format('YYYY-MM-DD HH:mm:ss');
      // 对原对象进行拷贝，避免影响原数据，知道层数可以使用 ... 不知道则需要使用JSON进行序列化
      const userCopy = {...user};


      // 将该数组的role_id作为key,匹配role对象的name属性作为值
      // roleObj[user['role_id']] = targetRole.name;

      // 删除不需要的属性
      Reflect.deleteProperty(userCopy, 'password');
      Reflect.deleteProperty(userCopy, 'role_id');

      console.log("targetRole", targetRole);
      // 设置新的属性
      Reflect.set(userCopy, 'role', targetRole.name);

      // 添加到展示表中
      allData.push(userCopy);
    })
    // 更新加载状态
    isLoading.value = false;

    // 将该数组的role_id作为key,匹配role对象的name属性作为值
    serveData.roles.forEach((role: any) => roleObj[role['_id']] = role.name)


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
  updateUserList();
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
  showDialog.value = true;
  userUpdateOpe.value = true;
  Object.keys(row).forEach((key: any) => curUpdateRow[key] = row[key])
}


/**
 @description: 删除指定行的数据
 */
const removeCurRow = (row: any) => {
  console.log("row", row);
  const userId = row._id;
  ElMessageBox.confirm(`确定要删除用户 "${row.username}" 吗？`, "删除用户", {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: "warning"
  }).then(async () => {
    const res = await removeUserToUserListReq({userId});
    if (res.data.status === 0) {
      ElMessage({type: 'success', message: '删除成功'});
      updateUserList();
    }
  }).catch(() => new Promise(() => {
  }))


}

</script>

<template>
  <Layout>
    <template #slider>
      <Slider :page="USER_MANAGE" :default-spread="[AUTH_MANAGE]"/>
    </template>
    <template #header>
      <NavHeader>
        <template #title>
          <div class="title">用户管理</div>
        </template>
      </NavHeader>
    </template>
    <template #content>
      <el-card class="box-card" ref="card">
        <template #header>
          <div class="card-header">
            <el-button class="button" type="primary" @click="showDialog=true;userUpdateOpe=false;">添加用户</el-button>
          </div>
        </template>
        <el-table
            v-loading="isLoading"
            :data="tableData"
            :style="{width: '100%'}"
            border
        >
          <el-table-column prop="username" align="center" label="用户名" width="180"/>
          <el-table-column prop="email" align="center" label="邮箱" width="180"/>
          <el-table-column prop="phone" align="center" label="电话"/>
          <el-table-column prop="create_time" align="center" label="注册时间"/>
          <el-table-column prop="role" align="center" label="所属角色"/>
          <el-table-column prop="phone" align="center" label="电话"/>
          <el-table-column align="center" label="操作">
            <template #default="scope">
              <el-button size="small" @click="updateCurRow(scope.row)"
              >修改
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

      <!--      用户显示新增或更新用户-->
      <UpdateDialog :dialog-visible="showDialog" @updateDialogVisible="updateDialogVisible"
                    @updateUserList="updateUserList" :curUpdateRow="curUpdateRow"
                    :user-update-ope="userUpdateOpe" :role-obj="roleObj" v-if="userUpdateOpe"/>
      <AddDialog v-else :dialog-visible="showDialog" @updateDialogVisible="updateDialogVisible"
                 :role-obj="roleObj" @updateUserList="updateUserList"/>
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
