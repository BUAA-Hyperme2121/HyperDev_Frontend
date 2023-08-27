<template>
  <div class="manage-box">
    <el-table :data="memberList" height="250" style="width: 60%">
      <el-table-column prop="user.username" label="昵称" width="180" />
      <el-table-column prop="user.real_name" label="姓名" width="180" />
      <el-table-column prop="user.email" label="邮箱" />
      <el-table-column prop="role" label="身份" />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="small"
            @click="setMemberToBeChange(scope.row.user.id)"
            >修改身份</el-button
          >

          <el-button
            size="small"
            type="danger"
            @click.native="handleDelete(scope.row.user.id)"
            >移出团队</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 管理员可用！！！！！！！
      邀请成员 -->
    <div class="invite-box">
      <div style="margin-right: 8px">
        <el-input
          placeholder="请输入对方邮箱以邀请进入"
          v-model="newMemberEmail"
        >
        </el-input>
      </div>
      <el-button type="primary" @click.native="invite">邀请</el-button>
    </div>

    <el-dialog
      :visible.sync="centerDialogVisible"
      title="修改成员身份"
      width="30%"
    >
      <el-select
        v-model="newRole"
        class="m-2"
        placeholder="选择新的身份"
        size="large"
      >
        <el-option :key="1" label="管理员" value="Admin" />
        <el-option :key="2" label="普通成员" value="Member" />
      </el-select>

      <span class="dialog-footer" slot="footer">
        <el-button @click="centerDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="changeRole"> 确认 </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import qs from "qs";
export default {
  data() {
    return {
      newMemberEmail: "",

      centerDialogVisible: false,
      memberList: [],

      // 修改后的身份
      newRole: "",
      // 修改的成员id
      memberToBeChange: "",
    };
  },
  mounted() {
    this.getMemberList();
  },

  methods: {
    // 邀请成员
    invite() {
      this.axios({
        method: "post",
        url: `/team/${this.$route.query.team_id}/user`,
        data: qs.stringify({
          user_email: this.newMemberEmail,
          jwt: JSON.parse(localStorage.getItem("jwt")),
        }),
      })
        .then((res) => {
          if (res.data.result == 0) {
            this.$message({
              message: res.data.msg,
              type: "success",
            });
            this.getMemberList();
          } else {
            this.$message({
              message: res.data.msg,
              type: "error",
            });
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "邀请失败",
            type: "error",
          });
        });

      // 清空输入框
      this.newMemberEmail = "";
    },

    // 获取成员列表
    getMemberList() {
      this.axios({
        method: "get",
        url: `/team/${this.$route.query.team_id}/user`,
        params: {
          jwt: JSON.parse(localStorage.getItem("jwt")),
        },
      })
        .then((res) => {
          if (res.data.result == 0) {
            this.memberList = res.data.data;
          } else {
            this.$message({
              message: res.data.msg,
              type: "error",
            });
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "获取成员列表失败",
            type: "error",
          });
        });
    },

    setMemberToBeChange(id) {
      this.memberToBeChange = id;
      this.centerDialogVisible = true;
    },

    // 修改成员身份
    changeRole() {
      this.axios({
        method: "put",
        url: `/team/${this.$route.query.team_id}/user/${this.memberToBeChange}`,
        data: qs.stringify({
          team_role: this.newRole,
          jwt: JSON.parse(localStorage.getItem("jwt")),
        }),
      })
        .then((res) => {
          if (res.data.result == 0) {
            this.$message({
              message: res.data.msg,
              type: "success",
            });
            this.centerDialogVisible = false;
            this.getMemberList();
          } else {
            this.$message({
              message: res.data.msg,
              type: "error",
            });
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "修改成员身份失败",
            type: "error",
          });
        });
    },
    // 移出团队
    handleDelete(id) {
      // console.log(id);
      this.axios({
        method: "delete",
        url: `/team/${this.$route.query.team_id}/user/${id}`,
        data: qs.stringify({
          jwt: JSON.parse(localStorage.getItem("jwt")),
        }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
        .then((res) => {
          if (res.data.result == 0) {
            this.$message({
              message: res.data.msg,
              type: "success",
            });
            this.getMemberList();
          } else {
            this.$message({
              message: res.data.msg,
              type: "error",
            });
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "移出团队失败",
            type: "error",
          });
        });
    },
  },
};
</script>

<style scoped>
.manage-box {
  display: flex;
}
.invite-box {
  display: flex;
  margin-top: 20px;
  height: 30px;
}

.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
