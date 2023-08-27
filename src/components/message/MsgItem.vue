<template>
  <div class="list-item">
    <!-- 用户或者群聊头像 -->
    <div class="chat-avatar">
      <el-avatar
        shape="square"
        fit="fill"
        :src="item.avatar"
        style="height: 45px; width: 45px; margin-right: 8px"
      ></el-avatar>
    </div>
    <!-- 名称（昵称/真实姓名)和标题 -->
    <div class="chat-name">
      <span style="margin-right: 8px">{{ item.name }}</span>
      <span>{{ item.title }}</span>
    </div>
    <!-- 未读/已读 -->
    <div class="unread">
      <el-badge v-if="item.unread" value="new" />
    </div>
  </div>
</template>

<script>
export default {
  // 接收传来的props
  props: ["item"],
};
</script>

<style scoped>
.list-item {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 10px;
  border-bottom: 1px solid #ccc;
}
.list-item:hover {
  background-color: #999494;
}
.unread {
  margin-left: auto;
}
</style>
