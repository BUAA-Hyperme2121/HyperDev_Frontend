<template>
  <div class="main-box">
    <div class="background">
      <vue-particles
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

    <div class="intro">
      <div class="big-title">HyperDev</div>
      <div class="small-title">软工团队协作与管理平台</div>
    </div>
    <div class="begin-btn">
      <el-button
        style="
          font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
          font-weight: 700;
        "
        @click.native="beginUse"
      >
        开始使用
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    beginUse() {
      // 判断是否登录
      const jwt = localStorage.getItem("jwt");
      // 已登录
      if (jwt) {
        this.$router.push("/home");
      }
      // 未登录
      else this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.main-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  margin-top: 15%;
}
.background {
  background-color: #faf7ff;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}
.big-title {
  font-size: 80px;
  font-weight: 700;
  color: #333;
  font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
  margin-bottom: 20px;
  text-align: center;
}

.small-title {
  font-size: 30px;
  font-weight: 700;
  color: #333;
  font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
  text-align: center;
}

.begin-btn {
  margin-top: 50px;
}

.begin-btn:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
</style>
