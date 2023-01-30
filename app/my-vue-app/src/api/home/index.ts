/* 
 * 2022/7/12 17:01
 * author: xxx
 * @description:
 */

import ajax from "@/api";
import {MOCK_API, BASE_URL} from "@/config";

const {
    SELL, VISIT, PAY, ACTIVITY, SELL_YEAR_AXIS, SELL_YEAR_DATA, VISIT_YEAR_AXIS, VISIT_YEAR_DATA,
    SELL_RANK, VISIT_RANK, SEARCH_WORK, SALARY_RANK
} = MOCK_API;
export const getSellReq = () => ajax.get(SELL)
export const getVisitReq = () => ajax.get(VISIT)
export const getPayReq = () => ajax.get(PAY)
export const getActivityReq = () => ajax.get(ACTIVITY)
export const getSellYearAxisReq = () => ajax.get(SELL_YEAR_AXIS)
export const getSellYearDataReq = () => ajax.get(SELL_YEAR_DATA)
export const getVisitYearAxisReq = () => ajax.get(VISIT_YEAR_AXIS)
export const getVisitYearDataReq = () => ajax.get(VISIT_YEAR_DATA)
export const getSellRankReq = () => ajax.get(SELL_RANK)
export const getVisitRankReq = () => ajax.get(VISIT_RANK)
export const getSearchWorkReq = () => ajax.get(SEARCH_WORK)
export const getSalaryRankReq = () => ajax.get(SALARY_RANK)
