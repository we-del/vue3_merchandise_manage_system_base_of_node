/* 
 * 2022/8/27 21:25
 * author: xxx
 * @description:
 */

import ajax from "@/api";

// 使用前端代理时，请求基本路径需要和前端开启服务路径一致，在本地没有找到此资源的情况下会去代理路径请求
const url = "http://localhost:8888";
const routerPrefix = "/emp";

// 获得全部列表
export const getEmpList = () => ajax.get(url + routerPrefix + "/list");

// 获得以名字搜索的列表
export const getEmpListByName = (name: string) => ajax.get(url + routerPrefix + "/list/by/name/" + name);
// 获得以组织搜索的列表
export const getEmpListByOrg = (org: string) => ajax.get(url + routerPrefix + "/list/by/org/" + org);


// 得到所有组织的列表
export const getDeptList = () => ajax.get(url + routerPrefix + "/list/dept");

// 更新一个好汉
export const updateOnePeople = (emp: any) => ajax.put(url + routerPrefix + "/list/update", {emp});
// 新增一个好汉
export const addOnePeople = (emp: any) => ajax.post(url + routerPrefix + "/list/insert", {emp});

// 删除一个好汉
export const removePeopleById = (id: any) => ajax.delete(url + routerPrefix + `/list/${id}`);