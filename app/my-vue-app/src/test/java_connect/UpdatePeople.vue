<script lang="ts" setup>

// 三方库
import {ref, onMounted, reactive, provide, computed} from "vue";
import {useRouter, useRoute} from "vue-router";
import {ElMessage, ElMessageBox} from 'element-plus';
import Dayjs from "dayjs";

// 布局组件
import Layout from "@/layout/Layout.vue";
import Slider from "@/components/Slider.vue";
import NavHeader from "@/components/NavHeader.vue";


import {
  ArrowLeft
} from '@element-plus/icons-vue'

// 配置项
import {ROUTERS, BASE_URL} from "@/config";
import {getDeptList, updateOnePeople, addOnePeople} from "@/api/test/use";


const {ITEM_MANAGE, MERCHANDISE_MANAGE} = ROUTERS;

const curPeopleMsg = reactive<any>({
  name:"",
  age:0,
  gender:"",
  dept_id:0
});

const deptList = reactive<any[]>([]);

const {query} = useRoute();


console.log(query);
console.log(Object.keys(query).length > 0);
const isUpdate = computed(() => {
  return Object.keys(query).length > 0;
})
// 存储图片提交
const upload = ref();


// 分类列表

const {go, push} = useRouter();

/**
 @description: 得到所有部门列表
 */
const getAllDept = async () => {
  const {data} = await getDeptList();
  if (data) {
    data.forEach((org: any, index: number) => deptList[index] = org);
  }
}


onMounted(async () => {
  getAllDept();
})

</script>

<template>
  <h1>tt</h1>
<!--  <Layout>-->
<!--    <template #slider>-->
<!--      <Slider :page="MERCHANDISE_MANAGE" :default-spread="[ITEM_MANAGE]"/>-->
<!--    </template>-->
<!--    <template #header>-->
<!--      <NavHeader>-->
<!--        <template #title>-->
<!--          <div class="title"> {{ isUpdate ? '更新好汉' : '新增好汉' }}</div>-->
<!--        </template>-->
<!--      </NavHeader>-->
<!--    </template>-->
<!--    <template #content>-->
<!--      <el-card class="box-card" ref="card">-->
<!--        <template #header>-->
<!--          <div class="card-header">-->
<!--            <el-button type="primary" link @click="go(-1)" :icon="ArrowLeft">-->
<!--              返回-->
<!--            </el-button>-->
<!--            <div :style="{marginLeft:'10px',fontSize:'20px'}"> 更新操作</div>-->
<!--          </div>-->
<!--        </template>-->
<!--        <template #default>-->
<!--          <el-form ref="formRef"-->
<!--                   label-width="200px">-->
<!--            <el-form-item label="姓名" prop="name">-->
<!--              <el-input v-model=""/>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="年龄" prop="age">-->
<!--              <el-input v-model=""/>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="性别" prop="gender">-->
<!--              <el-select v-model="" placeholder="请选择一个分类"-->
<!--                         size="large">-->
<!--                &lt;!&ndash;                <el-option&ndash;&gt;-->
<!--                &lt;!&ndash;                    v-for=""&ndash;&gt;-->
<!--                &lt;!&ndash;                    :key=""&ndash;&gt;-->
<!--                &lt;!&ndash;                    :label=""&ndash;&gt;-->
<!--                &lt;!&ndash;                    :value=""&ndash;&gt;-->
<!--                &lt;!&ndash;                />&ndash;&gt;-->
<!--              </el-select>-->
<!--            </el-form-item>-->
<!--            &lt;!&ndash;        使用系统默认邮箱验证  需要指定使用的验证对象 props  和验证规则 rules&ndash;&gt;-->
<!--            <el-form-item label="组织分类">-->
<!--              <el-select v-model=""-->
<!--                         size="large">-->
<!--                &lt;!&ndash;                <el-option&ndash;&gt;-->
<!--                &lt;!&ndash;                    v-for="&ndash;&gt;-->
<!--                &lt;!&ndash;                    :key=""&ndash;&gt;-->
<!--                &lt;!&ndash;                    :label=""&ndash;&gt;-->
<!--                &lt;!&ndash;                    :value=""&ndash;&gt;-->
<!--                &lt;!&ndash;                />&ndash;&gt;-->
<!--              </el-select>-->
<!--            </el-form-item>-->
<!--          </el-form>-->
<!--          <el-button type="primary" :style="{marginLeft:'50%'}" @click="handlerSubmit">提交</el-button>-->
<!--        </template>-->
<!--      </el-card>-->


<!--    </template>-->
<!--  </Layout>-->
</template>


<style scoped lang="scss">
.card-header {
  display: flex;
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

.merchandise-row {
  display: flex;
  align-items: center;

}
</style>
