/* 
 * 2022/7/4 20:08
 * author: xxx
 * @description:
 */

import {LoginReq} from "@/interface";
import {loginReq} from "@/api/login/loginReq";
import UserLoginDataStore from "@/store/UserLoginDataStore";

export const identity = async (obj: LoginReq) => {
    const {data} = await loginReq(obj);
    const userLoginDataStore = UserLoginDataStore();
    console.log(data);
    if (data && data.data) {
        userLoginDataStore.token = data.data.token;
        userLoginDataStore.username = data.data.user.username;
    }
    return data && data.status;
}