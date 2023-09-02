<template>
  <div class="chat-room">
    <!-- 左边的聊天列表 -->
    <div class="chat-left">
      <!-- 顶部搜索框 -->
      <div class="top-search">
        <el-input
          v-model="input"
          prefix-icon="el-icon-search"
          style="width: 80%; margin-right: 5px"
        />

        <!-- 创建群聊按钮 -->
        <i
          class="el-icon-plus"
          title="创建群聊"
          @click="createGroupDialogVisible = true"
        ></i>
      </div>
      <!-- 聊天列表 -->
      <div class="chat-list">
        <!-- 遍历聊天对象数组，生成聊天列表 -->
        <ChatObjItem
          v-for="item in chatObjList"
          :item="item"
          :key="item.id"
          @click.native="changeChattingObj(item)"
        />
      </div>
    </div>
    <!-- 右边的聊天内容 -->
    <div class="chat-right">
      <!-- 聊天对象名 -->
      <div class="chat-obj-name">
        <span>{{ chattingObj.group_name }}</span>
        <!-- 群聊才会有的成员列表 -->
        <el-button
          type="text"
          icon="el-icon-user-solid"
          @click.native="memberDialogVisible = true"
          v-if="!is_private"
        ></el-button>
      </div>
      <!-- 聊天内容 -->

      <div style="height: 350px; overflow-y: auto" ref="scrollbarRef">
        <!-- 遍历聊天内容数组，生成聊天列表 -->
        <ChatContentItem
          v-for="item in chattingContentList"
          :key="item.id"
          :item="item"
          :chatObjList="chatObjList"
          :socket="chattingObj.socket"
          @setAllMerging="setAllMerging"
          ref="chatContentItemRef"
        />
      </div>

      <!-- 转发消息区 -->
      <div class="chat-forward" v-if="isAllMerging">
        <el-button type="primary" @click.native="forwardDialogVisible = true">
          转发
        </el-button>

        <el-button @click.native="setAllMerging(false)"> 取消 </el-button>
      </div>

      <!-- 发送消息区 -->
      <div class="chat-input" v-if="!isAllMerging">
        <!-- 工具栏 -->
        <div class="tools">
          <!-- 表情 -->
          <!-- 图片 -->
          <el-upload
            accept="image"
            :limit="1"
            action=""
            :on-change="handleLimit"
            :auto-upload="false"
          >
            <i class="el-icon-picture-outline"></i>
          </el-upload>
          <!-- 文件 -->
          <el-upload
            :limit="1"
            action=""
            :on-change="handleLimit"
            :auto-upload="false"
          >
            <i class="el-icon-folder-opened"></i>
          </el-upload>
          <!-- 历史记录 -->
          <div>
            <i class="el-icon-date" @click="chatHistoryShow = true"></i>
          </div>
        </div>
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

    <!-- @的成员列表 -->
    <!-- 1、若为团队的公开群聊，需要根据用户在团队中的角色来控制是否@所有人
    2、若为普通群聊，群主可以@所有人 -->
    <el-dialog :visible.sync="dialogVisible" width="20%">
      <el-table
        :data="memberList"
        @row-click="atSomebody"
        style="height: 200px; overflow-y: auto"
      >
        <el-table-column label="昵称">
          <template slot-scope="scope">
            {{ scope.row.username }}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 查看成员列表，从这里发起私聊 -->
    <el-dialog :visible.sync="memberDialogVisible" width="20%">
      <!-- 邀请用户加入群聊 -->
      <!-- 只有普通群聊群主才有邀请功能 -->
      <el-input
        placeholder="邀请用户加入群聊"
        v-model="inviteUserEmail"
        @keyup.enter.native="inviteUser"
        v-if="userRole == 'Group Creator'"
      >
        <el-button slot="append" @click="inviteUser">邀请</el-button>
      </el-input>

      <el-table :data="rawMemberList" style="height: 200px; overflow-y: auto">
        <el-table-column label="昵称">
          <template slot-scope="scope">
            {{ scope.row.username }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click.native="startPrivateChat(scope.row)"
              v-show="scope.row.id != $store.state.userInfo.id"
            >
              私聊
            </el-button>
            <!-- 表示自己 -->
            <span v-show="scope.row.id == $store.state.userInfo.id">自己 </span>
          </template>
        </el-table-column>
      </el-table>

      <!-- 只有普通群聊才有解散群聊和退出群聊功能 -->
      <div
        class="group-danger"
        v-if="userRole == 'Group Creator' || userRole == 'Group Member'"
      >
        <!-- 群主可以解散群聊 -->
        <el-button
          type="danger"
          @click="dismissGroup"
          v-if="userRole == 'Group Creator'"
        >
          解散群聊
        </el-button>

        <!--普通成员 退出群聊 -->
        <el-button
          type="danger"
          @click="quitGroup"
          v-if="userRole == 'Group Member'"
        >
          退出群聊
        </el-button>
      </div>
    </el-dialog>

    <!-- 创建群聊的对话框 -->
    <el-dialog
      :visible.sync="createGroupDialogVisible"
      title="创建群聊"
      width="20%"
    >
      <el-input
        placeholder="群聊名称"
        v-model="newProjectName"
        @keyup.enter.native="createProject"
      >
      </el-input>

      <span class="dialog-footer" slot="footer">
        <el-button @click="createGroupDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="createGroup"> 确认 </el-button>
      </span>
    </el-dialog>

    <!-- 查看历史记录 -->
    <el-dialog :visible.sync="chatHistoryShow" width="50%">
      <!-- 搜索历史记录 -->
      <el-input
        placeholder="搜索历史记录"
        v-model="key_words"
        @keyup.enter.native="searchHistoryMsg"
      >
        <el-button slot="append" @click="searchHistoryMsg">搜索</el-button>
      </el-input>

      <el-table
        :data="chatHistoryList"
        style="height: 300px; overflow-y: auto"
        @row-click="goCertainMsg"
      >
        <el-table-column>
          <template slot-scope="scope">
            <!-- 用户名和日期和内容 -->
            <div>
              <!-- 用户名日期 -->
              <div>
                <span class="name-left">{{ scope.row.username }}</span>
                <span class="date-left">{{ scope.row.datetime }}</span>
              </div>
              <!-- 内容 -->
              <div class="content-left">
                <!-- 普通文字消息 -->
                <span
                  v-if="!scope.row.is_merge && !scope.row.chat_file"
                  class="text-left"
                  >{{ scope.row.chat }}</span
                >
                <!-- 文件消息 -->
                <span v-else-if="!scope.row.is_merge && scope.row.chat_file">
                  <!-- 图片文件 -->
                  <img
                    :src="scope.row.chat_file"
                    alt=""
                    style="width: 50px; height: 50px; border-radius: 5px"
                    v-show="
                      scope.row.chat_file.endsWith('.jpg') ||
                      scope.row.chat_file.endsWith('.png') ||
                      scope.row.chat_file.endsWith('.gif')
                    "
                  />
                  <!-- 其他文件 -->
                  <el-card
                    shadow="hover"
                    v-show="
                      !scope.row.chat_file.endsWith('.jpg') &&
                      !scope.row.chat_file.endsWith('.png') &&
                      !scope.row.chat_file.endsWith('.gif')
                    "
                    @click.native="
                      downloadFile(scope.row.chat_file, scope.row.file_name)
                    "
                  >
                    [文件] {{ scope.row.file_name }}
                  </el-card>
                </span>
                <!-- 合并消息 -->
                <span v-else class="text-left">
                  这是一条合并消息，点击查看
                </span>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 合并转发对话框 -->
    <el-dialog :visible.sync="forwardDialogVisible" width="20%">
      <!-- 标题 -->
      <span slot="title">选择一个转发对象</span>
      <el-table
        :data="chatObjList"
        style="height: 200px; overflow-y: auto"
        @row-click="mergeForwardToGroup"
      >
        <el-table-column label="转发对象">
          <template slot-scope="scope">
            {{ scope.row.group_name }}
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
import FileSaver from "file-saver";
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

      // 查看成员列表
      memberDialogVisible: false,
      // 原始成员列表，不带所有人
      rawMemberList: [],

      dialogVisible: false,

      // 当前聊天对象下的身份
      userRole: "",

      // @的对象的id
      atTo: "",
      // 带有@的聊天记录id
      chat_record_id: "",

      createGroupDialogVisible: false,

      newProjectName: "",

      // 是否显示历史记录
      chatHistoryShow: false,

      // 是否是私聊
      is_private: false,

      // 邀请对象的
      inviteUserEmail: "",

      // 是否正在多选转发
      isAllMerging: false,

      forwardDialogVisible: false,

      key_words: "",

      // 历史记录列表
      chatHistoryList: [],
    };
  },
  methods: {
    // 下载文件（聊天记录里面的）
    downloadFile(file, name) {
      this.axios({
        method: "get",
        url: file,
        responseType: "blob",
      })
        .then((res) => {
          FileSaver.saveAs(res.data, name);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 筛选历史记录
    searchHistoryMsg() {
      this.axios({
        method: "get",
        url: "/chat/chatrecord",
        params: {
          jwt: JSON.parse(localStorage.getItem("jwt")),
          group_chat_id: this.chattingObj.id,
          key_words: this.key_words,
        },
      })
        .then((res) => {
          if (res.data.result == 0) {
            this.chatHistoryList = res.data.data;
          } else {
            this.$message({
              message: "获取历史记录失败",
              type: "error",
            });
          }
        })
        .catch((err) => {
          //提示获取失败
          this.$message({
            message: "获取聊天内容失败",
            type: "error",
          });
        });
    },
    // 合并转发到群聊
    mergeForwardToGroup(group) {
      const merge_id = [];
      // 遍历所有的聊天内容对象，获取是否被选中，如果被选中，将其id加入到merge_id中
      this.chattingContentList.forEach((item, index) => {
        if (this.$refs.chatContentItemRef[index].selected) {
          merge_id.push(item.id);
        }
      });

      let formData = new FormData();

      formData.append("group_id", group.id);
      formData.append("jwt", JSON.parse(localStorage.getItem("jwt")));

      // 遍历
      merge_id.forEach((item, index) => {
        formData.append("merge_id", item);
      });

      this.axios({
        url: "/chat/chattransmerge/",
        method: "post",
        data: formData,
      })
        .then((res) => {
          if (res.data.result == 0) {
            this.$message({
              message: "转发成功",
              type: "success",
            });
          } else {
            this.$message({
              message: res.data.msg,
              type: "error",
            });
          }
        })
        .catch((err) => {
          this.$message({
            message: "转发失败",
            type: "error",
          });
        });

      this.forwardDialogVisible = false;
      this.setAllMerging(false);
    },
    // 修改多选转发区域以及每条消息的单选框是否出现
    setAllMerging(value) {
      this.isAllMerging = value;

      // 遍历所有的聊天内容对象，将所有的聊天内容对象的merging设置为value
      this.chattingContentList.forEach((item, index) => {
        this.$refs.chatContentItemRef[index].setMerging(value);
      });
    },

    // 退出群聊
    quitGroup() {
      // 提示是否退出群聊
      this.$confirm("是否退出群聊", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.axios({
            url: `/chat/group_chat/${this.chattingObj.id}/user`,
            method: "delete",
            data: qs.stringify({
              jwt: JSON.parse(localStorage.getItem("jwt")),
            }),
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }).then((res) => {
            console.log(res);
            this.$message({
              message: "退出群聊成功",
              type: "success",
            });
            this.memberDialogVisible = false;

            // 修改聊天对象列表
            this.chatObjList = this.chatObjList.filter(
              (item) => item.id != this.chattingObj.id
            );
          });
        })
        .catch(() => {});
    },

    // 邀请用户
    inviteUser() {
      this.axios({
        url: `chat/group_chat/${this.chattingObj.id}`,
        method: "put",
        data: qs.stringify({
          jwt: JSON.parse(localStorage.getItem("jwt")),
          user_email: this.inviteUserEmail,
        }),
      })
        .then((res) => {
          console.log(res);
          this.$message({
            message: "发送邀请成功",
            type: "success",
          });
          this.inviteUserEmail = "";
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "邀请失败",
            type: "error",
          });
        });
    },

    // 解散群聊
    dismissGroup() {
      this.$confirm("是否解散群聊", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.axios({
            url: `/chat/group_chat/${this.chattingObj.id}`,
            method: "delete",
            data: qs.stringify({
              jwt: JSON.parse(localStorage.getItem("jwt")),
            }),
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }).then((res) => {
            console.log(res);
            this.$message({
              message: "解散群聊成功",
              type: "success",
            });
            this.memberDialogVisible = false;

            // 修改聊天对象列表
            this.chatObjList = this.chatObjList.filter(
              (item) => item.id != this.chattingObj.id
            );
          });
        })
        .catch((err) => {});
    },

    goCertainMsg(targetMsg) {
      // 关闭历史记录
      this.chatHistoryShow = false;
      // 导航至指定的聊天消息位置
      const chatBox = this.$refs.scrollbarRef; // 获取可滚动盒子的DOM元素
      let target;
      // 遍历找到targetMsg对应的DOM元素
      this.chattingContentList.forEach((item, index) => {
        if (item.id == targetMsg.id) {
          target = chatBox.children[index];
        }
      });
      if (target) {
        // 使用DOM操作将选择的消息位置滚动到可视区域
        chatBox.scrollTop = target.offsetTop - chatBox.offsetTop;
      }

      // 清空输入
      this.key_words = "";

      // 清空搜索结果
      this.chatHistoryList = [];
    },

    handleLimit(file) {
      console.log(file);
      this.sendFileMsg(file);
    },

    // 发送文件消息
    async sendFileMsg(file) {
      let formData = new FormData();
      formData.append("file", file.raw);
      formData.append("jwt", JSON.parse(localStorage.getItem("jwt")));
      formData.append("group_chat_id", this.chattingObj.id);
      formData.append("user_id", this.$store.state.userInfo.id);

      // 上传文件，返回文件地址
      let res = await this.axios({
        url: "/chat/chatrecord/",
        method: "post",
        data: formData,
      });

      if (res.data.result == 0) {
        this.$message({
          message: res.data.msg,
          type: "success",
        });

        // websocket转发
        this.chattingObj.socket.send(
          JSON.stringify({
            id: res.data.data.id,
            username: this.$store.state.userInfo.username,
            // 获取当前时间
            datetime: new Date().toLocaleString(),
            chat_file: res.data.data.chat_file,
            file_name: res.data.data.file_name,
          })
        );
      } else {
        this.$message({
          message: res.data.msg,
          type: "error",
        });
      }

      // 滚动到底部
      this.$refs.scrollbarRef.scrollTop = this.$refs.scrollbarRef.scrollHeight;
    },

    // 私聊
    startPrivateChat(item) {
      // 遍历聊天对象数组，查找是否已经存在私聊对象
      // bug: 若群聊名称与用户名相同，则会跳转到该群聊，而不会创建私聊
      for (let i = 0; i < this.chatObjList.length; i++) {
        if (this.chatObjList[i].group_name == item.username) {
          this.changeChattingObj(this.chatObjList[i]);
          // 关闭私聊列表
          this.memberDialogVisible = false;
          return;
        }
      }

      // 如果不存在，创建私聊对象
      this.axios({
        url: "/chat/group_chat/",
        method: "post",
        data: qs.stringify({
          jwt: JSON.parse(localStorage.getItem("jwt")),
          group_chat_name: item.username,
          private: 1,
          to_user_id: item.id,
        }),
      })
        .then((res) => {
          if (res.data.result == 0) {
            this.$message({
              message: "创建私聊成功",
              type: "success",
            });
            const newItem = {
              id: res.data.data.id,
              creator: res.data.data.creator.username,
              group_name: item.username,
              chatContentList: [],
              socket: new WebSocket(
                "ws://8.130.12.73" + "/room/" + res.data.data.id + "/"
              ),
            };

            newItem.socket.onopen = () => {
              console.log("连接成功");
            };
            newItem.socket.onmessage = (e) => {
              console.log("webSocket message", e);
              const msgData = JSON.parse(e.data);
              console.log(msgData);
              newItem.chatContentList.push(msgData);
            };
            newItem.socket.onclose = (e) => {
              console.log("断开连接", e);
            };

            // 修改聊天对象列表
            this.chatObjList.push(newItem);

            // 切换到该私聊对象
            this.changeChattingObj(newItem);

            // 关闭私聊对话框
            this.memberDialogVisible = false;
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
            message: "创建私聊失败",
            type: "error",
          });
        });
    },

    atSomebody(item) {
      this.dialogVisible = false;
      this.content += item.username;

      //某人
      if (item.id) {
        this.atTo = item.id;
      }
      // 所有人
      else {
        // 遍历人员数组，获取除自己以外所有人的id
        this.atTo = [];
        // 从第二个开始
        for (let i = 1; i < this.memberList.length; i++) {
          this.atTo.push(this.memberList[i].id);
        }
      }
    },

    // 发送消息
    async sendMsg() {
      // 存储聊天内容
      let res = await this.axios({
        method: "post",
        url: "/chat/chatrecord/",
        data: qs.stringify({
          user_id: this.$store.state.userInfo.id,
          jwt: JSON.parse(localStorage.getItem("jwt")),
          group_chat_id: this.chattingObj.id,
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
          this.chat_record_id = res.data.data.id;
        }
      } else {
        this.$message({
          message: "保存聊天失败",
          type: "error",
        });
      }

      // 发送消息
      this.chattingObj.socket.send(
        JSON.stringify({
          id: res.data.data.id,
          username: this.$store.state.userInfo.username,
          // 获取当前时间
          datetime: new Date().toLocaleString(),
          chat: this.content,
        })
      );

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
    async changeChattingObj(item) {
      this.chattingObj = item;
      // console.log(this.chattingObj.team.id);
      // 更新聊天内容
      let res = await this.axios({
        method: "get",
        url: "/chat/chatrecord",
        params: {
          jwt: JSON.parse(localStorage.getItem("jwt")),
          group_chat_id: item.id,
        },
      });

      item.chatContentList = res.data.data;
      this.chattingContentList = item.chatContentList;

      // 获取新的群聊信息
      res = await this.axios({
        method: "get",
        url: `/chat/group_chat/${item.id}`,
        params: {
          jwt: JSON.parse(localStorage.getItem("jwt")),
        },
      });

      if (res.data.result == 0) {
        this.is_private = res.data.data.private;

        console.log(this.is_private);
        if (!this.is_private) {
          // 是群聊

          // 使用深拷贝，防止修改原数组
          this.memberList = JSON.parse(JSON.stringify(res.data.data.users));
          this.rawMemberList = JSON.parse(JSON.stringify(res.data.data.users));

          // 遍历修改当前用户身份
          // 1、公开群聊中userRole就是在团队中的身份
          // 2、普通群聊中userRole只有群主和普通成员两种身份，通过creator判断
          if (res.data.data.users[0].role) {
            console.log("公开群聊");
            // 公开群聊
            // 遍历
            this.memberList.forEach((item) => {
              if (item.id == this.$store.state.userInfo.id) {
                this.userRole = item.role;
              }
            });
          } else {
            console.log("普通群聊");
            // 普通群聊
            if (res.data.data.creator.id == this.$store.state.userInfo.id) {
              this.userRole = "Group Creator";
            } else {
              this.userRole = "Group Member";
            }
          }

          // 将自己的信息移除
          this.memberList.forEach((item, index) => {
            if (item.id == this.$store.state.userInfo.id) {
              this.memberList.splice(index, 1);
            }
          });

          // 如果不是普通成员则插入所有人
          if (
            this.userRole != "Common Member" ||
            this.userRole != "Group Member"
          ) {
            this.memberList.unshift({
              username: "所有人",
            });
          }
        } else {
          this.memberList = [];
          this.rawMemberList = [];
        }
      } else {
        this.$message({
          message: res.data.msg,
          type: "error",
        });
      }

      // 清空输入框
      this.content = "";

      // 滚动到底部
      this.$refs.scrollbarRef.scrollTop = this.$refs.scrollbarRef.scrollHeight;
    },

    // 获取指定聊天对象的聊天内容
    getChatContentList(chatObj) {
      // console.log(111);
      this.axios({
        method: "get",
        url: "/chat/chatrecord",
        params: {
          jwt: JSON.parse(localStorage.getItem("jwt")),
          group_chat_id: chatObj.id,
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

    // 创建群聊
    async createGroup() {
      let res = await this.axios({
        method: "post",
        url: "/chat/group_chat/",
        data: qs.stringify({
          jwt: JSON.parse(localStorage.getItem("jwt")),
          group_chat_name: this.newProjectName,
        }),
      });

      if (res.data.result == 0) {
        // 创建成功
        this.$message({
          message: "创建成功",
          type: "success",
        });

        // 关闭对话框
        this.createGroupDialogVisible = false;

        // 清空输入框
        this.newProjectName = "";

        const newItem = {
          id: res.data.data.id,
          creator: res.data.data.creator.username,
          group_name: res.data.data.group_name,
          chatContentList: [],
          socket: new WebSocket(
            "ws://8.130.12.73" + "/room/" + res.data.data.id + "/"
          ),
        };

        newItem.socket.onopen = () => {
          console.log("连接成功");
        };
        newItem.socket.onmessage = (e) => {
          console.log("webSocket message", e);
          const msgData = JSON.parse(e.data);
          console.log(msgData);
          newItem.chatContentList.push(msgData);
        };
        newItem.socket.onclose = (e) => {
          console.log("断开连接", e);
        };

        // 修改聊天对象列表
        this.chatObjList.push(newItem);

        // 修改当前聊天对象
        this.changeChattingObj(newItem);
      } else {
        // 创建失败
        this.$message({
          message: "创建失败",
          type: "error",
        });
      }
    },
  },
  async created() {
    // 获取聊天对象列表
    let res = await this.axios({
      method: "get",
      url: "/chat/group_chat_list",
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

    res = await this.axios({
      method: "get",
      url: "/chat/chatrecord",
      params: {
        jwt: JSON.parse(localStorage.getItem("jwt")),
        group_chat_id: this.chatObjList[0].id,
      },
    });

    this.chatObjList[0].chatContentList = res.data.data;

    // this.getChatContentList(this.chatObjList[0]);

    // console.log(this.chattingObj);

    this.chattingContentList = this.chatObjList[0].chatContentList;

    // 遍历聊天对象列表，获取历史记录并为每个对象创建一个 WebSocket 连接
    this.chatObjList.forEach((item) => {
      // 获取历史聊天内容
      this.getChatContentList(item);

      // 创建 WebSocket 连接
      item.socket = new WebSocket(
        "ws://8.130.12.73" + "/room/" + item.id + "/"
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
.chat-list {
  margin-top: 10px;
  overflow-y: auto;
  height: 500px;
}
.chat-right {
  width: 80%;
  background-color: #d4d9de;
}
.chat-obj-name {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  padding: 10px;
}
.chat-input {
  padding: 10px;
}
.tools {
  display: flex;
  /* align-items: center; */
  border-top: 1px solid #ccc;
}

.tools > div {
  height: 20px;
  width: 20px;
  margin: 0 5px;
  cursor: pointer;
}

.tools > div:hover {
  background-color: #ccc;
}

.tools i {
  font-size: 20px;
  text-align: center;
}

.el-icon-plus:hover {
  background-color: #ccc;
}

.group-danger {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.chat-forward {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 80px;
}

.content-left {
  padding: 10px;
}

.name-left {
  font-weight: bold;
  margin-right: 10px;
}

.date-left {
  font-size: 12px;
  text-align: left;
}

.text-left {
  background-color: #f0f0f0;
  border-radius: 5px;
  padding: 8px;
}
</style>
