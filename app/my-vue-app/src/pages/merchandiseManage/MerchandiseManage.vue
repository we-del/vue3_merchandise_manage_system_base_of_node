<script lang="ts" setup>

// 三方库
import {ref, onMounted, reactive, provide} from "vue";
import {useRouter} from "vue-router";
import {ElMessage, ElMessageBox} from 'element-plus';

// 布局组件
import Layout from "@/layout/Layout.vue";
import Slider from "@/components/Slider.vue";
import NavHeader from "@/components/NavHeader.vue";

import {
  Search
} from '@element-plus/icons-vue'

// 配置项
import {ROUTERS} from "@/config";
import {
  removeImageOfMerchandiseReq, getMerchandiseListReq, updateMerchandiseStateReq,
  searchMerchandiseReq, removeMerchandiseReq
} from "@/api/merchandise";
import {SearchMerchandiseReq} from "@/interface";
// import {PAGE_SIZE} from "@/config";

const {ITEM_MANAGE, MERCHANDISE_MANAGE} = ROUTERS;


// 一页显示数据个数
const PAGE_SIZE = 5;

// 存储当前所处分页
const curPage = ref<number>(1);

// 当前需要展示的数据数
const dataTotal = ref<number>(0);

// 是否展示对话框对话框是否开启
const showDialog = ref<boolean>(false);

// 当前执行的角色操作 (为 -1 表示没有点击任何操作，为0时表达式点击新增角色，为1时表示点击更新角色)
// 当前执行的角色操作 (为false时表达式点击新增角色，为true时表示点击更新角色)
const categoryUpdateOpe = ref<boolean>(false);

// 是否加载
const isLoading = ref<boolean>(true);

// 服务器返回的数据
const serveData = reactive<any>({});

// 所有需要展示的数据
const allData = reactive<any[]>([]);

// 当前表单页需要展示的数据
const tableData = reactive<any[]>([]);

// 当前行选中的商品
const curUpdateRow = reactive<{ [propsName: string]: any }>({});


// 商品搜索记录
const merchandiseSearchObj: SearchMerchandiseReq = {
  pageNum: curPage.value,
  pageSize: PAGE_SIZE,
}
/**
 @description: 记录当前搜索方式 , -1为没有选择，0为name搜索，1为描述搜索
 @tips: 只有需要在页面上呈现的数据需要设置为数据源，因为每次重绘代理会重新调用get方法获得最新的数据，并进行前后虚拟
 dom对比，渲染差异的部分，(只有前后代理的数据有差异时才会调用)并调用更新生命周期函数
 */
const searchMerchandiseMode = ref<string | number>("");

// 记录搜索的内容
const searchContent = ref("");


// 向其被包裹组件提供可读写的该状态
provide("curUpdateRow", curUpdateRow); // 当前选中的行信息
provide("categoryUpdateOpe", categoryUpdateOpe);

/**
 @description: 用于重新获得角色列表
 */

const updateMerchandiseList = async () => {
  // 获得所有角色列表
  const res = await getMerchandiseListReq({pageSize: PAGE_SIZE, pageNum: curPage.value});
  if (res.data.status === 0) {
    saveServerDataToCurComponentInstance(res);
  }
}

/**
 @description: 存储服务器数据到当前组件数据源中
 */

const saveServerDataToCurComponentInstance = (res: any) => {
  console.log("res@", res);
  const distData = res.data.data;


  // 清空原存储数组
  while (tableData.length > 0) tableData.pop();
  while (allData.length > 0) allData.pop();


  // proxy: 无法改变代理指向，只能在其数据源上进行数据更新
  // distData.forEach((obj: any) => serveData.push(obj))
  Object.keys(distData).forEach((key: any) => serveData[key] = distData[key])
  // ref : 改变代理指向，因为其返回的refImpl对象通过value改变数据源


  serveData.list.forEach((merchandise: any) => {

    const merchandiseCopy = {...merchandise};
    // 对原对象进行拷贝，避免影响原数据，知道层数可以使用 ... 不知道则需要使用JSON进行序列化
    // merchandiseCopy.price = "￥"+merchandiseCopy.price;
    // 添加到展示表中
    allData.push(merchandiseCopy);
  })
  // 更新加载状态
  isLoading.value = false;

  // 将该数组的role_id作为key,匹配role对象的name属性作为值
  // serveData.roles.forEach((category: any) => roleObj[category['_id']] = category.name)


  // 改变数据长度
  dataTotal.value = serveData.total; // 需要更改


  // 改变当前tableData原数据的数据显示
  // splice会修改原数组，并将截取的数据进行返回
  // 不需要我们做前端分页，因为后端已经分页我们展示数据即可
  // tableData.push(...([...allData].reverse().splice((curPage.value - 1) * PAGE_SIZE, PAGE_SIZE)))
  tableData.push(...([...allData].reverse()))
  console.log("serveData", serveData);
}


// 用于发送ajax请求，并更新数据源进行页面重绘
onMounted(() => {
  updateMerchandiseList();
});


/**
 @description: 搜素指定内容
 */
const searchMerchandise = async () => {
  if (typeof (searchMerchandiseMode.value) === "string") {
    ElMessage({type: 'warning', message: '请选择搜素哦方式', duration: 1000});
    return;
  }

  if (searchMerchandiseMode.value === 0)
    merchandiseSearchObj.productName = searchContent.value;
  else
    merchandiseSearchObj.productDesc = searchContent.value;

  if (searchContent.value.length <= 0) ElMessage({type: "info", message: "即将展示全部数据", duration: 1200});
  const res = await searchMerchandiseReq(merchandiseSearchObj);

  if (res.data.status === 0) {
    console.log(res.data.data);
    saveServerDataToCurComponentInstance(res);
    ElMessage({type: 'success', message: '搜素完成', duration: 1000});
    searchContent.value = "";
  } else {

    ElMessage({type: 'warning', message: '网络异常', duration: 1000});
  }
}

/**
 @description: 更新当前页的数据
 */
const updateCurPage = (page: number) => {
  // 清空tableData的数据
  while (tableData.length > 0) tableData.pop();
  curPage.value = page;
  // 重新更新界面
  updateMerchandiseList();
}


/**
 @description: 更新指定行的数据
 */
const changeMerchandiseMessage = (row: any) => {
  console.log("row", row);
  // 更改当前dialog的显示状态
  showDialog.value = true;
  categoryUpdateOpe.value = true;
  Object.keys(row).forEach((key: any) => curUpdateRow[key] = row[key])
}


/**
 @description: 改变指定行的商品状态
 */
const updateMerchandiseStatus = async (row: any, status: number) => {
  const productId = row._id;
  const res = await updateMerchandiseStateReq({productId, status});
  if (res.data.status === 0) {
    console.log(res.data);
    ElMessage({type: 'success', message: '状态修改成功', duration: 500});
  } else {

    ElMessage({type: 'warning', message: '网络异常，请稍后再试'});
  }
  updateMerchandiseList(); // 重新获得商品列表
}


/**
 @description: 更新或增加新的商品
 */

const router = useRouter();

const card = ref();
const getMerchandiseDetails = (row: any) => {
  ;
}


/**
 @description: 删除指定行的数据
 */
const removeCurRow = (row: any) => {
  console.log("row", row);
  const productId = row._id;
  ElMessageBox.confirm(`确定要删除商品 "${row.name}" 吗？`, "删除分类", {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: "warning"
  }).then(async () => {
    const res = await removeMerchandiseReq({productId});
    if (res.data.status === 0) {
      ElMessage({type: 'success', message: '删除成功'});
      updateMerchandiseList();
    }
  }).catch(() => new Promise(() => {
  }))


}

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
            <el-button class="button" type="primary"
                       @click="router.push(`/item/add-merchandise`)">添加商品
            </el-button>
            <div id="search-region">
              <el-select placeholder="选择搜索方式" v-model="searchMerchandiseMode">
                <el-option :value="0" label="按名称搜索"/>
                <el-option :value="1" label="按描述搜素"/>
              </el-select>
              <el-input placeholder="输入搜索内容" v-model="searchContent"/>
              <el-button :icon="Search" @click="searchMerchandise">搜索</el-button>
            </div>
          </div>
        </template>
        <el-table
            v-loading="isLoading"
            :data="tableData"
            :style="{width: '100%'}"
            border
        >
          <el-table-column prop="name" align="center" label="商品名" width="300"/>
          <el-table-column prop="desc" align="center" label="商品描述" width="600"/>
          <el-table-column prop="price" align="center" label="价格" width="100">
            <template #default="{row}">
              <div>￥{{ row.price }}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="状态" width="150">
            <template #default="{row}">
              <!--              status 为0表示售卖中，为1表示已下架-->
              <el-button size="small" type="success" :plain="row.status !== 0"
                         @click="updateMerchandiseStatus(row,0)"
              >上架
              </el-button>
              <el-button
                  size="small"
                  type="danger"
                  :plain="row.status !== 1"
                  @click="updateMerchandiseStatus(row,1)"
              >下架
              </el-button
              >
              <div>{{ row.status === 0 ? '售卖中' : '已下架' }}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="150">
            <template #default="scope">
              <el-button size="small" @click="router.push(`/item/merchandise-update/${scope.row._id}`)" link
              >修改
              </el-button
              >
              <el-button
                  size="small"
                  type="primary"
                  @click="router.push(`/item/merchandise-details/${scope.row._id}`)"
                  link
              >详情
              </el-button>
              <el-button
                  size="small"
                  type="danger"
                  @click="removeCurRow(scope.row)"
                  link
              >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination background layout="prev, pager, next" :total="dataTotal" :page-size="PAGE_SIZE"
                       @current-change="updateCurPage" class="pagination"/>
      </el-card>

      <!--      <UpdateCategorySingle  @updateDialogVisible="updateDialogVisible" :dialog-visible="showDialog"-->
      <!--                             @updateMerchandiseList="updateMerchandiseList"/>-->

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

#search-region {
  display: flex;
}
</style>
