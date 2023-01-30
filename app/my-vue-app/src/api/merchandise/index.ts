/* 
 * 2022/7/27 18:26
 * author: xxx
 * @description:
 */

import ajax from "@/api";

/*
    注意：请求配置对象可以对http各项配置向进行重写，如果没有重写的配置项，
        则会使用默认配置(data(body参数),params(query参数),url(请求的路径),methods(使用的方法)...)
*  ajax.get("url",{请求配置对象}) 可以携带params,data等参数，和进行配置
*  ajax.post("url",{body对象},{请求配置对象})
* */
import {BASE_URL} from "@/config";
import {
    AddMerchandiseReq, GetMerchandiseListReq, SearchMerchandiseReq, UpdateMerchandiseReq,
    UpdateMerchandiseStateReq
} from "@/interface";

//获得商品列表
export const getMerchandiseListReq = (params: GetMerchandiseListReq) =>
    ajax.get(`${BASE_URL}/manage/product/list`, {params});


// 搜素指定商品列表
export const searchMerchandiseReq = (params: SearchMerchandiseReq) =>
    ajax.get(`${BASE_URL}/manage/product/search`, {params});

// 得到一个商品
export const getSingleMerchandiseReq = (params: { productId: string }) =>
    ajax.get(`${BASE_URL}/manage/product/info`, {params});

// 添加一个商品
export const addMerchandiseReq = (obj: AddMerchandiseReq) =>
    ajax.post(`${BASE_URL}/manage/product/add`, obj);

// 更新一个商品
export const updateMerchandiseReq = (obj: UpdateMerchandiseReq) =>
    ajax.post(`${BASE_URL}/manage/product/update`, obj);

// 更新一个商品的状态
export const updateMerchandiseStateReq = (obj: UpdateMerchandiseStateReq) =>
    ajax.post(`${BASE_URL}/manage/product/updateStatus`, obj);

// 删除一个商品
export const removeMerchandiseReq = (obj: { productId: string }) =>
    ajax.post(`${BASE_URL}/manage/product/remove`, obj);



// 删除商品图片
export const removeImageOfMerchandiseReq = (obj: { name: string }) =>
    ajax.post(`${BASE_URL}/manage/img/delete`, obj);