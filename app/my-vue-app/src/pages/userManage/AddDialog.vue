<script lang="ts" setup>
/**
 @description: 用于显示新增和更新用户的提示框
 */
import {defineProps, ref, defineEmits, reactive} from 'vue'
import {AddUserReqData} from "@/interface";
import type {FormInstance} from 'element-plus'
import {ElMessage} from 'element-plus'
import {addUserToUserListReq} from "@/api/user";

const {userUpdateOpe, curUpdateRow} = defineProps<{
  dialogVisible: boolean,
  userUpdateOpe: boolean,
  curUpdateRow: { [propsName: string]: any },
  roleObj: { [propsName: string]: any }
}>();
// defineProps代理的数据是只读的(readonly),如果想让其编程响应式的则需要使用toRef()进行包装，或使用ref

const emit = defineEmits(["updateDialogVisible", "updateUserList"]);

console.log("@@@", userUpdateOpe, curUpdateRow);
console.log("@@@", typeof userUpdateOpe, typeof curUpdateRow);
// 存储当前新增的用户信息
// const curUser = reactive<AddUserReqData>({
//   username: userUpdateOpe ? curUpdateRow.username : '',
//   password: userUpdateOpe ? curUpdateRow.password : '',
//   phone: userUpdateOpe ? curUpdateRow.phone : '',
//   email: userUpdateOpe ? curUpdateRow.email : '',
//   role_id: userUpdateOpe ? curUpdateRow.role_id : ''
// });
// const curUser = reactive<AddUserReqData>({
//   username: curUpdateRow.username,
//   password: curUpdateRow.password,
//   phone: curUpdateRow.phone,
//   email: curUpdateRow.email,
//   role_id: curUpdateRow.role_id
// });
const curUser = reactive<AddUserReqData>({
  username: '',
  password: '',
  phone: '',
  email: '',
  role_id: ''
});


//  得到el-from的映射
const formRef = ref<FormInstance>();

/**
 @description: 当点击提交按钮时调用，用于更新数据
 */
const updateVisible = () => {
  // 提交时对当前的所有规则进行校验，如果满足要求则进行提交
  formRef.value?.validate((valid) => {

    if (valid) {
      // 添加用户
      addUserToList();

    }

  })

}


/**
 @description: 添加用户调用
 */

const addUserToList = async () => {
  const res: any = await addUserToUserListReq(curUser);
  console.log(res);
  if (res.data.status === 0) {

    // 重新获得用户列表数据
    emit("updateUserList");

    // 进行提示
    ElMessage({
      message: "添加用户成功",
      type: "success"
    });

    // 进行dialog善后工作
    clear();
  }
}


/**
 @description: 用来进行提交列表后的善后工作(清除列表状态等)
 */
const clear = () => {
  // 因此dialog框
  emit("updateDialogVisible", false);

  // 清除所有字段信息已经提示信息
  formRef.value?.resetFields();

  // 清空所有信息（避免清除不干净）
  //@ts-ignore
  Object.keys(curUser).forEach((key: any) => curUser[key] = '');
}

/**
 @description: 当前dialog被关闭时调用
 */

const handlerDialogClose = () => {
  emit("updateDialogVisible", false);

  // 清除所有字段信息已经提示信息
  formRef.value?.resetFields();

  // 清空所有信息（避免清除不干净）
  //@ts-ignore
  Object.keys(curUser).forEach((key: any) => curUser[key] = '')
}


// 当前用户的自定义验证
const validate = {
  /**
   @description: 注意 所有验证必须指定一个成功的出口(调用callback不传入任何参数 callback())，
   否则在搭配 form.validate()时无法正确的判断是否全部成功
   */
  nameValidate(rule: any, value: any, callback: any) {
    /**
     @description: 验证姓名规则，不能有空格，不能为空，长度不能大于7
     @tips: /\s/ 为一个正则，表示匹配一个空格
     */

    if (value.indexOf(/\s/) !== -1)
      callback(new Error('不能包含空格'));
    else if (value.length <= 0)
      callback(new Error('不能为空'));
    else if (/\W/.exec(value))
      callback(new Error('不能包含非法字符(如`@#!等)'));
    else if (value.length >= 7)
      callback(new Error('长度不能大于7'));
    else
      callback();
  },
  pwdValidate(rule: any, value: any, callback: any) {
    /**
     @description: 验证密码规则： 长度小于13，只能包含数字字母下划线
     */
    if (!(/^\w+$/.test(value)))
        // 不是以数字字母下划线开头则触发此分支

      callback(new Error("只能包含数字字母下划线"));
    else if (value.length > 13 || value.length < 4)
        // 长度大于13触发分支
      callback(new Error("长度需大于等于4小于等于13位"));
    else
      callback();
  },
  phoneValidate(rule: any, value: any, callback: any) {
    console.log(rule, value, callback);
    /**
     @description: 验证手机号规则：长度为11位
     */
    if (!(value.length === 11 && value[0] === '1')) callback(new Error("请输入正确的手机号"));
    else
      callback();
  },
  emailValidate(rule: any, value: any, callback: any) {
    /**
     @description: 验证邮箱规则：长度在2到15位，符合邮箱格式(???@??.??)
     */
    const pattern = /(\w+)@(\w+).(\w+)/;
    if (!pattern.test(value)) callback(new Error('请输入正确的邮箱格式'));
    else
      callback();
  }
};

// 验证对象
const rules = reactive({
  // blur 失去焦点后开始验证
  // change 当输入发生改变时开始验证,切换后不进行验证

  // 注意
  /*
  *  rules中的验证规则需要和modal中的数据源的属性一一对应，否则无法传入正确的验证数据(底层通过当前数据源的值将其当作第二个参数进行传入)
  *  如 :module="{name:'',age:''}" 则对应 rule为 :rule="{name:[validator:nameVerify],age:[validator:ageVerity]}"
  * */
  username: [{
    required: true,
    message: '输入不能为空',
    trigger: 'blur',
  }, {validator: validate.nameValidate, trigger: 'blur'}],
  password: [{
    required: true,
    message: '输入不能为空',
    trigger: 'blur',
  }, {validator: validate.pwdValidate, trigger: 'blur'}],
  phone: [{
    required: true,
    message: '输入不能为空',
    trigger: 'blur',
  }, {validator: validate.phoneValidate, trigger: 'blur'}],
  email: [{
    required: true,
    message: '输入不能为空',
    trigger: 'blur',
  }, {validator: validate.emailValidate, trigger: 'blur'}]
});
</script>
<template>

  <el-dialog
      v-model="dialogVisible"
      :title="'添加用户'"
      width="30%"
      :before-close="handlerDialogClose"
  >
    <template #default>
      <el-form ref="formRef" :model="curUser" :rules="rules" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="curUser.username"/>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="curUser.password"/>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="curUser.phone"/>
        </el-form-item>
        <!--        使用系统默认邮箱验证  需要指定使用的验证对象 props  和验证规则 rules-->
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="curUser.email"/>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="curUser.role_id" placeholder="选择一个角色" size="large">
            <el-option
                v-for="(value,key) in roleObj"
                :key="key"
                :label="value"
                :value="key"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handlerDialogClose()">取消</el-button>
        <el-button type="primary" @click="updateVisible()"
        >提交</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>


<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
