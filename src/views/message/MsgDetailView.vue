<template>
  <div class="msg-detail">
    <!-- 消息的标题 -->
    <div class="msg-title">
      <span>{{ msgDetail.title }}</span>
    </div>
    <!-- 消息的基本信息 -->
    <div class="msg-info">
      <!-- 发起者头像 -->
      <div>
        <el-avatar
          shape="square"
          fit="fill"
          :src="avatar"
          style="height: 45px; width: 45px; margin-right: 8px"
        ></el-avatar>
      </div>
      <div>
        <!-- 发起者姓名 -->
        <div>
          <span>
            {{ msgDetail.from_user.username }}
          </span>
        </div>
        <!-- 发起时间 -->
        <div>
          <span>
            {{ msgDetail.datetime }}
          </span>
        </div>
      </div>
    </div>
    <!-- 消息的具体内容 -->
    <!-- 聊天中@ -->
    <div class="chat-content" v-if="msgDetail.mention_chat != null">
      <!-- 群聊名称 -->
      <div class="chat-name">
        {{ msgDetail.mention_chat.team_name }}
      </div>
      <!-- 聊天气泡 -->
      <div class="chat-bubble">
        {{ msgDetail.mention_chat.chat }}
      </div>
    </div>
    <!-- 文档中@ -->
    <div class="doc-content" v-if="msgDetail.mention_doc != null">
      <!-- 文档标题 -->
      <div class="dov-title">
        {{ msgDetail.mention_doc.doc_name }}
      </div>
      <!-- 文档内容 -->
      <!-- <div class="doc-bubble">
        {{ msgDetail.doc_content }}
      </div> -->
      <!-- 文档链接 -->
      <div class="doc-url">
        <span @click="goDoc">文档链接</span>
      </div>
    </div>
    <!-- 团队邀请 -->
    <div class="invite-content" v-if="msgDetail.invite_team != null">
      <!-- 团队信息 -->
      <div class="team-info">
        <span>{{ msgDetail.invite_team.team_name }}</span>
      </div>
      <!-- 加入或拒绝按钮 -->
      <div class="team-btn" v-if="msgDetail.invite_state == 0">
        <el-button type="primary" size="small" @click="enterTeam"
          >加入</el-button
        >
        <el-button type="danger" size="small" @click="rejectTeam"
          >拒绝</el-button
        >
      </div>
      <!-- 已加入或已拒绝 -->
      <div class="team-status" v-if="msgDetail.invite_state == 1">
        <span>已加入该团队</span>
      </div>
      <div class="team-status" v-if="msgDetail.invite_state == 2">
        <span>已拒绝该邀请</span>
      </div>
    </div>
    <!-- 群聊邀请 -->
    <div class="invite-content" v-if="msgDetail.invite_group_chat != null">
      <!-- 群聊信息 -->
      <div class="team-info">
        <span>{{ msgDetail.invite_group_chat.group_name }}</span>
      </div>
      <!-- 加入或拒绝按钮 -->
      <div class="team-btn" v-if="msgDetail.invite_state == 0">
        <el-button type="primary" size="small" @click="enterGroup"
          >加入</el-button
        >
        <el-button type="danger" size="small" @click="rejectGroup"
          >拒绝</el-button
        >
      </div>
      <!-- 已加入或已拒绝 -->
      <div class="team-status" v-if="msgDetail.invite_state == 1">
        <span>已加入该群聊</span>
      </div>
      <div class="team-status" v-if="msgDetail.invite_state == 2">
        <span>已拒绝该群聊</span>
      </div>
    </div>
  </div>
</template>

<script>
import qs from "qs";
export default {
  data() {
    return {
      msgDetail: {},
      msgDetailList: [],
      message_id: this.$route.query.message_id,
      avatar: "https://picsum.photos/200/200",
    };
  },
  methods: {
    goDoc() {
      this.$router.push({
        path: `/project/${this.msgDetail.project_id}/doc`,
        query: {
          document_id: this.msgDetail.mention_doc.id,
        },
      });
    },

    // 发送请求，加入团队
    enterTeam() {
      console.log(this.msgDetail);
      this.axios({
        url: `/team/${this.msgDetail.invite_team.id}/user/${this.$store.state.userInfo.id}`,
        method: "post",
        data: qs.stringify({
          jwt: JSON.parse(localStorage.getItem("jwt")),
          message_id: this.message_id,
          invite_state: 1,
        }),
      }).then((res) => {
        this.$message({
          message: "加入成功",
          type: "success",
        });
      });

      // 修改消息状态
      this.msgDetail.invite_state = 1;
    },

    // 发送请求，拒绝团队邀请
    rejectTeam() {
      this.axios({
        url: `/team/${this.msgDetail.invite_team.id}/user/${this.$store.state.userInfo.id}`,
        method: "post",
        data: qs.stringify({
          jwt: JSON.parse(localStorage.getItem("jwt")),
          message_id: this.message_id,
          invite_state: 2,
        }),
      }).then((res) => {
        this.$message({
          message: "已拒绝",
          type: "success",
        });
      });

      // 修改消息状态
      this.msgDetail.invite_state = 2;
    },

    // 发送请求，加入群聊
    enterGroup() {
      this.axios({
        url: `/chat/group_chat/${this.msgDetail.invite_group_chat.id}/user`,
        method: "post",
        data: qs.stringify({
          jwt: JSON.parse(localStorage.getItem("jwt")),
          message_id: this.message_id,
          invite_state: 1,
        }),
      }).then((res) => {
        this.$message({
          message: "加入成功",
          type: "success",
        });
      });

      // 修改消息状态
      this.msgDetail.invite_state = 1;
    },

    // 发送请求，拒绝群聊邀请
    rejectGroup() {
      this.axios({
        url: `/chat/group_chat/${this.msgDetail.invite_group_chat.id}/user`,
        method: "post",
        data: qs.stringify({
          jwt: JSON.parse(localStorage.getItem("jwt")),
          message_id: this.message_id,
          invite_state: 2,
        }),
      }).then((res) => {
        this.$message({
          message: "已拒绝",
          type: "success",
        });
      });

      // 修改消息状态
      this.msgDetail.invite_state = 2;
    },
  },

  mounted() {
    this.axios({
      url: "/message",
      method: "get",
      params: {
        jwt: JSON.parse(localStorage.getItem("jwt")),
      },
    }).then((res) => {
      this.msgDetailList = res.data.data;

      // 遍历消息列表，找到对应的消息详情
      for (let i = 0; i < this.msgDetailList.length; i++) {
        if (this.msgDetailList[i].id == this.message_id) {
          this.msgDetail = this.msgDetailList[i];
          break;
        }
      }
    });
  },
};
</script>

<style scoped>
.msg-detail {
  padding: 10px;
}
.msg-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}
.msg-info {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
/* .msg-content {
  align-content: center;
  align-items: center;
  text-align: center;
} */

.chat-content {
  margin-top: 10px;
}
.chat-name {
  font-size: 16px;
  font-weight: bold;
  margin-right: 10px;
}
.chat-bubble {
  font-size: 16px;
  background-color: #409eff;
  padding: 10px;
  border-radius: 5px;
  font-weight: bold;
  text-align: left;
}
.doc-content {
  margin-top: 10px;
}
.doc-title {
  font-size: 16px;
  font-weight: bold;
  margin-right: 10px;
}
.doc-bubble {
  font-size: 16px;
  background-color: #409eff;
  padding: 10px;
  border-radius: 5px;
  font-weight: bold;
  text-align: left;
}
.doc-url {
  font-size: 16px;
  font-weight: bold;
  margin-right: 10px;
}
</style>
