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
        <!-- <div>
          <span>
            {{ msgDetail.mention_chat.chat_datetime }}
          </span>
        </div> -->
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
    <div class="invite-content">
      <!-- 团队信息 -->
      <!-- 加入或拒绝按钮 -->
    </div>
  </div>
</template>

<script>
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
