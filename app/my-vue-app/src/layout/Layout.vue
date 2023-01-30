<template>
  <div class="common-layout">
    <el-container>
      <el-aside :style="{width:'200px',height:'100vh'}">
        <slot name="slider">Aside</slot>
      </el-aside>
      <el-container>
        <el-header>
          <slot name="header">
            Header
          </slot>
        </el-header>
        <el-main :style="{overflow:'hidden'}">
          <div id="content-wrapper">
            <slot name="content">
              content
            </slot>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style lang="scss">
#content-wrapper {
  background-color: #f4f4f4;
  height: 100%;
  box-shadow: 0 0 10px 2px #f4f4f4;
}
</style>