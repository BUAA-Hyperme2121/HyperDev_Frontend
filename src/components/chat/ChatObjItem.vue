<template>
  <div class="list-item">
    <!-- 用户或者群聊头像 -->
    <div class="chat-avatar">
      <el-avatar
        shape="square"
        fit="fill"
        :src="avatar"
        style="height: 45px; width: 45px; margin-right: 8px"
      ></el-avatar>
    </div>
    <!-- 名称（昵称/真实姓名) -->
    <div class="chat-name">
      <span>{{ item.group_name }}</span>
    </div>
    <!-- 未读消息数 -->
    <!-- <div class="unread">
      <el-badge v-if="item.unread" :value="item.unread" />
    </div> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 随机团队头像
      avatar: "https://picsum.photos/200/200",
    };
  },

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
  border-radius: 8px;
  background-color: #c5d6d6;
  margin: 8px;
}
.list-item:hover {
  background-color: #f5f5f5;
}
.unread {
  margin-left: auto;
}
</style>
