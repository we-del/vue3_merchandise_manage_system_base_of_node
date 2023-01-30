<script lang="ts" setup>
import {defineProps} from "vue";
// defineProps用来接收父组件传入给子组件的参数，我们可以传入泛型限制其传入的类型，接收时，返回的是一个ref引用对象
// 在template中可以直接使用，vue底层会得到value代理值，在script中则需要使用 .value获得代理值
defineProps<{ isLoadingDone: boolean }>()
</script>

<template>
  <div id="data-wrapper">
    <div class="gap">
      <div class="header-title">
        <!--      slot在没有接收内容时会显示其标签里的内容，在接收到后会显示slot接收的内容-->
        <slot name="title">
          <div class="title">tile</div>
          <div class="icon-info">
            <i>
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-info"></use>
              </svg>
            </i>
          </div>
        </slot>
      </div>
      <div class="data-content">
        <slot name="content">
          <h3>￥ 10000(内容标题)</h3>
          <h3>展示内容</h3>
        </slot>
      </div>
      <div class="footer-message">
        <slot name="footer">
          <div>底部信息文字</div>
        </slot>
      </div>
      <!--
      设置请求过渡图片，如果数据没有请求完毕则展示该内容(因为absolute绝对定位覆盖，因而无法显示其详细内容，
     待请求完毕后再来显示内容) , 使用  外不传入的 isLoadingDone控制是否显示过渡图片

     -->
      <div class="mask-loading-img" v-show="isLoadingDone">
        <img src="../../../assets/loading2.gif" alt="loading-img">
      </div>
    </div>
  </div>
</template>


<style scoped lang="scss">
.gap {
  position: relative;
  padding: 20px;

  .mask-loading-img {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;

    img {
      width: 100%;
      height: 100%;
    }
  }
}

#data-wrapper {
  display: flex;
  flex-flow: column nowrap;
  width: 24%;
  background-color: white;

  .header-title {
    display: flex;
    justify-content: space-between;
    flex: 1;
  }

  .data-content {
    flex: 2;
  }

  .footer-message {
    flex: 1;
  }
}
</style>
