<template>
  <div>
    <el-aside
      style="
        width: 11%;
        height: 100%;
        position: absolute;
        top: 0px;
        left: 0px;
        z-index: 99;
      "
    >
      <el-menu
        class="el-menu-vertical-demo"
        :default-active="this.$router.path"
        router
        style="height: 100%"
        @mouseenter="mouseOver"
        @mouseleave="mouseLeave"
        @select="handleMenuSelect"
      >
        <el-menu-item index="/project/designlist">
          <i class="el-icon-edit"></i>
          <span>页面设计</span>
        </el-menu-item>
        <el-menu-item index="/project/doclist">
          <i class="el-icon-document"></i>
          <span>项目文档</span>
        </el-menu-item>
        <el-menu-item index="/home">
          <i class="el-icon-close"></i>
          <span>退出项目</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main style="width: 90%; margin-left: 10%">
      <RouterView></RouterView>
    </el-main>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isCollapse: true,
      activeIndex: 1,
    };
  },
  methods: {
    mouseOver() {
      this.isCollapse = false;
    },
    mouseLeave() {
      this.isCollapse = true;
    },
    handleMenuSelect(index) {
      this.activeIndex = index;
    },
  },
};
</script>
<style scoped></style>
