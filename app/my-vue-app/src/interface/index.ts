/* 
 * 2022/7/4 19:16
 * author: xxx
 * @description: 用于定义全局接口
 */


export interface LoginReq {
    username: string,
    password: string
}

export interface RankData {
    no: number,
    name: string,
    money: string
}

export interface SearchWordData {
    word: string,
    count: number,
    user: number
}

export interface SellPercentData {
    name?: string,
    value?: number
}

// 限制添加用户请求的接口
export interface AddUserReqData {
    username: string,
    password: string,
    phone: string,
    email: string,
    role_id: string
}

// 限制更新用户请求的接口
export interface UpdateUserReqData {
    _id: string,
    username: string,
    phone: string,
    email: string,
    role_id: string
}

// 限制更新用户的接口
export interface UpdateRoleReq {
    _id: string,
    auth_name: string,
    menus: string[],
    auth_time: number
}

// 更新分类
export interface UpdateCategoryReq {
    categoryId?: string,
    categoryName: string
}

// 得到商品列表
export interface GetMerchandiseListReq {
    pageNum: number,
    pageSize: number
}


// 搜索商品
export interface SearchMerchandiseReq {
    productName?: string,
    productDesc?: string,
    pageNum: number,
    pageSize: number
}

// 添加一个商品
export interface AddMerchandiseReq {
    categoryId: string,
    name: string,
    price: string,
    desc: string,
    detail: string,
    imgs?: []
}

// 更新一个商品
export interface UpdateMerchandiseReq {
    _id:string,
    categoryId: string,
    name: string,
    price: string,
    desc: string,
    detail: string,
    imgs?: [] // 需要对当前后台图片进行关联
}

// 更新一个商品状态
export interface UpdateMerchandiseStateReq {
    productId: string,
    status: number
}