<template>
  <div class="chat-room">
    <!-- 左边的聊天列表 -->
    <div class="chat-left">
      <!-- 顶部搜索框 -->
      <div class="top-search">
        <el-input
          v-model="input"
          prefix-icon="el-icon-search"
          style="width: 80%"
        />
      </div>
      <!-- 聊天列表 -->
      <div class="chat-list">
        <!-- 遍历聊天对象数组，生成聊天列表 -->
        <ChatObjItem
          v-for="item in chatObjList"
          :key="item.id"
          :item="item"
          @click.native="changeChattingObj(item)"
        />
      </div>
    </div>
    <!-- 右边的聊天内容 -->
    <div class="chat-right">
      <!-- 聊天对象名 -->
      <div class="chat-obj-name">
        <span>{{ chattingObj.name }}</span>
      </div>
      <!-- 聊天内容 -->
      <div class="chat-content">
        <div style="height: 330px; overflow-y: auto" ref="scrollbarRef">
          <!-- 遍历聊天内容数组，生成聊天列表 -->
          <ChatContentItem
            v-for="item in chattingContentList"
            :key="item.id"
            :item="item"
          />
        </div>
      </div>
      <!-- 发送消息区 -->
      <div class="chat-input">
        <!-- 工具栏 -->
        <div class="tools">
          <!-- 表情 -->
          <!-- 图片 -->
          <el-upload>
            <i class="el-icon-picture-outline"></i>
          </el-upload>
          <!-- 文件 -->
          <el-upload>
            <i class="el-icon-files"></i>
          </el-upload>
        </div>
        <!-- 输入框 -->
        <div>
          <at-ta :members="members">
            <el-input
              type="textarea"
              maxlength="50"
              show-word-limit
              :rows="3"
              placeholder="请输入内容"
              v-model="content"
            ></el-input>
          </at-ta>
        </div>
        <!-- 底部栏 -->
        <div>
          <!-- 发送按钮 -->
          <el-button
            type="primary"
            style="margin-top: 10px; float: right"
            @click.native="sendMsg"
          >
            发送
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ChatObjItem from "@/components/chat/ChatObjItem.vue";
import ChatContentItem from "@/components/chat/ChatContentItem.vue";
// import At from 'vue-at' // for content-editable
import AtTa from "vue-at/dist/vue-at-textarea"; // for textarea
export default {
  components: {
    ChatObjItem,
    ChatContentItem,
    AtTa,
  },
  data() {
    return {
      input: "",
      chatObjList: [
        {
          id: 1,
          name: "张三",
          avatar: "https://picsum.photos/200/200",
          unread: 10,
          socket: null,
          chatContentList: [
            {
              id: 1,
              avatar: "https://picsum.photos/200/200",
              date: "2021-08-01",
              content: "你好",
            },
            {
              id: 2,
              avatar: "https://picsum.photos/200/200",
              date: "2021-08-01",
              content: "你好",
            },
            {
              id: 3,
              avatar: "https://picsum.photos/200/200",
              date: "2021-08-01",
              content: "你好",
            },
            {
              id: 4,
              avatar: "https://picsum.photos/200/200",
              date: "2021-08-01",
              content: "你好",
            },
            {
              id: 5,
              avatar: "https://picsum.photos/200/200",
              date: "2021-08-01",
              content: "你好",
            },
            {
              id: 6,
              avatar: "https://picsum.photos/200/200",
              date: "2021-08-01",
              content: "你好",
            },
            {
              id: 7,
              avatar: "https://picsum.photos/200/200",
              date: "2021-08-01",
              content: "你好",
            },
          ],
        },
        {
          id: 2,
          name: "李四",
          avatar: "https://picsum.photos/200/200",
          unread: 0,
          socket: null,
          chatContentList: [
            {
              id: 1,
              avatar: "https://picsum.photos/200/200",
              date: "2021-08-01",
              content: "你好",
            },
            {
              id: 2,
              avatar: "https://picsum.photos/200/200",
              date: "2021-08-01",
              content: "你好",
            },
            {
              id: 3,
              avatar: "https://picsum.photos/200/200",
              date: "2021-08-01",
              content: "你好",
            },
            {
              id: 4,
              avatar: "https://picsum.photos/200/200",
              date: "2021-08-01",
              content: "你好",
            },
            {
              id: 5,
              avatar: "https://picsum.photos/200/200",
              date: "2021-08-01",
              content: "你好",
            },
            {
              id: 6,
              avatar: "https://picsum.photos/200/200",
              date: "2021-08-01",
              content: "你好",
            },
            {
              id: 7,
              avatar: "https://picsum.photos/200/200",
              date: "2021-08-01",
              content: "你好",
            },
          ],
        },
        {
          id: 3,
          name: "王五",
          avatar: "https://picsum.photos/200/200",
          unread: 0,
          socket: null,
          chatContentList: [
            {
              id: 1,
              avatar: "https://picsum.photos/200/200",
              date: "2021-08-01",
              content: "你好",
            },
            {
              id: 2,
              avatar: "https://picsum.photos/200/200",
              date: "2021-08-01",
              content: "你好",
            },
            {
              id: 3,
              avatar: "https://picsum.photos/200/200",
              date: "2021-08-01",
              content: "你好",
            },
            {
              id: 4,
              avatar: "https://picsum.photos/200/200",
              date: "2021-08-01",
              content: "你好",
            },
            {
              id: 5,
              avatar: "https://picsum.photos/200/200",
              date: "2021-08-01",
              content: "你好",
            },
            {
              id: 6,
              avatar: "https://picsum.photos/200/200",
              date: "2021-08-01",
              content: "你好",
            },
            {
              id: 7,
              avatar: "https://picsum.photos/200/200",
              date: "2021-08-01",
              content: "你好",
            },
          ],
        },
        {
          id: 4,
          name: "赵六",
          avatar: "https://picsum.photos/200/200",
          unread: 0,
          socket: null,
          chatContentList: [
            {
              id: 1,
              avatar: "https://picsum.photos/200/200",
              date: "2021-08-01",
              content: "你好",
            },
            {
              id: 2,
              avatar: "https://picsum.photos/200/200",
              date: "2021-08-01",
              content: "你好",
            },
            {
              id: 3,
              avatar: "https://picsum.photos/200/200",
              date: "2021-08-01",
              content: "你好",
            },
            {
              id: 4,
              avatar: "https://picsum.photos/200/200",
              date: "2021-08-01",
              content: "你好",
            },
            {
              id: 5,
              avatar: "https://picsum.photos/200/200",
              date: "2021-08-01",
              content: "你好",
            },
            {
              id: 6,
              avatar: "https://picsum.photos/200/200",
              date: "2021-08-01",
              content: "你好",
            },
            {
              id: 7,
              avatar: "https://picsum.photos/200/200",
              date: "2021-08-01",
              content: "你好",
            },
          ],
        },
      ],
      // 当前聊天对象的聊天内容
      chattingContentList: [],
      // 当前聊天的对象
      chattingObj: {},
      content: "",
      members: ["张三", "李四", "王五", "赵六"],
    };
  },
  methods: {
    // 发送消息
    sendMsg() {
      console.log(this.content);

      this.chattingObj.socket.send(
        JSON.stringify({
          id: 1,
          avatar: "https://picsum.photos/200/200",
          // 获取当前时间
          date: new Date().toLocaleString(),
          content: this.content,
        })
      );

      // 清空输入框
      this.content = "";
      // 滚动到底部
      this.$refs.scrollbarRef.scrollTop = this.$refs.scrollbarRef.scrollHeight;
    },

    // 切换聊天对象
    changeChattingObj(item) {
      this.chattingObj = item;

      // 更新聊天内容
      this.chattingContentList = item.chatContentList;
      // 滚动到底部
      this.$refs.scrollbarRef.scrollTop = this.$refs.scrollbarRef.scrollHeight;
    },
  },
  mounted() {
    console.log(this.$refs.scrollbarRef);

    // 滚动到底部
    this.$refs.scrollbarRef.scrollTop = this.$refs.scrollbarRef.scrollHeight;

    // 遍历聊天对象列表，为每个对象创建一个 WebSocket 连接
    this.chatObjList.forEach((item) => {
      item.socket = new WebSocket(
        "ws://" + window.location.host + "/room/" + item.id + "/"
      );
      item.socket.onopen = () => {
        console.log("连接成功");
      };
      item.socket.onmessage = (e) => {
        console.log("webSocket message", e);
        const msgData = JSON.parse(e.data);
        console.log(msgData);
        item.chatContentList.push(msgData);
      };
      item.socket.onclose = (e) => {
        console.log("断开连接", e);
      }
    });

    this.chattingObj = this.chatObjList[0];
    this.chattingContentList = this.chatObjList[0].chatContentList;
  },
};
</script>

<style scoped>
.chat-room {
  margin-right: 20px;
  height: 600px;
  display: flex;
}

.chat-left {
  width: 20%;
  background-color: rgb(181, 183, 184);
}
.top-search {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  border-bottom: 1px solid #ccc;
}

.chat-right {
  width: 80%;
  background-color: #d4d9de;
}
.chat-obj-name {
  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 30px;
  padding: 10px;
}
.chat-input {
  padding: 20px;
}
.tools {
  display: flex;
  /* align-items: center; */
  margin-top: 10px;
  border-top: 1px solid #ccc;
}
</style>
