<template>
  <div style="text-align: center; width: 90%; margin: auto">
    <h3>{{ this.document_title }}</h3>
    <div ref="editor" class="ql-editor"></div>

    <!-- @弹窗 -->

    <el-dialog :visible.sync="dialogVisible">
      <el-table
        :data="members"
        @row-click="handleRowClick"
        style="height: 200px; overflow-y: auto"
      >
        <el-table-column label="昵称">
          <template slot-scope="scope">
            {{ scope.row.username }}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 分享弹窗 -->

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

    <!-- 导出弹窗 -->

    <el-dialog
      title="导出文件"
      :visible="exportDialogVisble"
      @close="closeExportDialog"
    >
      <el-button @click="convertToMarkdown">导出成Markdown</el-button>
      <el-button @click="convertToPDF">导出成PDF</el-button>
      <el-button @click="convertToWord">导出成word</el-button>
    </el-dialog>

    <!-- 模板弹窗 -->

    <el-dialog
      :visible.sync="templateDialogVisible"
      title="选择你想要的模板"
      :append-to-body="true"
      :width="'250px'"
    >
      <el-select v-model="selectedItem">
        <el-option label="项目计划书" value="A"></el-option>
        <el-option label="会议纪要" value="B"></el-option>
        <el-option label="项目管理" value="C"></el-option>
        <el-option label="工作周报" value="D"></el-option>
        <el-option label="需求规格说明书" value="E"></el-option>
        <el-option label="架构设计说明书" value="F"></el-option>
      </el-select>

      <div slot="footer" class="dialog-footer">
        <el-button @click="importFile" type="primary">确认</el-button>
      </div>
    </el-dialog>

    <!-- 历史版本弹窗 -->

    <el-dialog :visible.sync="historyDialogVisible">
      <el-table :data="history_list" style="height: 300px; overflow-y: auto">
        <el-table-column label="保存者" width="100">
          <template slot-scope="scope">
            {{ scope.row.save_user.username }}
          </template>
        </el-table-column>
        <el-table-column label="保存时间">
          <template slot-scope="scope">
            {{ formatDateTime(scope.row.save_time) }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="showPreview(scope.row)">查看</el-button>
            <el-button @click="goBack(scope.row)">回退</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog :visible.sync="previewDialogVisible" width="76%"
      ><div ref="preview" class="preview-editor"></div>
    </el-dialog>
  </div>
</template>

<script>
import templateList from "@/assets/template/doc_template";
import Quill from "quill";
import QuillCursors from "quill-cursors";
import "quill/dist/quill.snow.css"; // 使用了 snow 主题色
import * as Y from "yjs";
import { QuillBinding } from "y-quill";
import { WebsocketProvider } from "y-websocket";
// import showdown from "showdown";
import TurndownService from "turndown";
import html2pdf from "html2pdf.js";
import FileSaver from "file-saver";
import htmlDocx from "html-docx-js/dist/html-docx";
import moment from "moment";

Quill.register("modules/cursors", QuillCursors);
//自定义图标

const Parchment = Quill.import("parchment");
const ShareStyle = new Parchment.Attributor.Style("share", "share", {
  scope: Parchment.Scope.BLOCK,
});
const SaveStyle = new Parchment.Attributor.Style("save", "save", {
  scope: Parchment.Scope.BLOCK,
});
const ExportStyle = new Parchment.Attributor.Style("export", "export", {
  scope: Parchment.Scope.BLOCK,
});
const TemplateStyle = new Parchment.Attributor.Style("export", "export", {
  scope: Parchment.Scope.BLOCK,
});
const HistoryStyle = new Parchment.Attributor.Style("history", "history", {
  scope: Parchment.Scope.BLOCK,
});
Quill.register(ShareStyle, true);
Quill.register(SaveStyle, true);
Quill.register(ExportStyle, true);
Quill.register(TemplateStyle, true);
Quill.register(HistoryStyle, true);
const shareImage = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="18" cy="5" r="3"></circle>
  <circle cx="6" cy="12" r="3"></circle>
  <circle cx="18" cy="19" r="3"></circle>
  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
</svg>`;
const saveImage = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M20 21H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12l6 6v10a2 2 0 0 1-2 2z"></path>
  <line x1="12" y1="17" x2="12" y2="9"></line>
  <polyline points="9 12 12 9 15 12"></polyline>
</svg>`;
const exportImage = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M21 16v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
  <polyline points="7 10 12 15 17 10"></polyline>
  <line x1="12" y1="15" x2="12" y2="3"></line>
</svg>`;
const templateImage = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-4-4z"></path>
  <polyline points="14 2 14 8 20 8"></polyline>
  <line x1="16" y1="13" x2="8" y2="13"></line>
  <line x1="16" y1="17" x2="8" y2="17"></line>
  <polyline points="10 9 9 9 8 9"></polyline>
</svg>`;
const historyImage = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="10"></circle>
  <line x1="12" y1="12" x2="12" y2="6"></line>
  <line x1="12" y1="12" x2="9" y2="15"></line>
  <line x1="12" y1="12" x2="15" y2="15"></line>
</svg>`;
const Icons = Quill.import("ui/icons");
Icons["share"] = shareImage;
Icons["save"] = saveImage;
Icons["export"] = exportImage;
Icons["template"] = templateImage;
Icons["history"] = historyImage;

export default {
  data() {
    return {
      time_inter: null,
      dialogVisible: false,
      members: [],
      document_title: "测试文档",
      quill: null,
      preview_quill: null,
      ydoc: null,
      ytext: null,
      provider: null,
      binding: null,
      currentPosition: -1,
      shareDialogVisible: false,
      link1: "",
      link2: "",
      share_code_y: "",
      share_code_n: "",
      exportDialogVisble: false,
      templateDialogVisible: false,
      selectedItem: "",
      historyDialogVisible: false,
      history_list: [],
      previewDialogVisible: false,
    };
  },
  created() {
    this.getTitle();
    this.getShareCode();
    this.getMemberList();
    // 添加全局键盘事件监听器
    window.addEventListener("keydown", this.handleKeyPress);
  },
  destroyed() {
    // 移除全局键盘事件监听器
    window.removeEventListener("keydown", this.handleKeyPress);
  },
  mounted() {
    //共享文档编辑器配置
    this.quill = new Quill(this.$refs.editor, {
      modules: {
        cursors: true,
        toolbar: {
          container: [
            [
              { header: [1, 2, 3, false] },
              "bold",
              "italic",
              "underline",
              "link",
              { list: "ordered" },
              { list: "bullet" },
              { align: [] },
              "image",
              "code-block",
              "share",
              "save",
              "history",
              "export",
              "template",
            ],
          ],
          handlers: {
            share: () => {
              this.showShareDialog();
            },
            save: () => {
              this.saveDoc();
            },
            export: () => {
              this.showExportDialog();
            },
            template: () => {
              this.showTemplateDialog();
            },
            history: () => {
              this.showHistoryDialog();
            },
          },
        },
        history: {
          userOnly: true,
        },
      },
      placeholder: "...文档内容...",
      theme: "snow",
      readOnly: false,
    });
    this.ydoc = new Y.Doc();
    this.ytext = this.ydoc.getText("quill");
    this.provider = new WebsocketProvider(
      "ws://101.42.238.192",
      this.$route.params.project_id + "and" + this.$route.query.document_id,
      this.ydoc
    );
    this.binding = new QuillBinding(
      this.ytext,
      this.quill,
      this.provider.awareness
    );

    //设置自动保存
    /* this.time_inter = setInterval(() => {
      this.saveDoc();
    }, 600000); */
  },
  beforeDestroy() {
    // 页面关闭（路由跳转）时清除定时器
    clearInterval(this.time_inter);
    this.time_inter = null;
  },
  methods: {
    //开始时获得各项信息
    getTitle() {
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
          this.document_title = res.data.data.doc_name;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getShareCode() {
      let project_id = this.$route.params.project_id;
      let document_id = this.$route.query.document_id;
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
    getMemberList() {
      let project_id = this.$route.params.project_id;
      this.axios({
        method: "GET",
        url: `/project/${project_id}/member`,
        params: {
          jwt: JSON.parse(localStorage.getItem("jwt")),
        },
      })
        .then((res) => {
          this.members = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //处理@事件
    handleKeyPress(event) {
      if (event.key === "@") {
        let position = this.quill.getSelection();
        if (position) {
          this.dialogVisible = true;
          this.currentPosition = position.index;
        }
      }
    },
    handleRowClick(item) {
      this.dialogVisible = false;
      this.quill.insertText(this.currentPosition + 1, item.username);
      //发送消息
      let formData = new FormData();
      formData.append("receiver_user_id", item.id);
      formData.append("message", "有人在文档里@了你");
      formData.append("mention_doc_id", this.$route.query.document_id);
      formData.append("jwt", JSON.parse(localStorage.getItem("jwt"))),
        this.axios({
          method: "POST",
          url: `/message/`,
          data: formData,
        })
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });
    },
    //处理分享事件
    showShareDialog() {
      // 根据您的项目和文档ID生成链接
      const project_id = this.$route.params.project_id; // 替换为实际的项目ID
      const document_id = this.$route.query.document_id;
      this.link1 = `http://8.130.12.73/docread?project_id=${project_id}&document_id=${document_id}&share_code=${this.share_code_y}`;
      this.link2 = `http://8.130.12.73/docread?project_id=${project_id}&document_id=${document_id}&share_code=${this.share_code_n}`;
      this.shareDialogVisible = true;
    },
    closeShareDialog() {
      this.shareDialogVisible = false;
    },
    //处理导出事件
    showExportDialog() {
      this.exportDialogVisble = true;
      //this.convertToMarkdown(html);
      //this.convertToPDF(html);
      //this.convertToWord(html);
    },
    closeExportDialog() {
      this.exportDialogVisble = false;
    },
    //导出文件逻辑
    convertToMarkdown() {
      var content = this.quill.getContents().ops;
      var QuillDeltaToHtmlConverter =
        require("quill-delta-to-html").QuillDeltaToHtmlConverter;
      var cfg = {};
      var convert = new QuillDeltaToHtmlConverter(content, cfg);
      var html = convert.convert();

      var turndownService = new TurndownService();
      var markdown = turndownService.turndown(html);

      const blob = new Blob([markdown], { type: "text/markdown" });

      // 创建一个下载链接
      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = `${this.document_title}.md`;
      downloadLink.target = "_blank";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      this.exportDialogVisble = false;
    },
    convertToPDF() {
      var content = this.quill.getContents().ops;
      var QuillDeltaToHtmlConverter =
        require("quill-delta-to-html").QuillDeltaToHtmlConverter;
      var cfg = {};
      var convert = new QuillDeltaToHtmlConverter(content, cfg);
      var html = convert.convert();

      const element = document.createElement("div");
      element.innerHTML = html;

      html2pdf()
        .from(element)
        .saveAs("content.pdf")
        .then(() => {
          URL.revokeObjectURL(element.href);
        });

      this.exportDialogVisble = false;
    },
    convertToWord() {
      var content = this.quill.getContents().ops;
      var QuillDeltaToHtmlConverter =
        require("quill-delta-to-html").QuillDeltaToHtmlConverter;
      var cfg = {};
      var convert = new QuillDeltaToHtmlConverter(content, cfg);
      var html = convert.convert();

      let convertor = htmlDocx.asBlob(html);
      FileSaver.saveAs(convertor, `${this.document_title}.docx`);

      this.exportDialogVisble = false;
    },
    //处理模板事件
    showTemplateDialog() {
      this.templateDialogVisible = true;
    },
    importFile() {
      if (this.selectedItem === "A") {
        this.quill.setContents(templateList[0].ops);
      } else if (this.selectedItem === "B") {
        this.quill.setContents(templateList[1].ops);
      } else if (this.selectedItem === "C") {
        this.quill.setContents(templateList[2].ops);
      } else if (this.selectedItem === "D") {
        this.quill.setContents(templateList[3].ops);
      } else if (this.selectedItem === "E") {
        this.quill.setContents(templateList[4].ops);
      } else if (this.selectedItem === "F") {
        this.quill.setContents(templateList[5].ops);
      }
      this.templateDialogVisible = false;
    },
    //处理保存事件
    saveDoc() {
      const content = this.quill.getContents();
      const data = JSON.stringify(content);
      console.log(data);

      /* const blob = new Blob([data], { type: "text/plain;charset=utf-8" });
      FileSaver.saveAs(blob, "content.js"); */

      let formData = new FormData();
      let project_id = this.$route.params.project_id;
      let document_id = this.$route.query.document_id;
      formData.append("text", data);
      formData.append("jwt", JSON.parse(localStorage.getItem("jwt")));
      this.axios({
        method: "POST",
        url: `project/${project_id}/document/${document_id}/history`,
        data: formData,
      })
        .then((res) => {
          console.log(res);
          this.$message.success("保存成功");
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("保存失败");
        });
    },
    //处理版本回退
    showHistoryDialog() {
      this.historyDialogVisible = true;
      let project_id = this.$route.params.project_id;
      let document_id = this.$route.query.document_id;
      this.axios({
        method: "GET",
        url: `/project/${project_id}/document/${document_id}/history`,
        params: {
          jwt: JSON.parse(localStorage.getItem("jwt")),
        },
      })
        .then((res) => {
          this.history_list = res.data.data.reverse();
          console.log(this.history_list);
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("获取历史消息失败");
          this.historyDialogVisible = false;
        });
    },
    showPreview(item) {
      this.previewDialogVisible = true;
      this.$showLoading.show();
      let project_id = this.$route.params.project_id;
      let document_id = this.$route.query.document_id;
      let history_id = item.id;
      this.axios({
        method: "GET",
        url: `project/${project_id}/document/${document_id}/history/${history_id}`,
        params: {
          jwt: JSON.parse(localStorage.getItem("jwt")),
        },
      })
        .then((res) => {
          let text = res.data.data.text;
          let content = JSON.parse(text);
          console.log(content);
          this.$nextTick(() => {
            if (this.preview_quill == null) {
              this.preview_quill = new Quill(this.$refs.preview, {
                modules: {
                  cursors: true,
                  toolbar: {
                    container: [
                      [
                        { header: [1, 2, 3, false] },
                        "bold",
                        "italic",
                        "underline",
                        "link",
                        { list: "ordered" },
                        { list: "bullet" },
                        "image",
                        "code-block",
                      ],
                    ],
                  },
                  history: {
                    userOnly: true,
                  },
                },
                placeholder: "...文档内容...",
                theme: "snow",
                readOnly: true,
              });
            }
            this.preview_quill.setContents(content.ops);
            this.$showLoading.hide();
          });
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("回退失败");
        });
    },
    goBack(item) {
      let project_id = this.$route.params.project_id;
      let document_id = this.$route.query.document_id;
      let history_id = item.id;
      this.axios({
        method: "GET",
        url: `project/${project_id}/document/${document_id}/history/${history_id}`,
        params: {
          jwt: JSON.parse(localStorage.getItem("jwt")),
        },
      })
        .then((res) => {
          let text = res.data.data.text;
          let content = JSON.parse(text);
          console.log(content);
          this.quill.setContents(content.ops);
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("回退失败");
        });
    },
    //格式化时间
    formatDateTime(dateTime) {
      return moment(dateTime).format("YYYY年MM月DD日 HH:mm:ss");
    },
  },
};
</script>
<style scoped>
.ql-editor {
  height: 560px;
  background-color: white;
}
.preview-editor {
  height: 500px;
  background-color: white;
}
</style>
