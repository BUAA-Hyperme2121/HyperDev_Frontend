<template>
  <div class="msg">
    <!-- 左边的消息列表 -->
    <div class="msg-left">
      <!-- 顶部操作栏 -->
      <div class="msg-tool">
        <!-- 一键已读 -->
        <el-button @click.native="setAllRead"> 一键已读 </el-button>
        <!-- 一键删除已读消息 -->
        <el-button type="danger" @click.native="delReadMsg">
          删除已读消息
        </el-button>
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
import qs from "qs";
import MsgItem from "@/components/message/MsgItem.vue";
export default {
  components: {
    MsgItem,
  },
  data() {
    return {
      msgList: [],

      timer: null,
    };
  },
  methods: {
    // 查看消息详情
    getDetail(id) {
      // console.log(id);
      // console.log("bbb");
      this.$router.push({
        path: "/home/message/detail",
        query: {
          message_id: id,
        },
      });

      // 设为已读
      this.axios({
        method: "patch",
        url: `/message/${id}`,
        data: qs.stringify({
          jwt: JSON.parse(localStorage.getItem("jwt")),
        }),
      })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 获取消息列表
    getMsgList() {
      this.axios({
        method: "get",
        url: "/message",
        params: {
          jwt: JSON.parse(localStorage.getItem("jwt")),
        },
      })
        .then((res) => {
          this.msgList = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 一键已读
    setAllRead() {
      // 遍历消息列表，全部设为已读
      for (let i = 0; i < this.msgList.length; i++) {
        this.axios({
          method: "patch",
          url: `/message/${this.msgList[i].id}`,
          data: qs.stringify({
            jwt: JSON.parse(localStorage.getItem("jwt")),
          }),
        })
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });
      }

      // 重新获取消息列表
      this.getMsgList();
    },

    // 删除已读消息
    delReadMsg() {
      // 遍历消息列表，删除已读消息
      for (let i = 0; i < this.msgList.length; i++) {
        if (this.msgList[i].is_read == true) {
          this.axios({
            method: "delete",
            url: `/message/${this.msgList[i].id}`,
            data: qs.stringify({
              jwt: JSON.parse(localStorage.getItem("jwt")),
            }),
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          })
            .then((res) => {
              console.log(res);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }
      this.getMsgList();
    },

    // 终止轮询方法
    // handleStopPolling() {
    //   this.timeCount++;
    //   if (this.timeCount > 4) {
    //     this.setTimerNull(); // 轮询超过4次终止
    //     return true; // 阻止代码继续执行
    //   } else {
    //     return false;
    //   }
    // },

    setTimerNull() {
      clearInterval(this.timer);
      this.timer = null;
    },

    // 轮询开启
    handlePolling() {
      this.timer = setInterval(() => {
        this.getMsgList();
      }, 500);
    },
  },

  beforeDestory() {
    this.setTimerNull(); // 组件销毁前清空定时器
  },

  created() {
    this.handlePolling(); // 开启轮询
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
