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
          :item="item"
          :key="item.team.id"
          @click.native="changeChattingObj(item)"
        />
      </div>
    </div>
    <!-- 右边的聊天内容 -->
    <div class="chat-right">
      <!-- 聊天对象名 -->
      <div class="chat-obj-name">
        <span>{{ chattingObj.team.team_name }}</span>
      </div>
      <!-- 聊天内容 -->
      <div class="chat-content">
        <div style="height: 330px; overflow-y: auto" ref="scrollbarRef">
          <!-- 遍历聊天内容数组，生成聊天列表 -->
          <ChatContentItem
            v-for="item in chattingContentList"
            :key="item.datetime"
            :item="item"
          />
        </div>
      </div>
      <!-- 发送消息区 -->
      <div class="chat-input">
        <!-- 工具栏 -->
        <!-- <div class="tools"> -->
        <!-- 表情 -->
        <!-- 图片 -->
        <!-- <el-upload>
            <i class="el-icon-picture-outline"></i>
          </el-upload> -->
        <!-- 文件 -->
        <!-- <el-upload>
            <i class="el-icon-files"></i>
          </el-upload>
        </div> -->
        <!-- 输入框 -->
        <div>
          <el-input
            type="textarea"
            maxlength="50"
            show-word-limit
            :rows="3"
            placeholder="请输入内容"
            v-model="content"
            @keyup.enter.native="sendMsg"
          ></el-input>
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

    <el-dialog :visible.sync="dialogVisible" width="20%">
      <el-table
        :data="memberList"
        @row-click="atSomebody"
        style="height: 200px; overflow-y: auto"
      >
        <el-table-column label="昵称">
          <template slot-scope="scope">
            {{ scope.row.user.username }}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import qs from "qs";
import ChatObjItem from "@/components/chat/ChatObjItem.vue";
import ChatContentItem from "@/components/chat/ChatContentItem.vue";
// import At from 'vue-at' // for content-editable
// import AtTa from "vue-at/dist/vue-at-textarea"; // for textarea
export default {
  components: {
    ChatObjItem,
    ChatContentItem,
    // AtTa,
  },
  data() {
    return {
      input: "",
      chatObjList: [],
      // 当前聊天对象的聊天内容
      chattingContentList: [],
      // 当前聊天的对象
      chattingObj: {},
      content: "",
      memberList: [],

      dialogVisible: false,

      // @的对象的id
      atTo: "",
      // 带有@的聊天记录id
      chat_record_id: "",
    };
  },
  methods: {
    atSomebody(item) {
      this.dialogVisible = false;
      this.content += item.user.username;

      //某人
      if (item.user.id) {
        this.atTo = item.user.id;
      }
      // 所有人
      else {
        // 遍历人员数组，获取所有人的id
        this.atTo = [];
        // 从第二个开始
        for (let i = 1; i < this.memberList.length; i++) {
          this.atTo.push(this.memberList[i].user.id);
        }
      }
    },

    // 发送消息
    async sendMsg() {
      console.log(this.chattingObj.team.id);
      console.log(this.$store.state.userInfo);
      // 发送消息
      this.chattingObj.socket.send(
        JSON.stringify({
          username: this.$store.state.userInfo.username,
          // 获取当前时间
          datetime: new Date().toLocaleString(),
          chat: this.content,
        })
      );

      // this.chattingContentList.push({
      //   username: this.$store.state.userInfo.username,
      //   // 获取当前时间
      //   datetime: new Date().toLocaleString(),
      //   chat: this.content,
      // });

      // 存储聊天内容
      let res = await this.axios({
        method: "post",
        url: "/chat/chatrecord/",
        data: qs.stringify({
          user_id: this.$store.state.userInfo.id,
          jwt: JSON.parse(localStorage.getItem("jwt")),
          team_id: this.chattingObj.team.id,
          chat: this.content,
        }),
      });

      // 保存聊天内容
      if (res.data.result == 0) {
        this.$message({
          message: "保存聊天内容成功",
          type: "success",
        });
        // 如果有@对象，保存聊天记录id
        if (this.atTo != "") {
          // console.log("有@对象");
          // console.log(this.chat_record_id);
          // console.log(res.data.data.id);
          this.chat_record_id = res.data.data.id;
          // console.log(this.chat_record_id);
        }
      } else {
        this.$message({
          message: "保存聊天失败",
          type: "error",
        });
      }

      // console.log("--------");
      // console.log(this.atTo);
      // console.log(this.chat_record_id);
      // console.log("--------");
      // 发送message提醒
      if (this.atTo != "") {
        console.log("有@对象");
        if (this.atTo instanceof Array) {
          console.log("是数组");
          console.log(this.atTo);
          this.atTo.forEach((item) => {
            this.axios({
              url: "/chat/chatmention/",
              method: "post",
              data: qs.stringify({
                to_user_id: item,
                jwt: JSON.parse(localStorage.getItem("jwt")),
                chat_record_id: this.chat_record_id,
              }),
            });
          });
        } else {
          console.log("不是数组");
          this.axios({
            url: "/chat/chatmention/",
            method: "post",
            data: qs.stringify({
              to_user_id: this.atTo,
              jwt: JSON.parse(localStorage.getItem("jwt")),
              chat_record_id: this.chat_record_id,
            }),
          });
        }
      }

      // 清空输入框
      this.content = "";
      // 滚动到底部
      this.$refs.scrollbarRef.scrollTop = this.$refs.scrollbarRef.scrollHeight;
    },

    // 切换聊天对象
    changeChattingObj(item) {
      // console.log(this.chattingObj);
      // console.log(item);

      this.chattingObj = item;
      // console.log(this.chattingObj.team.id);
      // 更新聊天内容
      // this.getChatContentList(item);
      this.chattingContentList = item.chatContentList;

      console.log(item.team.id);
      // 获取新的团队成员列表
      this.axios({
        method: "get",
        url: `/team/${item.team.id}/user`,
        params: {
          jwt: JSON.parse(localStorage.getItem("jwt")),
        },
      })
        .then((res) => {
          if (res.data.result == 0) {
            this.memberList = res.data.data;
            // 插入所有人
            this.memberList.unshift({
              user: {
                username: "所有人",
              },
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
            message: "获取成员列表失败",
            type: "error",
          });
        });

      // 清空输入框
      this.content = "";
    },

    // 获取指定聊天对象的聊天内容
    getChatContentList(chatObj) {
      // console.log(111);
      this.axios({
        method: "get",
        url: "/chat/chatrecord",
        params: {
          jwt: JSON.parse(localStorage.getItem("jwt")),
          team_id: chatObj.team.id,
        },
      })
        .then((res) => {
          // 保存聊天内容
          // console.log(res.data.data);
          chatObj.chatContentList = res.data.data;
        })
        .catch((err) => {
          //提示获取失败
          this.$message({
            message: "获取聊天内容失败",
            type: "error",
          });
        });
    },
  },
  async created() {
    // 获取聊天对象列表
    let res = await this.axios({
      method: "get",
      url: "/team/",
      params: {
        jwt: JSON.parse(localStorage.getItem("jwt")),
      },
    });

    //保存团队列表
    this.chatObjList = res.data.data;

    this.chatObjList.forEach((item) => {
      // 添加响应式属性
      this.$set(item, "chatContentList", []);
      this.$set(item, "socket", null);
    });

    this.chattingObj = this.chatObjList[0];

    // console.log(this.chattingObj);

    this.getChatContentList(this.chatObjList[0]);

    console.log(this.chattingObj);

    // 可能会比上一句先执行
    this.chattingContentList = this.chatObjList[0].chatContentList;

    // 遍历聊天对象列表，获取历史记录并为每个对象创建一个 WebSocket 连接
    this.chatObjList.forEach((item) => {
      // 获取历史聊天内容
      this.getChatContentList(item);

      // 创建 WebSocket 连接
      item.socket = new WebSocket(
        "ws://8.130.12.73" + "/room/" + item.team.id + "/"
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
      };
    });

    // 监听键盘输入
    document.onkeydown = (e) => {
      // console.log(e);
      if (e.key == "@") {
        this.dialogVisible = true;
      }
    };
  },

  mounted() {},
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
