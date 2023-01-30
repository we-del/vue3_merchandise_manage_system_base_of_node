/* 
 * 2022/7/22 11:26
 * author: xxx
 * @description:
 */
import ajax from "@/api";
import {BASE_URL} from "@/config";
import {AddUserReqData, UpdateUserReqData} from "@/interface";
// 获得用户列表
export const getUserListReq = () => ajax.get(`${BASE_URL}/manage/user/list`);

// 添加用户
export const addUserToUserListReq = (obj: AddUserReqData) => ajax.post(`${BASE_URL}/manage/user/add`, obj);

// 更新用户
export const updateUserToUserListReq = (obj: UpdateUserReqData) => ajax.post(`${BASE_URL}/manage/user/update`, obj);

// 删除用户
export const removeUserToUserListReq = (obj: { userId: string }) => ajax.post(`${BASE_URL}/manage/user/delete`, obj);