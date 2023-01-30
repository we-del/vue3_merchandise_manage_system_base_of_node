/* 
 * 2022/7/30 13:32
 * author: xxx
 * @description:
 */

import ajax from "@/api";
import {BASE_URL} from "@/config";

export const getDaySellReq = () => ajax.get(`${BASE_URL}/charts/day/sell`);
export const getDayVisitReq = () => ajax.get(`${BASE_URL}/charts/day/visit`);
export const getPayNumberReq = () => ajax.get(`${BASE_URL}/charts/pay/number`);
export const getActivityReq = () => ajax.get(`${BASE_URL}/charts/activity`);
export const getSellYearReq = () => ajax.get(`${BASE_URL}/charts/sell/year`);
export const getSellYearAxisReq = () => ajax.get(`${BASE_URL}/charts/sell/year/axis`);
export const getVisitYearReq = () => ajax.get(`${BASE_URL}/charts/visit/year`);
export const getVisitYearAxisReq = () => ajax.get(`${BASE_URL}/charts/visit/year/axis`);
export const getSellRankReq = () => ajax.get(`${BASE_URL}/charts/sell/rank`);
export const getVisitRankReq = () => ajax.get(`${BASE_URL}/charts/visit/rank`);
export const getSearchWordReq = () => ajax.get(`${BASE_URL}/charts/search/word`);
export const getSaleRankReq = () => ajax.get(`${BASE_URL}/charts/sale/rank`);
