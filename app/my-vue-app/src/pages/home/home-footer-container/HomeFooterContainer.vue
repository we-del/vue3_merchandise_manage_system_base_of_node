<script lang="ts" setup>
  import SearchWorkGraph from "@/pages/home/home-footer-container/SearchWorkGraph.vue";
  import SellPercentGraph from "@/pages/home/home-footer-container/SellPercentGraph.vue";
</script>

<template>
  <div id="footer-wrapper">
    <div class="search-word-graph">
      <SearchWorkGraph/>
    </div>
    <div class="sell-graph">
      <SellPercentGraph/>
    </div>
  </div>
</template>


<style scoped lang="scss">
#footer-wrapper {
  display: flex;
  height: 300px;
  width: 100%;
  background-color: #f4f4f4;

  .search-word-graph {
    flex: 1;
    margin-right: 10px;
  }

  .sell-graph {
    flex: 1;
  }
}
</style>
