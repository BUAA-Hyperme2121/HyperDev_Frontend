<template>
  <div class="content-item">
    <!-- 其他人的消息 -->
    <div
      class="content-item-left"
      v-if="item.username != $store.state.userInfo.username"
    >
      <!-- 头像 -->
      <div class="chat-avatar-left">
        <el-avatar
          shape="square"
          fit="fill"
          :src="avatar"
          style="height: 45px; width: 45px; margin-right: 8px; margin-left: 8px"
        ></el-avatar>
      </div>
      <!-- 用户名和日期和内容 -->
      <div>
        <!-- 用户名日期 -->
        <div>
          <span class="name-left">{{ item.username }}</span>
          <span class="date-left">{{ item.datetime }}</span>
        </div>
        <!-- 内容 -->
        <div class="content-left">
          <span>{{ item.chat }}</span>
        </div>
      </div>
    </div>
    <!-- 自己的消息 -->
    <div
      class="content-item-right"
      v-if="item.username == $store.state.userInfo.username"
    >
      <!-- 日期和内容 -->
      <div>
        <!-- 日期 -->
        <div>
          <span class="date-right">{{ item.datetime }}</span>
          <span class="name-right">{{ item.username }}</span>
        </div>
        <!-- 内容 -->
        <div class="content-right">
          <span>{{ item.chat }}</span>
        </div>
      </div>

      <!-- 头像 -->
      <div class="chat-avatar-right">
        <el-avatar
          shape="square"
          fit="fill"
          :src="avatar"
          style="height: 45px; width: 45px; margin-right: 8px; margin-left: 8px"
        ></el-avatar>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 随机头像
      avatar: "https://picsum.photos/200/200",
    };
  },
  // 接收传来的props
  props: ["item"],
};
</script>

<style scoped>
.content-item {
  margin-bottom: 10px;
}

.content-item-left {
  display: flex;
}

.content-item-right {
  display: flex;
  justify-content: flex-end;
}
.content-left {
  background-color: antiquewhite;
  padding: 10px;
  border-radius: 5px;
  font-weight: bold;
}

.content-right {
  background-color: #409eff;
  padding: 10px;
  border-radius: 5px;
  font-weight: bold;
  text-align: right;
}

.name-left {
  font-weight: bold;
  margin-right: 10px;
}

.name-right {
  font-weight: bold;
  margin-left: 10px;
}

.date-right {
  font-size: 12px;
  text-align: right;
}
</style>
