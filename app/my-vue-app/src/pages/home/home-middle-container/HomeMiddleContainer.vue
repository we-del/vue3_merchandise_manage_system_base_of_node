<script lang="ts" setup>
import {ref} from "vue";
import SellDetail from "@/pages/home/home-middle-container/SellDetail.vue";
import VisitDetail from "@/pages/home/home-middle-container/VisitDetail.vue";

const curSelectedIsVisit = ref(false);

</script>

<template>
  <div id="home-middle-container">
    <div class="header-region">
      <div class="toggle-show">
        <div :class=" curSelectedIsVisit ? ` sell-target `:`selected sell-target`" @click="curSelectedIsVisit=false">
          销售额
        </div>
        <div :class=" curSelectedIsVisit ? `selected visit-target `:` visit-target` " @click="curSelectedIsVisit=true">
          访问量
        </div>
      </div>
      <div class="slider-bar-region">
        <div :class=" curSelectedIsVisit ? `target slider-bar `:`origin slider-bar` "></div>
      </div>
    </div>
    <div class="gap"></div>
    <SellDetail v-show="!curSelectedIsVisit"/>
    <VisitDetail v-show="curSelectedIsVisit"/>
  </div>
</template>


<style scoped lang="scss">

.gap {
  width: 100%;
  height: 20px;
  background-color: transparent;
}

.selected {
  color: #7e8c8d;
}

.origin {
  left: 0;
}

.target {
  left: 70px;
}

#home-middle-container {
  height: 300px;
  padding: 20px;
  background-color: white;

  .header-region {
    display: flex;
    flex-flow: column nowrap;
    height: 50px;

    .toggle-show {
      display: flex;
      margin-bottom: 10px;
      font-size: 14px;

      .sell-target {
        margin-right: 30px;
        cursor: pointer;
      }

      .visit-target {
        cursor: pointer;
      }
    }

    .slider-bar-region {
      position: relative;
      width: 100%;
      height: 3px;
      background-color: #e4e7ed;

      .slider-bar {
        position: absolute;
        height: 100%;
        width: 43px;
        background-color: #ace;
        //过渡通常配合js使用，他可以让动画按照指定要求运行，如果没加过渡则数据和动画都在1ms内完成，加了后数据在1ms内完成，动画则按你指定的方式完成
        transition: .5s all;
      }
    }
  }
}
</style>
