/*
 * 2022/7/3 14:12
 * author: xxx
 * @description:
 */
import {createRouter, createWebHistory} from "vue-router";
import testRouter from "@/router/test";
import threeTestRouter from "@/router/TestThree";
import projectRouter from "@/router/project";
import NotFound from "@/router/NotFound.vue";
import UserLoginDataStore from "@/store/UserLoginDataStore";


// 获得用户登录状态
let userLoginDataStore: any;
setTimeout(() => {
    userLoginDataStore = UserLoginDataStore();
})

const router = createRouter({
    history: createWebHistory(),
    routes: [
        ...testRouter,
        ...projectRouter,
        ...threeTestRouter,
        {
            path: '/',
            redirect: "/login",
        },
        {
            name: 'not-found',
            path: '/:pathMatch(.*)*',
            component: NotFound
        }
    ]
});
router.beforeEach((to, from, next) => {

    // 做完后在开启，做身份校验
    // if (!(to.path === "/login" || to.path === "/")) {
    //     setTimeout(() => {
    //         if (!userLoginDataStore.token) router.replace("/").then(() => {
    //         }, () => {
    //         });
    //     })
    // }
    next();
})

export default router;
