/* 
 * 2022/7/4 19:08
 * author: xxx
 * @description:
 */

export const BASE_URL = "http://localhost:4000";
export const _BASE_URL = "http://gmall-h5-api.atguigu.cn/";

export const ROUTERS = {
    HOME: "/home",
    AUTH_MANAGE: "auth-manage",
    MERCHANDISE_MANAGE: "/item/merchant-manage",
    USER_MANAGE: "/auth-manage/user-manage",
    ROLE_MANAGE: "/auth-manage/role-manage",
    MENU_MANAGE: "/auth-manage/menu-manage",
    PLATFORM_MANAGE: "/merchant-manage/platform-manage",
    SPU_MANAGE: "/merchant-manage/spu-manage",
    SKU_MANAGE: "/merchant-manage/sku-manage",
    CATEGORY_MANAGE:"/item/category",
    ITEM_MANAGE:"/item"
};

// 一页展示的数据个数
export const PAGE_SIZE = 10;

// Mock测试数据地址配置
export const MOCK_API = {
    SELL: "/sell",
    VISIT: "/visit",
    PAY: "/pay",
    ACTIVITY: "/activity",
    SELL_YEAR_AXIS: "/sellYearAxis",
    SELL_YEAR_DATA: "/sellFullYear",
    VISIT_YEAR_AXIS: "/visitYearAxis",
    VISIT_YEAR_DATA: "/visitYearData",
    SELL_RANK: "/sellRank",
    VISIT_RANK: "/visitRank",
    SEARCH_WORK: "/searchWork",
    SALARY_RANK: "salaryRank"
}