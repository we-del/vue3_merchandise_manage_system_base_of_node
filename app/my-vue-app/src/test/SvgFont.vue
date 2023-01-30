<script lang="ts" setup>
import {ref, onMounted} from "vue";

const gif1 = ref("");
const gif2 = ref("");
const gif3 = ref("");
onMounted(async () => {
  // import 返回的是一个 fulfill状态的promise ,其值是一个Module对象，对象下default为目标地址，Symbol为es6的一个对象标记
  const i1 = await import('@/assets/loading1.gif');
  const i2 = await import('@/assets/loading2.gif');
  const i3 = await import('@/assets/loading3.gif');
  gif1.value = i1.default;
  gif2.value = i2.default;
  gif3.value = i3.default;
});
console.log();
</script>

<template>
  <h1>svg图标测试</h1>
  <svg class="icon" aria-hidden="true">
    <use xlink:href="#icon-descending"></use>
  </svg>
  <svg class="icon" aria-hidden="true">
    <use xlink:href="#icon-info"></use>
  </svg>
  <svg class="icon" aria-hidden="true">
    <use xlink:href="#icon-ascending"></use>
  </svg>
  <img :src="gif1" >
  <img :src="gif2" >
  <img :src="gif3" >
</template>