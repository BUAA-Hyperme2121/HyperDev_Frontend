<template>
  <div class="msg">
    <!-- 左边的消息列表 -->
    <div class="msg-left">
      <!-- 顶部操作栏 -->
      <div class="msg-tool">
        <!-- 一键已读 -->
        <el-button> 一键已读 </el-button>
        <!-- 一键删除已读消息 -->
        <el-button type="danger"> 删除已读消息 </el-button>
      </div>
      <!-- 消息列表 -->
      <MsgItem
        v-for="item in msgList"
        :key="item.id"
        :item="item"
        @click.native="getDetail(item.id)"
      />
    </div>
    <!-- 右边的消息具体内容 -->
    <div class="msg-right">
      <router-view :key="$route.fullPath" />
    </div>
  </div>
</template>

<script>
import MsgItem from "@/components/message/MsgItem.vue";
import { log } from "mathjs";
export default {
  components: {
    MsgItem,
  },
  data() {
    return {
      msgList: [
        {
          id: 1,
          avatar: "https://avatars.githubusercontent.com/u/43968297?v=4",
          name: "用户1",
          title: "在文档中@了你",
          unread: true,
        },
        {
          id: 2,
          avatar: "https://avatars.githubusercontent.com/u/43968297?v=4",
          name: "用户2",
          title: "在群聊中@了你",
          unread: false,
        },
        {
          id: 3,
          avatar: "https://avatars.githubusercontent.com/u/43968297?v=4",
          name: "用户3",
          title: "邀请你加入团队",
          unread: false,
        },
      ],
    };
  },
  methods: {
    getDetail(id) {
      // console.log(id);
      console.log("bbb");
      this.$router.push({
        path: "/home/message/detail",
        query: {
          message_id: id,
        },
      });
    },
  },
};
</script>

<style scoped>
.msg {
  width: 90%;
  height: 600px;
  display: flex;
}
.msg-left {
  width: 25%;
  height: 100%;
  background-color: #f5f5f5;
  float: left;
}
.msg-tool {
  display: flex;
  padding: 6px;
}
.msg-right {
  width: 75%;
  height: 100%;
  background-color: #fff;
  float: left;
}
</style>
