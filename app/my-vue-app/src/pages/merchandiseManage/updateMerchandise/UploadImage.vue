<script lang="ts" setup>
import {ref, defineExpose, inject, watch, reactive, onMounted, toRefs} from 'vue'
import {Plus} from '@element-plus/icons-vue'

import type {UploadProps, UploadUserFile} from 'element-plus'
import {ElMessage} from 'element-plus'

import {removeImageOfMerchandiseReq} from "@/api/merchandise";
import {BASE_URL} from "@/config";


const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const upload = ref(); // 拿到upload暴露出来的对象
const curMerchandise = inject<any>("curMerchandise");


// 存图片
const fileList = ref<UploadUserFile[]>([])


/**
 @description: 删除图片时调用，通过判断file下的status判断是否为已上传图片(ready,success)
 */
const uploadImgs: any = reactive<any>([]); // 存储着所有后端待删除图片


// 判断是否执行的移除图片操作，好进行一个后续提交时，判断走向
const isRemovingImage = inject<any>("isRemovingImage");
const handleRemove: UploadProps['onRemove'] = (file, files) => {
  ElMessage({
    type: "warning",
    message: "删除了一张图片",
    duration: 2000
  });
  if (file.status === 'success') {
    imagesIsChange.value = true;
    isRemovingImage.value = true;
    uploadImgs.push(file.name);
  }
}

/**
 @description: 点击提交时调用，删除后端的待删除图片
 */
const imagesRemoveDone = inject<any>("imagesRemoveDone");
const removeMerchandisePicture = () => {
  // 删除后端图片，并把对应图片名从imgs身上移除

  // 先进行数组的剔除(删除请求滞后也不影响操作)
  // uploadImgs.forEach((name: string) => {
  //   curMerchandise.imgs.splice(curMerchandise.imgs.findIndex((img: string) => img === name), 1);
  // });
  uploadImgs.forEach(async (name: string, index: number) => {
    // 移除后台的对应文件
    const res = await removeImageOfMerchandiseReq({name});
    console.log(res);
    // 踩坑 ： 线程同步，需要使用定时器+数据源完成同步，或者使用await(在目标数据可控时)
    // 踩坑 ： splice和findIndex交互，当findIndex为-1时，也会进行splice删除，默认从0索引开始删除
    const i = curMerchandise.imgs.findIndex((img: string) => {
      return img === name;
    })
    if (i !== -1) curMerchandise.imgs.splice(i, 1);
    if (index === uploadImgs.length - 1) { // 说明此时以及移除完毕
      imagesRemoveDone.value = true;
    }
  });
}


// 预览图片时调用
const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}

// 超出最大图片限制调用
const handlePictureExceed: UploadProps['onExceed'] = (file, uploadFiles) => {
  ElMessage({
    type: "warning",
    message: "最多只能上传5张图片",
    duration: 2000
  });
}


/**
 @description: 提交所有图片给后端
 */
const uploadAllImage = () => {
  upload.value!.submit();

}

/**
 @description: 提交成功后的返回数据
 */

// 图片上传完成时调用
const imagesIsUploadDone = inject<any>("imagesIsUploadDone");

//  用于在更新时判断之前的图片是否发生了修改
const imagesIsChange = inject<any>("imagesIsChange");
const {imgs} = toRefs(curMerchandise);
const responseOfUpload = (res: any, curFile: any, files: any) => {

  console.log(res, curFile, files);
  if (res.status === 0) {
    curMerchandise.imgs.push(res.data.name);
    // 把url当作唯一的key，如果if为真说明第二个图片也已上传成功
    if (curFile.url === files[files.length - 1].url) {
      imagesIsUploadDone.value = true; // 表示所有图片请求以执行完毕，添加商品请求可以执行
      upload.value.clearFiles(); // 清除已上传的文件
    }

    // 判断长度是否发生变化
    // 只需判断第一个索引的数据和最后一个索引的数据的url是否相同即可
    if (curMerchandise.imgs.length > 0 && curMerchandise.imgs[0] !== files[files.length - 1].name) {
      // 此时说明不是同一个，则发生了更新
      imagesIsChange.value = true; // 更新数据源
    }
  }
}


// 用于判断当前更新商品的数据是否接收完毕
const merchandiseReceiveDone = inject<any>("merchandiseReceiveDone");
// 监听 curMerchandise的变化
onMounted(() => {
  const timer = setInterval(() => {
    if (merchandiseReceiveDone.value) {
      curMerchandise.imgs.forEach((img: string) => fileList.value.push({
        name: img,
        url: `${BASE_URL}/upload/${img}`,
      }));
      clearInterval(timer);
    }
  }, 200)
})
defineExpose({
  uploadAllImage,
  removeMerchandisePicture
});
</script>

<template>
  <el-upload
      ref="upload"
      v-model:file-list="fileList"
      :action="`${BASE_URL}/manage/img/upload`"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :limit="5"
      name="image"
      :auto-upload="false"
      :on-exceed="handlePictureExceed"
      :on-success="responseOfUpload"
  >
    <el-icon>
      <Plus/>
    </el-icon>
  </el-upload>
  <el-dialog v-model="dialogVisible">
    <img w-full :src="dialogImageUrl" alt="Preview Image"/>
  </el-dialog>
</template>
