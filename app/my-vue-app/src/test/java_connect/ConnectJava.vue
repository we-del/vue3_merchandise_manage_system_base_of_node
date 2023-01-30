<script lang="ts" setup>
import {reactive, onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import {getEmpList, getEmpListByOrg, getEmpListByName, removePeopleById} from "@/api/test/use";

// 布局组件
import Layout from "@/layout/Layout.vue";
import Slider from "@/components/Slider.vue";
import NavHeader from "@/components/NavHeader.vue";

const serverData = reactive<any[]>([]);


const {push} = useRouter();


/**
 @description: 清除所有数据
 */
const clear = () => {
  while (serverData.length) serverData.pop();
}


// 收集搜索方式
const searchMerchandiseMode = ref<string | number>(0);
const searchContent = ref<string>();

const searchAction = () => {
  clear(); // 清除之前查询的数据
  if (searchMerchandiseMode.value === 0) { // 名字
    handlerListByName();
  } else { // 组织
    handlerListByOrg();
  }
}
const handlerListByName = async () => {
  const {data}: any = await getEmpListByName(searchContent.value as string);
  if (data) {
    data.forEach((people: any, index: number) => serverData[index] = people);
  }
}
const handlerListByOrg = async () => {
  const {data}: any = await getEmpListByOrg(searchContent.value as string);
  if (data) {
    const tmp: any[] = [];
    data.forEach((item: any) => {
      item.empList.forEach((people: any) => {
        people.dept = {name: item.name};
        serverData.push(people);
      })
    });
  }
}

/**
 @description: 删除一个好汉
 */
const removePeople = async (id: any) => {
  clear();
  await removePeopleById(id);
  getList();
}

const getList = async () => {
  const {data}: any = await getEmpList();
  if (data) {
    data.forEach((people: any, index: number) => serverData[index] = people);
  }
}
onMounted(async () => {
  getList();
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
          <div class="title">前后端测试</div>
        </template>
      </NavHeader>
    </template>
    <template #content>
      <el-card class="box-card" ref="card">

        <template #header>

          <el-button class="button" type="primary"
                     @click="push('/updatePeople')">新增好汉
          </el-button>
          <div id="search-region">

            <el-select placeholder="选择搜索方式" v-model="searchMerchandiseMode">
              <el-option :value="0" label="按名称搜索"/>
              <el-option :value="1" label="按组织搜素"/>
            </el-select>
            <el-input placeholder="输入搜索内容" v-model="searchContent"/>
            <el-button @click="searchAction">搜索</el-button>
          </div>
        </template>
        <el-table
            :data="serverData"
            :style="{width: '100%'}"
            border
        >
          <el-table-column prop="id" align="center" label="id"/>
          <el-table-column prop="name" align="center" label="姓名"/>
          <el-table-column prop="age" align="center" label="年龄" width="100"/>
          <el-table-column prop="gender" align="center" label="性别" width="100"/>
          <el-table-column align="center" label="组织">
            <template #default="{row:{dept:{name}}}">
              <div>{{ name }}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="150">
            <template #default="{row:{id}}">
              <el-button size="small" @click="push(`/updatePeople?id=${id}`)" link
              >修改
              </el-button>
              <el-button
                  size="small"
                  type="danger"
                  @click="()=>removePeople(id)"
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

