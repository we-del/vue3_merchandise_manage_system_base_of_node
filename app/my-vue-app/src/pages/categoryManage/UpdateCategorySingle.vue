<script lang="ts" setup>
/**
 @description: 用于显示新增和更新角色的提示框
 */
import {defineProps, ref, defineEmits, reactive, inject, onUpdated} from 'vue'
import type {FormInstance} from 'element-plus'
import {ElMessage} from 'element-plus'
import {addSingleCategoryReq, updateSingleCategoryReq} from "@/api/category";

defineProps<{
  dialogVisible: boolean,
}>();
// defineProps代理的数据是只读的(readonly),如果想让其编程响应式的则需要使用toRef()进行包装，或使用ref

const emit = defineEmits(["updateDialogVisible", "updateCategoryList"]);


// 当前更新的分类
const curUpdateRow: any = inject("curUpdateRow");

const categoryUpdateOpe: any = inject("categoryUpdateOpe");

const curCategory = reactive<{ categoryName: string, categoryId?: string }>({
  categoryName: '',
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
      // 添加角色
      if (categoryUpdateOpe.value) {
        updateCategoryToList();
      } else {
        addCategoryToList();
      }

    }

  })

}


/**
 @description: 添加分类调用
 */

const addCategoryToList = async () => {
  const res: any = await addSingleCategoryReq(curCategory);
  updateList(res);
}

/**
 @description: 更新分类信息调用
 */

const updateCategoryToList = async () => {
  curCategory.categoryId = curUpdateRow._id;
  const res: any = await updateSingleCategoryReq(curCategory);
  updateList(res);
}

/**
 @description: 更新列表展示数据
 */
const updateList = (res: any) => {
  console.log(res);
  if (res.data.status === 0) {
      console.log(res.data);
    // 重新获得角色列表数据
    emit("updateCategoryList");

    // 进行提示
    ElMessage({
      message: "操作成功",
      type: "success"
    });

    // 进行dialog善后工作
    clear();
  } else {
    ElMessage({
      message: "网络异常，请稍后再试",
      type: "warning"
    });
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
  Object.keys(curCategory).forEach((key: any) => curCategory[key] = '');
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
  Object.keys(curCategory).forEach((key: any) => curCategory[key] = '')
}


// 当前角色的自定义验证
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
    else if (value.length >= 7)
      callback(new Error('长度不能大于7'));
    else
      callback();
  },

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
  categoryName: [{
    required: true,
    message: '输入不能为空',
    trigger: 'blur',
  }, {validator: validate.nameValidate, trigger: 'blur'}]
});


// 每次template重绘会进行调用
onUpdated(() => {
  console.log("onUpdated", categoryUpdateOpe);
  if (categoryUpdateOpe.value) { // 如果为真改变当前curCategory的值为当前选中的值
    curCategory.categoryName = curUpdateRow.name;
  } else { // 否则为空
    curCategory.categoryName = "";
    console.log(curCategory);
  }
})
</script>
<template>

  <el-dialog
      v-model="dialogVisible"
      :title="categoryUpdateOpe ? '修改分类':'添加分类'"
      width="30%"
      :before-close="handlerDialogClose"
  >
    <template #default>
      <el-form ref="formRef" :model="curCategory" :rules="rules" label-width="100px">
        <el-form-item label="分类名" prop="categoryName">
          <el-input v-model="curCategory.categoryName"/>
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
