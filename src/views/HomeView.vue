<template>
  <div class="home">
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
    <!-- 左边导航区 -->

    <div class="home-left">
      <!-- logo -->
      <div class="logo" @click="goIndex" style="font-weight: 700">HyperDev</div>
      <!-- 侧边栏 -->
      <div>
        <el-menu @select="handleSelect">
          <!-- 我的团队 -->
          <el-submenu index="1" id="step1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>我的团队</span>
            </template>

            <!-- 团队列表 -->
            <el-menu-item
              v-for="item in teamList"
              :key="item.team.id"
              :index="'1-' + item.team.id"
              @click="goTeam(item)"
            >
              <i class="el-icon-office-building"></i>
              <span>{{ item.team.team_name }}</span>
            </el-menu-item>

            <!-- 创建团队 -->
            <el-menu-item index="1-4" @click="createTeamDialogVisible = true">
              <i class="el-icon-plus"></i>
              <span>创建团队</span>
            </el-menu-item>
          </el-submenu>
          <!-- 消息中心 -->
          <el-menu-item index="2" id="step2">
            <i class="el-icon-bell"></i>
            <span>消息中心</span>
          </el-menu-item>
          <!-- 聊天区域 -->
          <el-menu-item index="3" id="step3">
            <i class="el-icon-chat-dot-square"></i>
            <span>聊天区域</span>
          </el-menu-item>
        </el-menu>
      </div>
    </div>
    <!-- 右边工作区 -->
    <div class="home-right">
      <!-- 顶部栏 -->
      <div class="home-right-top">
        <el-dropdown @command="handleCommand" class="home-right-top-item">
          <!-- 头像 -->
          <el-avatar
            :size="30"
            src="https://avatars.githubusercontent.com/u/20665579?v=4"
          ></el-avatar>
          <el-dropdown-menu>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <!-- 用户名 -->
        <span class="home-right-top-item">{{
          this.$store.state.userInfo.username
        }}</span>
        <!-- 设置 -->
        <!-- <el-icon :size="20" class="home-right-top-item">
          <i class="el-icon-setting"></i>
        </el-icon> -->
        <!-- 通知 -->
        <!-- <el-icon :size="20" class="home-right-top-item">
          <i class="el-icon-bell"></i>
        </el-icon> -->
      </div>
      <!-- 分割线   -->
      <el-divider></el-divider>
      <router-view :key="$route.fullPath" />
    </div>

    <!-- 创建团队对话框 -->
    <el-dialog
      :visible.sync="createTeamDialogVisible"
      title="创建团队"
      width="30%"
      center
    >
      <el-input
        placeholder="团队名称"
        v-model="newTeamName"
        @keyup.enter.native="createTeam"
      ></el-input>

      <span slot="footer" class="dialog-footer">
        <el-button @click="createTeamDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="createTeam"> 确认 </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import qs from "qs";
import introJs from "intro.js";
import "intro.js/introjs.css";
import { re } from "mathjs";
export default {
  data() {
    return {
      // 创建团队对话框是否可见
      createTeamDialogVisible: false,

      // 团队列表
      teamList: [],

      // 新团队名称
      newTeamName: "",
    };
  },
  methods: {
    //跳转到主页
    goIndex() {
      this.$router.push("/index");
    },

    handleSelect(index) {
      if (index == "2") {
        this.$router.push("/home/message");
      } else if (index == "3") {
        this.$router.push("/home/chat");
      }
    },

    //跳转到团队页面
    goTeam(team) {
      this.$router.push({
        path: "/home/team",
        query: {
          team_id: team.team.id,
        },
      });
    },

    //点击下拉菜单，处理命令
    handleCommand(command) {
      if (command === "logout") {
        //处理退出登录的逻辑
        //清除信息
        localStorage.clear();
        this.$store.state.userInfo = {};
        //跳转到主页
        this.$router.push("/index");
        //提示退出成功
        this.$message({
          message: "退出成功",
          type: "success",
        });
      }
    },

    //创建团队
    createTeam() {
      //发送请求
      this.axios({
        method: "post",
        url: "/team/",
        data: qs.stringify({
          team_name: this.newTeamName,
          jwt: JSON.parse(localStorage.getItem("jwt")),
        }),
      })
        .then((res) => {
          //关闭对话框
          this.createTeamDialogVisible = false;
          //提示创建成功
          this.$message({
            message: "创建成功",
            type: "success",
          });
          //刷新团队列表
          this.getTeamList();
        })
        .catch((err) => {
          //提示创建失败
          this.$message({
            message: "创建失败",
            type: "error",
          });
        });

      //清空输入框
      this.newTeamName = "";
    },

    //获取团队列表
    getTeamList() {
      //发送请求
      this.axios({
        method: "get",
        url: "/team/",
        params: {
          jwt: JSON.parse(localStorage.getItem("jwt")),
        },
      })
        .then((res) => {
          //保存团队列表
          this.teamList = res.data.data;
          // console.log(this.teamList);
        })
        .catch((err) => {
          //提示获取失败
          this.$message({
            message: "获取团队列表失败",
            type: "error",
          });
        });
    },

    guide() {
      introJs()
        .setOptions({
          steps: [
            {
              element: "#step1", // 目标元素
              intro: "管理团队🙌", // 提示文本
              position: "right", // 提示位置
            },
            {
              element: "#step2", // 目标元素
              intro: "查看消息⏰", // 提示文本
              position: "right",
            },
            {
              element: "#step3", // 目标元素
              intro: "与团队中成员进行交流💬", // 提示文本
              position: "right", // 提示位置
            },
          ],
          nextLabel: "下一个", // 下一个按钮文字
          prevLabel: "上一个", // 上一个按钮文字
          // skipLabel: "跳过", // 跳过按钮文字
          doneLabel: "完成", // 完成按钮文字
          hidePrev: true, // 在第一步中是否隐藏上一个按钮
          // 一开就没有完成按钮
          // hideNext: true, // 在最后一步中是否隐藏下一个按钮
          exitOnOverlayClick: false, // 点击叠加层时是否退出介绍
          showStepNumbers: false, // 是否显示红色圆圈的步骤编号
          disableInteraction: true, // 是否禁用与突出显示的框内的元素的交互，就是禁止点击
          showBullets: false, // 是否显示面板指示点
        })
        .onbeforeexit(() => {
          console.log("onbeforeexit");
          // 修改新手引导状态
          this.axios({
            url: "/user/",
            method: "put",
            data: qs.stringify({
              jwt: JSON.parse(localStorage.getItem("jwt")),
            }),
          }).then((res) => {
            if (res.data.result == 0) {
              // 获取用户信息
              this.axios({
                method: "get",
                url: "/user/me",
                params: {
                  jwt: JSON.parse(localStorage.getItem("jwt")),
                },
              }).then((res) => {
                if (res.data.result == 0) {
                  // console.log(res.data);
                  // 保存用户信息
                  localStorage.setItem(
                    "userInfo",
                    JSON.stringify(res.data.data)
                  );
                  this.$store.state.userInfo = res.data.data;
                }
              });
            } else {
              this.$message({
                message: "修改新手引导状态失败",
                type: "error",
              });
            }
          });
        })
        .start();
    },
  },

  mounted() {
    this.getTeamList();

    // 获取个人信息
    this.$store.state.userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (this.$store.state.userInfo.home_page_fresh) {
      this.guide();
    }
  },
};
</script>

<style scoped>
.el-divider--horizontal {
  margin: 6px 0;
}
.background {
  background-color: #f2f6ff;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}
.home {
  display: flex;
  height: 100%;
  width: 100%;
}
.home-left {
  width: 16%;
  background-color: 0xff0000;
}
.logo {
  height: 60px;
  line-height: 60px;
  text-align: center;
  font-size: 20px;
  color: black;
}
.home-right {
  width: 84%;
  background-color: 0x00ff00;
}

.home-right-top {
  height: 5%;
  margin-right: 10px;
}
.home-right-top-item {
  float: right;
  margin: 8px;
}
</style>
