/* 
 * 2022/7/30 13:20
 * author: xxx
 * @description:
 */

const data = require("../public/data.json");
const Dayjs = require('dayjs')
module.exports = function (router) {
    router.get("/charts/day/sell", (req, res) => res.send({status: 0, data: data.dailySell}));
    router.get("/charts/day/visit", (req, res) => res.send({status: 0, data: data.dailyVisit}));
    router.get("/charts/pay/number", (req, res) => res.send({status: 0, data: data.payNumber}));
    router.get("/charts/activity", (req, res) => res.send({status: 0, data: data.activity}));
    router.get("/charts/sell/year", (req, res) => res.send({status: 0, data: data.sellFullYear}));
    router.get("/charts/sell/year/axis", (req, res) => res.send({status: 0, data: data.sellFullYearAxis}));
    router.get("/charts/visit/year", (req, res) => res.send({status: 0, data: data.visitFullYear}));
    router.get("/charts/visit/year/axis", (req, res) => res.send({status: 0, data: data.visitFullYearAxis}));
    router.get("/charts/sell/rank", (req, res) => res.send({status: 0, data: data.sellRank}));
    router.get("/charts/visit/rank", (req, res) => res.send({status: 0, data: data.visitRank}));
    router.get("/charts/search/word", (req, res) => res.send({status: 0, data: data.searchWord}));
    router.get("/charts/sale/rank", (req, res) => res.send({status: 0, data: data.saleRank}));

    // 今日访问
    router.get('/chart/day/visitor', (req, res) => {
        // 每
        const time = Dayjs(Date.now()).format('HH') * 1
        let date = [time]
        // 得到 24小时前得时间
        for (let i = 1; i < 8; i++) {
            if (date[i - 1] - 3 <= 0) date[i] = 24 + date[i - 1] - 3;
            else date[i] = date[i - 1] - 3;
        }
        const visitor_count = [22, 13, 6, 76, 33, 12, 55, 12]
        const product_view_count = [65, 45, 23, 123, 45, 32, 100, 45]
        const product_link_click_count = [45, 33, 20, 78, 41, 20, 88, 42]
        res.send({date, visitor_count, product_link_click_count, product_view_count})
    })

    // 产品访问
    router.get('/chart/product/visitor', (req, res) => {
        // 每
        const time = Dayjs(Date.now()).format('DD') * 1
        let o = Dayjs(Date.now()).format('YYYY/MM/')
        o += '1'
        let date = [o]

        // 得到 24小时前得时间
        for (let i = 1; i < 7; i++) {
            date[i] = date[i - 1].slice(0, date[i - 1].length - 1) + (i + 1);
        }
        const product_name = ['1号产品', '2号产品', '无双3', '三pro', '水宝', '3号产品', 'x产品']
        const product_view_count = [65, 25, 53, 113, 56, 64, 145, 57]
        const product_link_click_count = [89, 54, 104, 169, 59, 103, 405, 156]
        // const product_name = ['1号产品', '2号产品']
        // const product_view_count = [
        //     [65, 25, 53, 113, 56, 64, 145, 57],
        //     [56, 55, 67, 43, 26, 84, 235, 127]]
        // const product_link_click_count = [
        //     [89, 54, 104, 169, 59, 103, 405, 156],
        //     [90, 102, 215, 64, 53, 185, 891, 396]]
        res.send({date, product_name, product_link_click_count, product_view_count})
    })
}