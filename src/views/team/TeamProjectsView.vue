<template>
  <div>
    <div class="projects-box">
      <ProjectItem
        v-for="item in projectList"
        :key="item.id"
        :item="item"
        @getProjectList="getProjectList"
      />
      <!-- 新建项目 -->
      <div
        class="box-card"
        @click="createProjectDialogVisible = true"
        style="padding: 40px"
      >
        <span><i class="el-icon-plus"></i>新建项目</span>
      </div>
    </div>

    <!-- 创建项目对话框 -->
    <el-dialog
      :visible.sync="createProjectDialogVisible"
      title="创建项目"
      width="30%"
    >
      <el-input placeholder="项目名称" v-model="newProjectName"> </el-input>

      <span class="dialog-footer" slot="footer">
        <el-button @click="createProjectDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="createProject"> 确认 </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ProjectItem from "@/components/project/ProjectItem.vue";
import qs from "qs";
export default {
  components: {
    ProjectItem,
  },
  data() {
    return {
      projectList: [],
      createProjectDialogVisible: false,
      newProjectName: "",
    };
  },
  mounted() {
    // 获取项目列表
    this.getProjectList();
  },
  methods: {
    // 获取项目列表
    getProjectList() {
      this.axios({
        method: "get",
        url: "/project/",
        params: {
          team_id: this.$route.query.team_id,
          jwt: JSON.parse(localStorage.getItem("jwt")),
        },
      }).then((res) => {
        this.projectList = res.data.data;
      });
    },

    // 创建项目
    createProject() {
      // 创建项目
      this.axios({
        method: "post",
        url: "/project/",
        data: qs.stringify({
          project_name: this.newProjectName,
          team_id: this.$route.query.team_id,
          jwt: JSON.parse(localStorage.getItem("jwt")),
        }),
      }).then((res) => {
        // 关闭对话框
        this.createProjectDialogVisible = false;
        // 清空输入框
        this.newProjectName = "";

        if (res.data.result == 0) {
          this.$message({
            message: "创建成功",
            type: "success",
          });
        } else {
          this.$message({
            message: res.data.msg,
            type: "error",
          });
        }

        // 刷新项目列表
        this.getProjectList();
      });
    },
  },
};
</script>

<style scoped>
.projects-box {
  display: flex;
}
.box-card {
  margin: 20px;
}
.box-card:hover {
  cursor: pointer;
  filter: drop-shadow(0 0 0.5em #5e5f68aa);
}
</style>
