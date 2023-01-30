/* 
 * 2022/7/25 16:30
 * author: xxx
 * @description:
 */

import ajax from "@/api";
import {BASE_URL} from "@/config";
import {UpdateRoleReq} from "@/interface";



// 添加一个角色
export const addRoleReq = (obj:{roleName:string})=>  ajax.post(`${BASE_URL}/manage/role/add`,obj);

// 得到角色列表
export const getRoleListReq = ()=> ajax.get(`${BASE_URL}/manage/role/list`);

// 更新角色权限
export const updateRoleAuthReq = (obj:UpdateRoleReq)=> ajax.post(`${BASE_URL}/manage/role/update`,obj);

// 删除指定id的角色
export const removeRoleReq = (obj:{roleId:string})=> ajax.post(`${BASE_URL}/manage/role/remove`,obj);


