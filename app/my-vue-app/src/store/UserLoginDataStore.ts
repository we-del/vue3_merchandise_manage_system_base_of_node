/* 
 * 2022/7/4 20:28
 * author: xxx
 * @description:
 */

import {defineStore} from "pinia";

export default defineStore("userLoginData", {
    state() {
        return {
            token: "",
            username: ""
        }

    },
    getters: {},
    actions: {}
})