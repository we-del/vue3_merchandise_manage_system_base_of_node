/* 
 * 2022/7/7 15:54
 * author: xxx
 * @description:
 */

//@ts-ignore
import Mock from "mockjs";
import data from "./data.json";
import {MOCK_API} from "@/config";

/**
  @description: Mockjs 可以拦截对应的ajax请求，并做出对应响应
*/

const {
    SELL, VISIT, PAY, ACTIVITY, SELL_YEAR_AXIS, SELL_YEAR_DATA, VISIT_YEAR_AXIS, VISIT_YEAR_DATA,
    SELL_RANK, VISIT_RANK, SEARCH_WORK, SALARY_RANK
} = MOCK_API;
console.log(data);
Mock.mock(SELL, {data: data.dailySell, status: 0});
Mock.mock(VISIT, {data: data.dailyVisit, status: 0});
Mock.mock(PAY, {data: data.payNumber, status: 0});
Mock.mock(ACTIVITY, {data: data.activity, status: 0});
Mock.mock(SELL_YEAR_AXIS, {data: data.sellFullYearAxis, status: 0});
Mock.mock(SELL_YEAR_DATA, {data: data.sellFullYear, status: 0});
Mock.mock(VISIT_YEAR_AXIS, {data: data.visitFullYearAxis, status: 0});
Mock.mock(VISIT_YEAR_DATA, {data: data.visitFullYear, status: 0});
Mock.mock(SELL_RANK, {data: data.sellRank, status: 0});
Mock.mock(VISIT_RANK, {data: data.visitRank, status: 0});
Mock.mock(SEARCH_WORK, {data: data.searchWord, status: 0});
Mock.mock(SALARY_RANK, {data: data.saleRank, status: 0});
