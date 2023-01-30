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

import UploadImage from "@/pages/merchandiseManage/updateMerchandise/UploadImage.vue";
import RichText from "@/pages/merchandiseManage/updateMerchandise/RichText.vue";


import {
  ArrowLeft
} from '@element-plus/icons-vue'

// 配置项
import {ROUTERS, BASE_URL} from "@/config";
import {getSingleMerchandiseReq, addMerchandiseReq, updateMerchandiseReq} from "@/api/merchandise";
import {getSingleCategoryReq, getCategoryListReq} from "@/api/category";
import {AddMerchandiseReq, UpdateMerchandiseReq} from "@/interface";
import {addUserToUserListReq} from "@/api/user";
// import {PAGE_SIZE} from "@/config";


const {ITEM_MANAGE, MERCHANDISE_MANAGE} = ROUTERS;

const serverData = reactive<any>({});

// 存储着当前商品的详细信息
const merchandiseMessage = reactive<any>({});

const isUpdate = computed((): boolean => {
  return Object.keys(params).length > 0;
});
// 存储当前商品需要展示的数据(新增时也当作提交数据)
const curMerchandise = reactive<AddMerchandiseReq>({
  name: "",
  desc: "",
  price: "",
  categoryId: "",
  detail: "",
  imgs: []
});

const updateMerchandiseObj: UpdateMerchandiseReq = {
  _id: "",
  categoryId: "",
  name: "",
  price: "",
  desc: "",
  detail: "",
  imgs: []
};
provide("curMerchandise", curMerchandise);

// 存储图片提交
const upload = ref();

// 自定义验证规则
const validate = reactive({
  /**
   @description: 注意 所有验证必须指定一个成功的出口(调用callback不传入任何参数 callback())，
   否则在搭配 form.validate()时无法正确的判断是否全部成功
   */
  nameValidate(rule: any, value: any, callback: any) {
    /**
     @description: 验证商品名规则，不能为空，长度不能大于80
     @tips: /\s/ 为一个正则，表示匹配一个空格
     */

    if (value.length <= 0)
      callback(new Error('不能为空'));
    else if (value.length >= 80)
      callback(new Error('长度不能大于80'));
    else
      callback();
  },
  descValidate(rule: any, value: any, callback: any) {
    /**
     @description: 验证描述规则： 长度小于100，不能为空
     */
    if (value.length <= 0)
      callback(new Error('不能为空'));
    else if (value.length >= 100)
      callback(new Error('长度不能大于100'));
    else
      callback();
  },
  priceValidate(rule: any, value: any, callback: any) {
    // 使用 el-input-number 验证
    console.log(rule, value, callback);
    /**
     @description: 验证价格规则：只能为数字，不能为空
     */
    if (value.length <= 0)
      callback(new Error('不能为空'));
    else if (!(/^\d+$/.test(value)))
      callback(new Error('只能输入数字'));
    else
      callback();
  },

  detailValidate(rule: any, value: any, callback: any) {
    /**
     @description: 验证描述规则：不为空即可
     */
    if (value.length <= 0)
      callback(new Error('不能为空'));
    else
      callback();
  },
});
// 规则集
const rules = reactive({
  name: [{
    required: true,
    message: "输入不能为空",
    trigger: 'blur',
  }, {validator: validate.nameValidate, trigger: 'blur'}],
  desc: [{
    required: true,
    message: "输入不能为空",
    trigger: 'blur',
  }, {validator: validate.descValidate, trigger: 'blur'}],
  price: [{
    required: true,
    message: "输入不能为空",
    trigger: 'blur',
  }, {validator: validate.priceValidate, trigger: 'blur'}],
  detail: [{
    required: true,
    message: "输入不能为空",
    trigger: 'blur',
  }, {validator: validate.detailValidate, trigger: 'blur'}],
});

// 分类列表
const categoryList = reactive<any[]>([]);

const {go, push} = useRouter();
const {params} = useRoute();

// 用于判断上传图片的请求是否执行完毕，执行完毕后才继续上传逻辑
const imagesIsUploadDone = ref(false);
provide("imagesIsUploadDone", imagesIsUploadDone);


// 用于更新时判断用户是否改变了图片
const imagesIsChange = ref(false);
provide("imagesIsChange", imagesIsUploadDone);
/**
 @description: 添加商品
 */
const formRef = ref(); // 用于清空数据
const handlerSubmit = () => {
  formRef.value?.validate(async (valid: any) => {
    if (valid) {
      // 添加用户
      await upload.value.uploadAllImage(); // 提交所有图片，并把返回的路径挂载到当前用户img属性下
      const timer = setInterval(() => {
        /**
         @description: 使两个请求的先后顺序一致，思路1：使用setInterval每次轮询调用，当全部请求回来时
         进行触发，同时取消该定时器
         @tips： 还需要判断用户是否添加了新的图片，只有添加了新的图片我才需要等待其上传完毕，否则直接使用
         */
        if (imagesIsUploadDone.value) { // 新增商品时，其必须上传版
          if (isUpdate.value)
              // 更新了文字和图片走此分支
            updateMerchandise();
          else
            addMerchandise();
          clearInterval(timer);
        }
        // 此段代码需要修改，没有考虑删除图片时的更新，导致数据不一致
        if (isUpdate.value && !(imagesIsChange.value)) {
          // 只更新了文字则走此分支
          updateMerchandise();
          clearInterval(timer); // 停止定时器
        }
      }, 200);
    } else {
      ElMessage({
        type: "warning",
        message: "输入有误，请检查各项输入"
      });
    }
  });
}


// 添加商品时，调用的api
const addMerchandise = async () => {
  const res = await addMerchandiseReq(curMerchandise);
  if (res.data.status === 0) {
    ElMessage({
      message: "添加商品成功",
      type: "success"
    });
    clear();
  }
}

// 添加商品时，调用的api

const imagesRemoveDone = ref(false);
provide("imagesRemoveDone", imagesRemoveDone);
const isRemovingImage = ref(false);
provide("isRemovingImage", isRemovingImage);
const updateMerchandise = async () => {

  // 删除所有图片
  await upload.value.removeMerchandisePicture(); // 返回一个宏任务的promise ,看是否能完成同步

  // 判断是否包含删除图片操作

  if(isRemovingImage.value){
    // 等待所有删除完毕
    const timer = setInterval(async()=>{
      // 只有包含删除才认为时新增
      if(imagesRemoveDone.value){
        update();
        clearInterval(timer);
      }
    },200);
  }else{
    update();
  }



}

// 执行更新操作
const update = async()=>{
  //@ts-ignore
  Object.keys(curMerchandise).forEach((key: any) => updateMerchandiseObj[key] = curMerchandise[key]);
  updateMerchandiseObj._id = merchandiseMessage._id;
  console.log("updateMerchandiseObj", updateMerchandiseObj);
  const res = await updateMerchandiseReq(updateMerchandiseObj);
  if (res.data.status === 0) {
    ElMessage({
      message: "更新商品成功",
      type: "success"
    });
    clear();
    push("/item/merchant-manage");
  }
}
const clear = () => {
  formRef.value?.resetFields();
  curMerchandise.categoryId = "";
  curMerchandise.detail = "";
  curMerchandise.imgs = [];
}

/**
 @description: 得到当前商品的信息，并保存到 curMerchandise 数据源对象中
 */
const getCurMerchandiseMessage = async () => {
  const res = await getSingleMerchandiseReq(params as { productId: string });
  if (res.data.status === 0) {
    console.log(res);
    const distData = res.data.data;
    Object.keys(distData).forEach((key: string) => serverData[key] = distData[key]);
    Object.keys(serverData).forEach((key: string) => merchandiseMessage[key] = serverData[key]);
    // const categoryId = serverData.categoryId;
    // const res1 = await getSingleCategoryReq({categoryId});
    // if (res1.data.status === 0) {
    //   merchandiseMessage.categoryName = res1.data.data.name;
    // }
  }
}

/**
 @description: 得到全部分类的信息，并保存到 categoryList 数据源对象中
 */
const getCategoryMessage = async () => {
  const res = await getCategoryListReq();
  if (res.data.status === 0) {
    console.log(res);
    const distData = res.data.data;
    /**
     @description: distData 和 categoryList 都是一个数组，
     Object.keys拿到的是distData的索引(string)类型，因此需要进行转换
     */
    // Object.keys(distData).forEach((index: any) => {
    //   index = index * 1 as number;
    //   categoryList[index] = distData[index]
    // });
    distData.forEach((category: any, index: number) => categoryList[index] = distData[index]);
  }
}

/**
 @description: 得到所有分类信息
 */
// 用于判断merchandise是否接收完毕，达到调用顺序一致
const merchandiseReceiveDone = ref(false);
provide("merchandiseReceiveDone", merchandiseReceiveDone);
onMounted(async () => {
  if (isUpdate.value) {
    // 由于需要向后台发起请求需要响应事件，因此该任务被包装为了(至少是一个微任务)，需要使用await 阻塞后续代码执行
    // 等待该请求完成后其后的数据才会执行
    await getCurMerchandiseMessage();
    //@ts-ignore
    Object.keys(curMerchandise).forEach((key: string) => curMerchandise[key] = merchandiseMessage[key]);
    console.log(curMerchandise);
    merchandiseReceiveDone.value = true; // 数据获取完毕
  }
  getCategoryMessage();

});

/**
 @description: 目标  ： 删除图片逻辑 ，图片请求返回问题，添加和删除用户时，需要把图片信息也进行绑定
 */
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
            <el-button type="primary" link @click="go(-1)" :icon="ArrowLeft">
              返回
            </el-button>
            <div :style="{marginLeft:'10px',fontSize:'20px'}"> {{ isUpdate ? '更新商品' : '添加商品' }}</div>
          </div>
        </template>
        <template #default>
          <el-form ref="formRef" :model="isUpdate ? merchandiseMessage : curMerchandise" :rules="rules"
                   label-width="200px">
            <el-form-item label="商品名" prop="name">
              <el-input v-model=" curMerchandise.name"/>
            </el-form-item>
            <el-form-item label="商品描述" prop="desc">
              <el-input v-model="curMerchandise.desc"/>
            </el-form-item>
            <el-form-item label="商品价格" prop="price">
              <el-input v-model="curMerchandise.price">
                <template #prepend>￥</template>
              </el-input>
            </el-form-item>
            <!--        使用系统默认邮箱验证  需要指定使用的验证对象 props  和验证规则 rules-->
            <el-form-item label="商品分类">
              <el-select v-model="curMerchandise.categoryId" placeholder="请选择一个分类"
                         size="large">
                <el-option
                    v-for="(category) in categoryList"
                    :key="category._id"
                    :label="category.name"
                    :value="category._id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="商品图片" required>
              <UploadImage ref="upload"/>
            </el-form-item>
            <el-form-item label="商品详情" required>
              <RichText/>
            </el-form-item>
          </el-form>
          <el-button type="primary" :style="{marginLeft:'50%'}" @click="handlerSubmit">提交</el-button>
        </template>
      </el-card>


    </template>
  </Layout>
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
