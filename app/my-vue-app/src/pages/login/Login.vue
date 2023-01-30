<script lang="ts" setup>
import {reactive, ref} from 'vue'
import {useRouter} from "vue-router";
import type {FormInstance} from 'element-plus'
import {ElMessage} from "element-plus";
import {Avatar, Lock} from "@element-plus/icons-vue";
import {identity} from "@/pages/login/loginReqHandler"

const ruleFormRef = ref<FormInstance>()
const router = useRouter();
const pattern = /^[1-9a-zA-Z_]+$/;
const validateAccount = (rule: any, value: string, callback: any) => {
  if (!value || value.length < 4 || value.length > 13) {
    return callback(new Error('请输入4-13位字符'))
  } else if (!pattern.test(value)) {
    return callback(new Error('只能为数字，字母或下环线'))
  }
  callback();
}
const validatePassword = (rule: any, value: string, callback: any) => {

  if (!value || value.length <= 4 || value.length >= 13) {
    callback(new Error('请输入4-13位字符'))
  } else if (!pattern.test(value)) {
    callback(new Error('只能为数字，字母或下环线'))
  }
  callback();
}

const ruleForm = reactive({
  account: '',
  password: ''
})

const rules = reactive({
  account: [{validator: validateAccount, trigger: 'change'}],
  password: [{validator: validatePassword, trigger: 'change'}],
})

const isValid = ref(false);
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    // 满足条件valid为真
    if (valid) {
      verify(ruleForm.account, ruleForm.password);
    }
  })
}

const verify = async (username: string, password: string) => {
  const status = await identity({username, password});
  if (!status) {
    ElMessage({
      message: "登录成功",
      type: "success",
      duration: 1000
    });
    router.push("/home").then(() => {
    }, () => {
    });
  } else {
    ElMessage({
      message: "输入有误",
      type: "error",
      duration: 1000
    });
  }
}
</script>
<template>
  <div class="login-bg"></div>
  <div id="login-wrapper"  >
    <h2>登录</h2>
    <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        status-icon
        :rules="rules"
        class="form-region"
        @keyup.enter="submitForm(ruleFormRef)"
    >
      <el-form-item label="账号" prop="account">
        <el-input v-model="ruleForm.account" type="text" autocomplete="off" :prefix-icon="Avatar"/>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="ruleForm.password" type="password" :prefix-icon="Lock"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)"
                   class="login-btn"
        >提交
        </el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>


<style scoped lang="scss">
#login-wrapper {
  position: absolute;
  left: 50%;
  top: 50%;
  height: 300px;
  width: 500px;
  transform: translate(-50%, -50%);

  h2 {
    text-align: center;

  }

  .form-region {
    width: 100%;

    .login-btn {
      width: 80%;
      margin-left: 10%;
    }
  }
}

.login-bg {
  position: absolute;
  width: 100vw;
  height: 100vh;
  background-image: url("@/assets/bg.png");
  background-size: cover;
}
</style>
