<template>
  <div class="manage-box">
    <el-table :data="memberList" height="250" style="width: 60%">
      <el-table-column prop="username" label="昵称" width="180" />
      <el-table-column prop="real_name" label="姓名" width="180" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="status" label="身份" />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="small" @click="centerDialogVisible = true"
            >修改身份</el-button
          >

          <el-button
            size="small"
            type="danger"
            @click.native="handleDelete(scope.$index, scope.row)"
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
        v-model="value"
        class="m-2"
        placeholder="选择新的身份"
        size="large"
      >
        <el-option :key="1" label="管理员" :value="1" />
        <el-option :key="2" label="普通成员" :value="2" />
      </el-select>

      <span class="dialog-footer" slot="footer">
        <el-button @click="centerDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="centerDialogVisible = false">
          确认
        </el-button>
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
      value: "",
      centerDialogVisible: false,
      memberList: [],
    };
  },
  methods: {
    handleDelete(index, row) {
      console.log(index, row);
    },

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
        url: `/team/${this.$route.query.team_id}`,
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
