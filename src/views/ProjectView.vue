<template>
  <div>
    <div class="background">
      <vue-particles
        style="height: 100%"
        color="#8a8591"
        :particleOpacity="0.7"
        :particlesNumber="80"
        shapeType="circle"
        :particleSize="4"
        linesColor="#8a8591"
        :linesWidth="1"
        :lineLinked="true"
        :lineOpacity="0.4"
        :linesDistance="150"
        :moveSpeed="1"
        :hoverEffect="true"
        hoverMode="grab"
        :clickEffect="true"
        clickMode="push"
      >
      </vue-particles>
    </div>
    <el-aside
      style="
        width: 11%;
        height: 100%;
        position: absolute;
        top: 0px;
        left: 0px;
        z-index: 99;
        background-color: rgba(219, 219, 219, 0.603);
      "
    >
      <div
        style="
          width: 100%;
          background-color: rgba(219, 219, 219, 0.603);
          text-align: center;
          height: 100px;
          padding-top: 30px;
        "
      >
        <i class="el-icon-menu" style="font-size: 50px; opacity: 0.5"></i>
      </div>
      <el-menu
        class="el-menu-vertical-demo"
        :default-active="this.$router.path"
        router
        style="
          height: 100%;
          background-color: rgba(219, 219, 219, 0.603);
          font-weight: 700;
          opacity: 0.7;
        "
        @mouseenter="mouseOver"
        @mouseleave="mouseLeave"
        @select="handleMenuSelect"
      >
        <el-menu-item
          :index="`/project/${$route.params.project_id}/designlist`"
        >
          <i class="el-icon-edit" style="color: black; font-weight: 700"></i>
          <span>页面设计</span>
        </el-menu-item>
        <el-menu-item :index="`/project/${$route.params.project_id}/doclist`">
          <i
            class="el-icon-document"
            style="color: black; font-weight: 700"
          ></i>
          <span>项目文档</span>
        </el-menu-item>
        <el-menu-item index="/home">
          <i class="el-icon-close" style="color: black; font-weight: 700"></i>
          <span>退出项目</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main
      style="width: 90%; margin-left: 10%; padding-top: 0px; margin-top: 10px"
    >
      <RouterView></RouterView>
    </el-main>
  </div>
</template>
<script>
export default {
  props: ["project_id"],
  data() {
    return {
      isCollapse: true,
      activeIndex: 1,
    };
  },
  mounted() {
    console.log(this.$route.params.project_id);
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
<style scoped>
.background {
  background-color: #f2f6ff;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}
</style>
