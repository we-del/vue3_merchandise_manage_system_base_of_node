/* 
 * 2022/7/4 18:56
 * author: xxx
 * @description:
 */

import ajax from "@/api";
import {BASE_URL} from "@/config";
import {LoginReq} from "@/interface";

// 验证当前用户输入
export const loginReq = (obj: LoginReq) =>
    ajax.post(`${BASE_URL}/login`, {...obj})
