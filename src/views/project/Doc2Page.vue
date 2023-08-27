<template>
  <div class="order">
    <div style="text-align: center">
      <h3>{{ this.document_title }}</h3>
    </div>
    <div id="vditor"></div>
    <div style="margin-top: 30px">
      <el-button
        type="primary"
        style="margin-left: 450px; margin-right: 100px"
        @click="atOthers"
        >艾特</el-button
      >
      <el-button type="primary" @click="saveDoc">保存</el-button>
    </div>
    <el-dialog :visible.sync="dialogVisible">
      <el-table
        :data="members"
        @row-click="handleRowClick"
        style="height: 200px; overflow-y: auto"
      >
        <el-table-column label="昵称">
          <template slot-scope="scope">
            {{ scope.row }}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import Vditor from "vditor";
import "vditor/dist/index.css";

export default {
  data() {
    return {
      dialogVisible: false,
      members: [
        { name: "Roxie 1", id: 1 },
        { name: "Roxie 2", id: 2 },
        { name: "Roxie 3", id: 3 },
        { name: "Roxie 4", id: 4 },
      ],
      contentEditor: "",
      document_title: "测试文档",
    };
  },
  mounted() {
    this.contentEditor = new Vditor("vditor", {
      height: 500,
      toolbarConfig: {
        pin: true,
      },
      toolbar: [
        "emoji",
        "headings",
        "bold",
        "italic",
        "strike",
        "link",
        "|",
        "list",
        "ordered-list",
        "check",
        "outdent",
        "indent",
        "|",
        "quote",
        "line",
        "code",
        "inline-code",
        "insert-before",
        "insert-after",
        "|",
        "table",
        "|",
        "undo",
        "redo",
        "|",
        "fullscreen",
        "edit-mode",
      ],
      cache: {
        enable: false,
      },
      after: () => {
        this.contentEditor.setValue("hello,Vditor+Vue!");
      },
    });
    //获取members
    let formData = new FormData();
    formData.append("JWT", JSON.parse(localStorage.getItem("loginInfo")).JWT);
    formData.append("project_id", this.$route.params.project_id);
    this.axios({
      method: "POST",
      url: "",
      data: formData,
    })
      .then((res) => {
        this.$message.success("保存成功");
      })
      .catch((err) => {
        this.$message.error("跳转失败");
        console.log(err);
      });
  },
  beforeRouteEnter(to, from, next) {
    next();
    let formData = new FormData();
    formData.append("JWT", JSON.parse(localStorage.getItem("loginInfo")).JWT);
    formData.append("document_id", to.query.document_id);
    this.axios({
      method: "POST",
      url: "",
      data: formData,
    })
      .then((res) => {
        if (res.result == 0) {
          next();
        } else {
          this.$message.error("无权限");
          next(from.fullPath);
        }
      })
      .catch((err) => {
        this.$message.error("跳转失败");
        console.log(err);
        next(from.fullPath);
      });
  },
  beforeRouteLeave(to, from, next) {
    next();
    let formData = new FormData();
    formData.append("JWT", JSON.parse(localStorage.getItem("loginInfo")).JWT);
    formData.append("document_id", this.$route.query.document_id);
    this.axios({
      method: "POST",
      url: "",
      data: formData,
    })
      .then((res) => {
        if (res.result == 0) {
          next();
        } else {
          this.$message.error("退出编辑失败");
        }
      })
      .catch((err) => {
        this.$message.error("退出编辑失败");
        console.log(err);
      });
  },
  methods: {
    saveDoc() {
      console.log(this.contentEditor.getValue());
      let formData = new FormData();
      formData.append("JWT", JSON.parse(localStorage.getItem("loginInfo")).JWT);
      formData.append("document_id", this.$route.query.document_id);
      this.axios({
        method: "POST",
        url: "",
        data: formData,
      })
        .then((res) => {
          this.$message.success("保存成功");
        })
        .catch((err) => {
          this.$message.error("跳转失败");
          console.log(err);
        });
    },
    atOthers() {
      this.dialogVisible = true;
    },
    handleRowClick(item) {
      this.dialogVisible = false;
      this.contentEditor.setValue(
        this.contentEditor.getValue() + "\n" + "@" + item.name
      );
      //发送消息
    },
  },
};
</script>
