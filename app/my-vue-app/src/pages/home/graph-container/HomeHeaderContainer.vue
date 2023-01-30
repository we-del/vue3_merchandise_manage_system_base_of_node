<script lang="ts" setup>

import TotalSell from "@/pages/home/graph-container/TotalSell.vue";
import TotalVisit from "@/pages/home/graph-container/TotalVisit.vue";
import TotalDeal from "@/pages/home/graph-container/TotalDeal.vue";
import TotalEffect from "@/pages/home/graph-container/TotalEffect.vue";
</script>

<template>
  <div id="detailGraphMessage">
    <TotalSell/>
    <TotalVisit/>
    <TotalDeal/>
    <TotalEffect/>
  </div>
</template>


<style scoped lang="scss">
#detailGraphMessage {
  display: flex;
  justify-content: space-between;
}
</style>
