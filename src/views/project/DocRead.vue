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
  </div>
</template>
<script>
import { ThemeRiverChart } from "echarts/charts";
import Vditor from "vditor";
import "vditor/dist/index.css";

export default {
  data() {
    return {
      contentEditor: "",
      document_title: "测试文档",
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
        "fullscreen",
        "edit-mode",
      ],
      cache: {
        enable: false,
      },
    });
    let project_id = this.$route.query.project_id;
    let share_code = this.$route.query.share_code;
    this.axios({
      method: "GET",
      url: `/project/${project_id}/document/share`,
      params: {
        share_code: share_code,
      },
    })
      .then((res) => {
        console.log(res.data.data.text);
        this.contentEditor.setValue(res.data.data.text);
        this.document_title = res.data.data.doc_name;
      })
      .catch((err) => {
        console.log(err);
      });
  },
  methods: {
    saveDoc() {
      let formData = new FormData();
      formData.append("doc_name", this.document_title);
      formData.append("text", this.contentEditor.getValue());
      let project_id = this.$route.query.project_id;
      let share_code = this.$route.query.share_code;
      this.axios({
        method: "PUT",
        url: `/project/${project_id}/document/share?share_code=${share_code}`,
        data: formData,
      })
        .then((res) => {
          console.log(res.data);
          if (res.data.result == 1) {
            this.$message.error("无权限");
          } else {
            this.$message.success("保存成功！");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
