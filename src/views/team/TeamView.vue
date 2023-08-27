<template>
  <!-- 工作区 -->
  <div class="team">
    <!-- 团队名称和所任职位 -->
    <div class="team-top">
      <span class="team-name">{{ teamInfo.team.team_name }}</span>
      <span class="team-pos">{{ teamInfo.role }}</span>
    </div>
    <!-- 水平导航 -->
    <el-menu mode="horizontal" @select="handleSelect">
      <el-menu-item index="1"> 团队项目 </el-menu-item>
      <el-menu-item index="2"> 团队管理 </el-menu-item>
      <el-menu-item index="3"> 团队设置 </el-menu-item>
      <el-menu-item index="4"> 回收站 </el-menu-item>
    </el-menu>
    <router-view />
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 团队id
      teamId: this.$route.query.team_id,
      //当前用户担任的角色
      // role: this.$route.query.role,

      teamInfo: {},
    };
  },
  methods: {
    handleSelect(index) {
      if (index === "1") {
        this.$router.push({
          path: "/home/team/projects",
          query: {
            team_id: this.teamId,
          },
        });
      } else if (index === "2") {
        this.$router.push({
          path: "/home/team/manage",
          query: {
            team_id: this.teamId,
          },
        });
      } else if (index === "3") {
        this.$router.push({
          path: "/home/team/setting",
          query: {
            team_id: this.teamId,
          },
        });
      } else if (index === "4") {
        this.$router.push({
          path: "/home/team/recycle",
          query: {
            team_id: this.teamId,
          },
        });
      }
    },
  },
  mounted() {
    // 获取团队信息
    this.axios
      .get(`/team/${this.teamId}`, {
        params: {
          jwt: JSON.parse(localStorage.getItem("jwt")),
        },
      })
      .then((res) => {
        this.teamInfo = res.data.data;
      });
    // console.log(this.$route.query.team_id);
  },
};
</script>

<style scoped>
.team {
  padding: 0 20px;
  height: 80%;
}
.team-top {
  display: flex;
  align-items: center;
  height: 60px;
  border-bottom: 1px solid #ebeef5;
}
.team-name {
  font-size: 20px;
  font-weight: bold;
  margin-right: 20px;
}
.team-pos {
  font-size: 14px;
  color: #999;
}
</style>
