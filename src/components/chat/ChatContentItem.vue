<template>
  <div class="content-item">
    <!-- 其他人的消息 -->
    <div class="content-item-left" v-if="item.id != 1">
      <!-- 头像 -->
      <div class="chat-avatar-left">
        <el-avatar
          shape="square"
          fit="fill"
          :src="item.avatar"
          style="height: 45px; width: 45px; margin-right: 8px; margin-left: 8px"
        ></el-avatar>
      </div>
      <!-- 日期和内容 -->
      <div>
        <!-- 日期 -->
        <div>
          <span class="date-left">{{ item.date }}</span>
        </div>
        <!-- 内容 -->
        <div class="content-left">
          <span>{{ item.content }}</span>
        </div>
      </div>
    </div>
    <!-- 自己的消息 -->
    <div class="content-item-right" v-if="item.id == 1">
      <!-- 日期和内容 -->
      <div>
        <!-- 日期 -->
        <div class="date-right">
          <span>{{ item.date }}</span>
        </div>
        <!-- 内容 -->
        <div class="content-right">
          <span>{{ item.content }}</span>
        </div>
      </div>

      <!-- 头像 -->
      <div class="chat-avatar-right">
        <el-avatar
          shape="square"
          fit="fill"
          :src="item.avatar"
          style="height: 45px; width: 45px; margin-right: 8px; margin-left: 8px"
        ></el-avatar>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  // 接收传来的props
  props: ["item"]
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
</style>
