/* 
 * 2022/7/26 20:33
 * author: xxx
 * @description:
 */

import ajax from "@/api";
import {BASE_URL} from "@/config";
import {UpdateCategoryReq} from "@/interface";

// 获得分类列表
export const getCategoryListReq = () => ajax.get(`${BASE_URL}/manage/category/list`);

// 添加分类
export const addSingleCategoryReq = (obj: { categoryName: string }) =>
    ajax.post(`${BASE_URL}/manage/category/add`, obj);

// 更新分类
export const updateSingleCategoryReq = (obj: UpdateCategoryReq) =>
    ajax.post(`${BASE_URL}/manage/category/update`, obj);

// 获得单独分类
export const getSingleCategoryReq = (params: { categoryId: string }) =>
    ajax.get(`${BASE_URL}/manage/category/info`, {params});

// 删除分类
export const removeSingleCateogryReq = (obj: { categoryId: string }) =>
    ajax.post(`${BASE_URL}/manage/category/remove`, obj);