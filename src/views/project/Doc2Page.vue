<template>
  <div class="order">
    <div style="text-align: center">
      <h3>{{ this.document_title }}</h3>
    </div>
    <div id="vditor"></div>
    <!--div style="margin-top: 30px">
      <el-button
        type="primary"
        style="margin-left: 450px; margin-right: 100px"
        @click="atOthers"
        >艾特</el-button>
      <el-button type="primary" @click="saveDoc" style="margin-left: 500px"
        >保存</el-button
      >
    </div-->
    <el-dialog :visible.sync="dialogVisible">
      <el-table
        :data="members"
        @row-click="handleRowClick"
        style="height: 200px; overflow-y: auto"
      >
        <el-table-column label="昵称">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog
      title="分享链接"
      :visible="shareDialogVisible"
      @close="closeShareDialog"
    >
      <div style="text-align: center">
        <h4>可编辑链接</h4>
        <h6>链接1: {{ link1 }}</h6>
      </div>
      <div style="text-align: center">
        <h4>不可编辑链接</h4>
        <h6>链接2: {{ link2 }}</h6>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { ThemeRiverChart } from "echarts/charts";
import Vditor from "vditor";
import "vditor/dist/index.css";

export default {
  /* created() {
    window.addEventListener("keydown", this.handleKeyPress);
  },
  destroyed() {
    window.removeEventListener("keydown", this.handleKeyPress);
  }, */
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
      shareDialogVisible: false,
      link1: "",
      link2: "",
      share_code_y: "",
      share_code_n: "",
    };
  },
  mounted() {
    let that = this;
    this.contentEditor = new Vditor("vditor", {
      height: 550,
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
        /* {
          hotkey: "",
          name: "at",
          tipPosition: "s",
          tip: "艾特",
          className: "right",
          icon: `<img style="height: 16px" src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><path fill='none' d='M0 0h24v24H0z'/><path d='M12 22A9 9 0 1 0 3 13h2a7 7 0 1 1 10 0h2a9 9 0 0 0-9 9zm-2-9a5 5 0 1 0 10 0H10zm-1-7h2v2h-2zm4 0h2v2h-2zm-8 0h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2zm1-2v2h2V6h-2zm-4 0h2v2h-2zm-4 0h2v2H7zm-1 4v2h2v-2H6zm4 0h2v2h-2zm4 0h2v2h-2zm1-2v2h2v-2h-2zM6 16v-2H4v2h2zm4 0h2v-2h-2v2zm4 0h2v-2h-2v2zm1-2v-2h-2v2h2zM6 12H4v2h2v-2zm4 0h2v-2h-2v2zm4 0h2v-2h-2v2zm1-2v-2h-2v2h2zM6 8H4v2h2V8zm4 0h2V6h-2v2zm4 0h2V6h-2v2zm1-2v2h2V6h-2zM6 4H4v2h2V4zm4 0h2V2h-2v2zm4 0h2V2h-2v2zm1-2v2h2V2h-2z'/></svg>" alt="At Symbol">`,

          click() {
            that.atOthers();
          },
        }, */
        /* {
          hotkey: "",
          name: "share",
          tipPosition: "s",
          tip: "分享",
          className: "right",
          icon: `<img style="height: 16px" src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><path fill='none' d='M0 0h24v24H0z'/><path d='M12 22A9 9 0 1 0 3 13h2a7 7 0 1 1 10 0h2a9 9 0 0 0-9 9zm-2-9a5 5 0 1 0 10 0H10zm-1-7h2v2h-2zm4 0h2v2h-2zm-8 0h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2zm1-2v2h2V6h-2zm-4 0h2v2h-2zm-4 0h2v2H7zm-1 4v2h2v-2H6zm4 0h2v2h-2zm4 0h2v2h-2zm1-2v2h2v-2h-2zM6 16v-2H4v2h2zm4 0h2v-2h-2v2zm4 0h2v-2h-2v2zm1-2v-2h-2v2h2zM6 12H4v2h2v-2zm4 0h2v-2h-2v2zm4 0h2v-2h-2v2zm1-2v-2h-2v2h2zM6 8H4v2h2V8zm4 0h2V6h-2v2zm4 0h2V6h-2v2zm1-2v2h2V6h-2zM6 4H4v2h2V4zm4 0h2V2h-2v2zm4 0h2V2h-2v2zm1-2v2h2V2h-2z'/></svg>" alt="At Symbol">`,
          click() {
            that.showShareDialog();
          },
        }, */
        {
          hotkey: "",
          name: "save",
          tipPosition: "s",
          tip: "保存",
          className: "right",
          icon: `<img style="height: 16px" src='https://img.58cdn.com.cn/escstatic/docs/imgUpload/idocs/save.svg'/>`,
          click() {
            that.saveDoc();
          },
        },
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
    });

    //获取members
    /* let formData = new FormData();
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
      }); */
    let project_id = this.$route.params.project_id;
    let document_id = this.$route.query.document_id;
    this.axios({
      method: "GET",
      url: `/project/${project_id}/document/${document_id}`,
      params: {
        jwt: JSON.parse(localStorage.getItem("jwt")),
      },
    })
      .then((res) => {
        this.contentEditor.setValue(res.data.data.text);
        this.document_title = res.data.data.doc_name;
      })
      .catch((err) => {
        console.log(err);
      });
    this.axios({
      method: "GET",
      url: `/project/${project_id}/document/${document_id}`,
      params: {
        jwt: JSON.parse(localStorage.getItem("jwt")),
        need_share: true,
        can_modify: true,
      },
    })
      .then((res) => {
        this.share_code_y = res.data.data.share_code;
      })
      .catch((err) => {
        console.log(err);
      });
    this.axios({
      method: "GET",
      url: `/project/${project_id}/document/${document_id}`,
      params: {
        jwt: JSON.parse(localStorage.getItem("jwt")),
        need_share: true,
        can_modify: false,
      },
    })
      .then((res) => {
        this.share_code_n = res.data.data.share_code;
      })
      .catch((err) => {
        console.log(err);
      });
  },
  methods: {
    handleKeyPress(event) {
      if (event.key === "@") {
        this.dialogVisible = true;
        event.preventDefault();
      }
    },
    saveDoc() {
      let formData = new FormData();
      formData.append("jwt", JSON.parse(localStorage.getItem("jwt")));
      formData.append("text", this.contentEditor.getValue());
      let document_id = this.$route.query.document_id;
      let project_id = this.$route.params.project_id;
      console.log(this.contentEditor.getValue());
      this.axios({
        method: "PUT",
        url: `/project/${project_id}/document/${document_id}`,
        data: formData,
      })
        .then((res) => {
          console.log(res.data);
          this.$message.success("保存成功！");
        })
        .catch((err) => {
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
    showShareDialog() {
      // 根据您的项目和文档ID生成链接
      const project_id = this.$route.params.project_id; // 替换为实际的项目ID
      this.link1 = `http://8.130.12.73/api/docread?project_id=${project_id}&share_code=${this.share_code_y}`;
      this.link2 = `http://8.130.12.73/api/docread?project_id=${project_id}&share_code=${this.share_code_n}`;
      this.shareDialogVisible = true;
    },
    closeShareDialog() {
      this.shareDialogVisible = false;
    },
  },
};
</script>
