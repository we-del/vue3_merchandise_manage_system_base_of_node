/* 
 * 2022/7/4 19:10
 * author: xxx
 * @description:
 */
import axios from "axios";
import userLoginDataStore from "@/store/UserLoginDataStore";
// @ts-ignore
import Qs from "qs";
import {ElMessage} from "element-plus";

const ajax = axios.create();


// 需做数据持久化   pinia和axios有执行优先级问题，需要包装为微任务使用
// let token = "";
// setTimeout(() => {
//
//     token = "atguigu_" + loginStore().token;
// })
ajax.interceptors.request.use((config) => {
    let {method, data} = config;


    const loginStore = userLoginDataStore();
// 此token用于临时开发(获得接口权限)，在项目完成后，新增token验证功能，以处理此问题
    const token =
        loginStore.token || "atguigu_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzQ0NGJiMmFm" +
        "YjkxODg0YzI3OGQ3ZiIsImlhdCI6MTY1ODk5NTY0MywiZXhwIjoxNjU5NjAwNDQzfQ.1XWBT-R2dQm1" +
        "ObJC97R43_lqD0IhGyhdhismjXpxVls";

    if (method?.toLocaleUpperCase() === "POST") {
        config.data = Qs.stringify(data);
    }
    // @ts-ignore    增加token , 在项目完成后,对用户token存储做一个细化
    config.headers.Authorization = "atguigu_" + token;
    return config;
})
ajax.interceptors.response.use((val) => {
    return val;
}, (err) => {
    console.log(err);
    ElMessage.warning("网络异常稍后再试");
    return new Promise(() => {
    });
});
export default ajax;
