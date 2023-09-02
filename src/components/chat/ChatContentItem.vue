<template>
  <div class="content-item">
    <!-- 单选框 -->
    <el-checkbox
      class="checkbox"
      v-model="selected"
      v-show="merging"
    ></el-checkbox>

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
        <div class="content-left" @contextmenu.prevent="onContextmenu">
          <!-- 普通文字消息 -->
          <span v-if="!item.is_merge && !item.chat_file" class="text-left">{{
            item.chat
          }}</span>
          <!-- 文件消息 -->
          <span v-else-if="!item.is_merge && item.chat_file">
            <!-- 图片文件 -->
            <img
              :src="item.chat_file"
              alt=""
              style="width: 50px; height: 50px; border-radius: 5px"
              v-show="
                item.chat_file.endsWith('.jpg') ||
                item.chat_file.endsWith('.png') ||
                item.chat_file.endsWith('.gif')
              "
            />
            <!-- 其他文件 -->
            <el-card
              shadow="hover"
              v-show="
                !item.chat_file.endsWith('.jpg') &&
                !item.chat_file.endsWith('.png') &&
                !item.chat_file.endsWith('.gif')
              "
              @click.native="downloadFile(item.chat_file, item.file_name)"
            >
              [文件] {{ item.file_name }}
            </el-card>
          </span>
          <!-- 合并消息 -->
          <span v-else @click="showMerge(item.id)" class="text-left">
            这是一条合并消息，
            <strong>点击查看</strong>
          </span>
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
        <!-- 日期和姓名 -->
        <div style="text-align: right">
          <span class="date-right">{{ item.datetime }}</span>
          <span class="name-right">{{ item.username }}</span>
        </div>
        <!-- 内容 -->
        <div class="content-right" @contextmenu.prevent="onContextmenu">
          <!-- 普通文字消息 -->
          <span v-if="!item.is_merge && !item.chat_file" class="text-right">{{
            item.chat
          }}</span>
          <!-- 文件消息 -->
          <span v-else-if="!item.is_merge && item.chat_file">
            <!-- 图片文件 -->
            <img
              :src="item.chat_file"
              alt=""
              style="width: 50px; height: 50px; border-radius: 5px"
              v-show="
                item.chat_file.endsWith('.jpg') ||
                item.chat_file.endsWith('.png') ||
                item.chat_file.endsWith('.gif')
              "
            />
            <!-- 其他文件 -->
            <el-card
              shadow="hover"
              v-show="
                !item.chat_file.endsWith('.jpg') &&
                !item.chat_file.endsWith('.png') &&
                !item.chat_file.endsWith('.gif')
              "
              @click.native="downloadFile(item.chat_file, item.file_name)"
            >
              [文件] {{ item.file_name }}
            </el-card>
          </span>
          <!-- 合并消息 -->
          <span v-else @click="showMerge(item.id)" class="text-right">
            这是一条合并消息，
            <strong>点击查看</strong>
          </span>
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

    <!-- 单条转发对话框 -->
    <el-dialog :visible.sync="forwardDialogVisible" width="20%">
      <!-- 标题 -->
      <span slot="title">选择一个转发对象</span>
      <el-table
        :data="chatObjList"
        style="height: 200px; overflow-y: auto"
        @row-click="forwardToGroup"
      >
        <el-table-column label="转发对象">
          <template slot-scope="scope">
            {{ scope.row.group_name }}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 合并消息对话框 -->
    <el-dialog :visible.sync="mergeDialogVisible" width="50%">
      <!-- 标题 -->
      <span slot="title">合并消息</span>
      <el-table :data="mergeList" style="height: 300px; overflow-y: auto">
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
                    @click.native="downloadFile(scope.row.chat_file, scope.row.file_name)"
                  >
                    [文件] {{ scope.row.file_name }}
                  </el-card>
                </span>
                <!-- 合并消息 -->
                <span v-else @click="showMerge(scope.row.id)" class="text-left">
                  这是一条合并消息，
                  <strong>点击查看</strong>
                </span>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import qs from "qs";
import FileSaver from "file-saver";
export default {
  data() {
    return {
      // 随机头像
      avatar: "https://picsum.photos/200/200",

      // 是否选中
      selected: false,

      forwardDialogVisible: false,

      mergeDialogVisible: false,
      mergeList: [],

      merging: false,
    };
  },
  methods: {
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
    setMerging(value) {
      this.merging = value;
    },
    // 显示合并消息
    showMerge(chat_id) {
      this.mergeDialogVisible = true;

      // 获取合并消息
      this.axios({
        method: "get",
        url: "/chat/chattransmerge/",
        params: {
          chat_id: chat_id,
        },
      })
        .then((res) => {
          if (res.data.result == 0) {
            this.mergeList = res.data.data;
          } else {
            this.$message({
              type: "error",
              message: "获取合并消息失败",
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    forwardToGroup(group) {
      this.axios({
        method: "post",
        url: "/chat/chattranssingle/",
        data: qs.stringify({
          jwt: JSON.parse(localStorage.getItem("jwt")),
          group_id: group.id,
          chat_id: this.item.id,
        }),
      })
        .then((res) => {
          if (res.data.result == 0) {
            this.$message({
              type: "success",
              message: "转发成功",
            });
          } else {
            this.$message({
              type: "error",
              message: "转发失败",
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });

      // 转发消息同样需要websocket

      this.forwardDialogVisible = false;
    },

    onContextmenu(event) {
      this.$contextmenu({
        items: [
          {
            label: "转发",
            onClick: () => {
              // 弹出转发对话框
              this.forwardDialogVisible = true;
            },
          },
          {
            label: "多选",
            onClick: () => {
              this.$emit("setAllMerging", true);
            },
          },
        ],
        event, // 鼠标事件信息
        customClass: "custom-class", // 自定义菜单 class
        zIndex: 3, // 菜单样式 z-index
        minWidth: 30, // 主菜单最小宽度
      });
      return false;
    },
  },
  // 接收传来的props
  props: ["item", "chatObjList", "socket"],
};
</script>

<style scoped>
.content-item {
  margin-bottom: 5px;
  display: flex;
  align-items: center;
}

.content-item-left {
  display: flex;
  flex: 1;
}

.content-item-right {
  display: flex;
  flex: 1;
  justify-content: flex-end;
}

.content-left {
  padding: 10px;
}

.content-right {
  text-align: right;
  padding: 10px;
}

.text-right {
  background-color: aliceblue;
  border-radius: 5px;
  padding: 8px;
}

.text-left {
  background-color: #f0f0f0;
  border-radius: 5px;
  padding: 8px;
}

.name-left {
  font-weight: bold;
  margin-right: 10px;
}

.name-right {
  font-weight: bold;
  margin-left: 10px;
  text-align: right;
}

.date-right {
  font-size: 12px;
  text-align: right;
}

.date-left {
  font-size: 12px;
  text-align: left;
}
/* 
.el-checkbox {
  width: 20px;
  height: 20px;
} */
</style>
