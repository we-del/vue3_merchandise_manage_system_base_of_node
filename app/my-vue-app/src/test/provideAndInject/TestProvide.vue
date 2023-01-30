<!--<script lang="ts" setup>-->
<!--import {provide, ref,reactive} from "vue";-->
<!--import dayjs from "dayjs";-->
<!--import TestInject from "./TestInject.vue";-->

<!--const count = ref(0);-->
<!--provide("count", count);-->

<!--const now = reactive({time:Date.now()});-->
<!--provide("now", now);-->
<!--const resetCount = () => {-->
<!--  count.value = 0;-->
<!--}-->
<!--const start = dayjs('2019-06-25');-->
<!--const end = dayjs(Date.now());-->
<!--console.log();-->
<!--console.log(start);-->
<!--let totalTime = end.diff(start) / 1000; // s-->
<!--const h = 3600;-->
<!--// const year = console.log(totalTime / (h*24*365));-->
<!--const year = Math.floor(totalTime / (h * 24 * 365));-->
<!--console.log(Math.floor(totalTime % (h * 24 * 365))/(h*24*30));-->
<!--const month = Math.floor(totalTime % (h * 24 * 365))/(h*24*30);-->
<!--</script>-->

<!--<template>-->
<!--  <h1>当前计数为{{ count }}</h1>-->
<!--  <TestInject :reset="resetCount"/>-->
<!--</template>-->


<!--<style scoped lang="scss">-->

<!--</style>-->
