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
          :src="msgDetail.avatar"
          style="height: 45px; width: 45px; margin-right: 8px"
        ></el-avatar>
      </div>
      <div>
        <!-- 发起者姓名 -->
        <div>
          <span>
            {{ msgDetail.name }}
          </span>
        </div>
        <!-- 发起时间 -->
        <div>
          <span>
            {{ msgDetail.create_time }}
          </span>
        </div>
      </div>
    </div>
    <!-- 消息的具体内容 -->
    <!-- 聊天中@ -->
    <div class="chat-content">
      <!-- 群聊名称 -->
      <div class="chat-name">
        {{ msgDetail.chat_name }}
      </div>
      <!-- 聊天气泡 -->
      <div class="chat-bubble">
        {{ msgDetail.chat_content }}
      </div>
    </div>
    <!-- 文档中@ -->
    <div class="doc-content">
      <!-- 文档标题 -->
      <div class="dov-title">
        {{ msgDetail.doc_title }}
      </div>
      <!-- 文档内容 -->
      <div class="doc-bubble">
        {{ msgDetail.doc_content }}
      </div>
      <!-- 文档链接 -->
      <div class="doc-url">
        {{ msgDetail.doc_url }}
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
      msgDetail: {
        title: "消息标题",
        avatar: "https://avatars.githubusercontent.com/u/20600867?v=4",
        name: "消息发起者",
        create_time: "2021-08-01 12:00:00",
        chat_content: "@ .... aaaaaaaaaaaaaaa",
        chat_name: "群聊名称",
        doc_title: "文档标题",
        doc_content:
          "@上下文上下文上下文上下文上下文上下文上下文上下文上下文上下文上下文上下文上下文上下文上下文上下文上下文上下文+" +
          "上下文上下文上下文",
        doc_url: "文档链接",
      },
      message_id: this.$route.query.message_id,
    };
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
