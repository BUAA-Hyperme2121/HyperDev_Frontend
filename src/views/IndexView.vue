<template>
  <div class="main-box" ref="container">
    <div class="background">
      <vue-particles
        color="#8a8591"
        :particleOpacity="1"
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

    <div class="intro animate__animated animate__fadeIn">
      <div class="big-title">HyperDev</div>
      <div class="small-title">软工团队协作与管理平台</div>
    </div>
    <div class="begin-btn animate__animated animate__fadeIn">
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
    <div class="card" ref="box1">
      <div style="float: left; margin-left: 50px">
        <h1>HyperDev</h1>
        <h4>属于你的团队协作与管理平台</h4>
        <ul>
          <li>简洁的UI设计</li>
          <li>快捷高效的管理功能</li>
          <li>可靠的设计与编辑功能</li>
        </ul>
      </div>

      <div class="image-container-right">
        <img src="../assets/index/index.png" alt="" />
      </div>
    </div>
    <div class="card" ref="box2">
      <div style="float: right; margin-right: 50px">
        <h1>团队聊天</h1>
        <h4>与团队成员高效沟通</h4>
        <ul>
          <li>实时获取最新消息</li>
          <li>支持多种消息类型</li>
          <li>消息转发与历史记录</li>
        </ul>
      </div>
      <div class="image-container-left">
        <img src="../assets/index/chat.png" alt="" />
      </div>
    </div>
    <div class="card" ref="box3">
      <div style="float: left; margin-left: 50px">
        <h1>设计原型</h1>
        <h4>快速设计你的页面</h4>
        <ul>
          <li>拖拽式原型设计</li>
          <li>支持预览效果与分享</li>
          <li>丰富的组件库与动画库</li>
        </ul>
      </div>
      <div class="image-container-right">
        <img src="../assets/index/page.png" alt="" />
      </div>
    </div>
    <div class="card" ref="box4">
      <div style="float: right; margin-right: 50px">
        <h1>共享文档</h1>
        <h4>构建你的项目文档</h4>
        <ul>
          <li>实时渲染，便捷查看</li>
          <li>多人光标协同，合作无间</li>
          <li>支持分享与导出</li>
        </ul>
      </div>
      <div class="image-container-left">
        <img src="../assets/index/document.png" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
import "animate.css";
export default {
  mounted() {
    this.$refs.container.addEventListener("scroll", this.handleScroll);
  },
  beforeDestroy() {
    this.$refs.container.removeEventListener("scroll", this.handleScroll);
  },

  methods: {
    handleScroll() {
      const container = this.$refs.container;
      const box1OffsetTop = this.$refs.box1.offsetTop;
      const box2OffsetTop = this.$refs.box2.offsetTop;
      const box3OffsetTop = this.$refs.box3.offsetTop;
      const box4OffsetTop = this.$refs.box4.offsetTop;
      const scrollPosition = container.scrollTop + window.innerHeight - 50;
      console.log(scrollPosition);
      if (scrollPosition >= box1OffsetTop) {
        this.$refs.box1.classList.add(
          "animate__animated",
          "animate__fadeInLeft"
        );
      }

      if (scrollPosition >= box2OffsetTop) {
        this.$refs.box2.classList.add(
          "animate__animated",
          "animate__fadeInRight"
        );
      }

      if (scrollPosition >= box3OffsetTop) {
        this.$refs.box3.classList.add(
          "animate__animated",
          "animate__fadeInLeft"
        );
      }
      if (scrollPosition >= box4OffsetTop) {
        this.$refs.box4.classList.add(
          "animate__animated",
          "animate__fadeInRight"
        );
      }
    },
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
.card {
  margin: auto;
  margin-bottom: 150px;
  width: 60%;
  height: 300px;
  border-radius: 3%;
  background-color: rgba(238, 231, 255, 0.651);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.582);
  padding: 20px;
}
ul {
  margin-left: 20px;
}
ul li {
  list-style-type: disc;
  font-size: small;
  font-weight: 600;
  height: 30px;
  color: rgb(65, 65, 65);
}
.image-container-right {
  float: right;
  width: 370px;
  height: 200px;
  margin-right: 50px;
  margin-top: 30px;
  border-radius: 5%;
  border: 3px solid #230047bd;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
.image-container-left {
  float: left;
  width: 370px;
  height: 200px;
  margin-left: 50px;
  margin-top: 30px;
  border-radius: 5%;
  border: 3px solid #230047bd;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.main-box {
  width: 100%;
  padding-top: 200px;
  max-height: 700px;
  overflow-y: scroll;
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
  text-align: center;
  margin-bottom: 300px;
}

.begin-btn:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
</style>
