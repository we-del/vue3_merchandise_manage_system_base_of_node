<script lang="ts" setup>
import {ref,onMounted,onUnmounted} from "vue";
import {useRouter, useRoute} from "vue-router";
import UserLoginDataStore from "@/store/UserLoginDataStore";
import dayjs from "dayjs";



let curTime = ref<string>(dayjs().format('YYYY MM-DD HH:mm:ss '));


// 得到router对象中的replace函数
const {replace} = useRouter();

const loginout = () => {
  replace("/login"); // 回到登录页面
}
const userLoginDataStore = UserLoginDataStore();

let timer:any = null;
onMounted(()=>{
  timer = setInterval(() => {
    curTime.value = dayjs().format('YYYY MM-DD HH:mm:ss ');
  }, 1000);
})
onUnmounted(()=>{
  clearInterval(timer);
})
</script>

<template>
  <div id="nav-wrapper">
    <div id="title-wrapper">
      <slot name="title">
      </slot>
    </div>
    <div id="message-wrapper">
      <span>
      {{ curTime }}
      </span>
      <el-button link>{{ userLoginDataStore.username }}</el-button>
      <el-button link @click="loginout">退出登录</el-button>
    </div>
  </div>
</template>


<style scoped lang="scss">
#nav-wrapper {
  display: flex;

  #title-wrapper {
    flex: 6;
    margin-top: 20px;
    color: #ace;
    margin-left: 20px;
  }

  #message-wrapper {
    flex: 2;
    margin-top: 10px;

    span {
      font-size: 14px;
      color: #ccc;
      margin-right: 20px;
    }
  }
}
</style>
