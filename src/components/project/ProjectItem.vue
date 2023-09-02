<template>
  <div>
    <el-card
      class="project-card"
      slot="header"
      @click.native="goProject(item.id)"
    >
      <div class="card-header" @click.stop>
        <span>
          {{ item.project_name }}
        </span>
        <!-- 操作按钮 -->
        <el-dropdown @click.stop trigger="click">
          <span class="el-dropdown-link" style="font-weight: bold"> ··· </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              @click.native="
                copyProjectDialogVisible = true;
                newCopyProjectName = item.project_name + ' - 副本';
              "
              >复制</el-dropdown-item
            >
            <el-dropdown-item @click.native="renameProjectDialogVisible = true">
              重命名</el-dropdown-item
            >
            <el-dropdown-item @click.native="delProject">删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-card>

    <!-- 重命名对话框 -->
    <el-dialog
      :visible.sync="renameProjectDialogVisible"
      title="重命名项目"
      width="30%"
    >
      <el-input placeholder="新的项目名称" v-model="newProjectName"> </el-input>

      <span class="dialog-footer" slot="footer">
        <el-button @click="renameProjectDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="renameProject"> 确认 </el-button>
      </span>
    </el-dialog>

    <!-- 复制对话框 -->
    <el-dialog
      :visible.sync="copyProjectDialogVisible"
      title="复制项目"
      width="30%"
    >
      <el-input v-model="newCopyProjectName"> </el-input>

      <span class="dialog-footer" slot="footer">
        <el-button @click="copyProjectDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="copyProject"> 确认 </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import qs from "qs";
export default {
  // 接收传来的props
  props: ["item"],

  data() {
    return {
      renameProjectDialogVisible: false,
      newProjectName: "",
      copyProjectDialogVisible: false,
      newCopyProjectName: "",
    };
  },

  methods: {
    // 复制项目
    copyProject() {
      this.axios({
        method: "post",
        url: `/project/${this.item.id}`,
        data: qs.stringify({
          jwt: JSON.parse(localStorage.getItem("jwt")),
          project_name: this.newCopyProjectName,
        }),
      }).then((res) => {
        if (res.data.result == 0) {
          this.$message({
            type: "success",
            message: "复制成功!",
          });
          // 关闭对话框
          this.copyProjectDialogVisible = false;

          // 刷新项目列表
          this.$emit("getProjectList");
        } else {
          this.$message({
            type: "error",
            message: "复制失败!",
          });
        }
      });
    },
    // 跳转到项目详情
    goProject(id) {
      this.$router.push(`/project/${id}`);
    },

    delProject() {
      // console.log('gg');
      this.$confirm("此操作将删除该项目, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.axios({
            method: "delete",
            url: `/project/${this.item.id}`,
            data: qs.stringify({
              jwt: JSON.parse(localStorage.getItem("jwt")),
            }),
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }).then((res) => {
            if (res.data.result == 0) {
              this.$message({
                type: "success",
                message: "删除成功!",
              });

              // 刷新项目列表
              this.$emit("getProjectList");
            } else {
              this.$message({
                type: "error",
                message: "删除失败!",
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    renameProject() {
      this.axios({
        method: "put",
        url: `/project/${this.item.id}`,
        data: qs.stringify({
          project_name: this.newProjectName,
          jwt: JSON.parse(localStorage.getItem("jwt")),
        }),
        // headers: {
        //   "Content-Type": "application/x-www-form-urlencoded",
        // },
      }).then((res) => {
        if (res.data.result == 0) {
          this.$message({
            type: "success",
            message: "重命名成功!",
          });

          // 刷新项目列表
          this.$emit("getProjectList");
        } else {
          this.$message({
            type: "error",
            message: "重命名失败!",
          });
        }

        // 关闭对话框
        this.renameProjectDialogVisible = false;
        // 清空输入框
        this.newProjectName = "";
      });
    },
  },
};
</script>

<style scoped>
.project-card {
  margin: 20px;
  width: 150px;
  height: 100px;
}
.project-card:hover {
  cursor: pointer;
  filter: drop-shadow(0 0 0.5em #5e5f68aa);
}
.card-header {
  display: flex;
  justify-content: space-between;
}
</style>
