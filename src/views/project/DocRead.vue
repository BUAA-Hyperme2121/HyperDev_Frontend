<template>
  <div style="text-align: center">
    <h3>{{ this.document_title }}</h3>
    <div ref="editor" class="ql-editor"></div>
  </div>
</template>

<script>
import Quill from "quill";
import QuillCursors from "quill-cursors";
import "quill/dist/quill.snow.css"; // 使用了 snow 主题色
import * as Y from "yjs";
import { QuillBinding } from "y-quill";
import { WebsocketProvider } from "y-websocket";
Quill.register("modules/cursors", QuillCursors);
export default {
  data() {
    return {
      document_title: "测试文档",
      quill: null,
      ydoc: null,
      ytext: null,
      provider: null,
      binding: null,
      currentPosition: -1,
      can_modify: false,
    };
  },
  mounted() {
    this.getTitle();
  },
  methods: {
    getTitle() {
      this.$showLoading.show();
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
          console.log(res);
          this.document_title = res.data.data.doc_name;
          this.can_modify = res.data.data.can_modify;

          //创建quill编辑
          this.quill = new Quill(this.$refs.editor, {
            modules: {
              cursors: true,
              toolbar: {
                container: [
                  [{ header: [1, 2, 3, false] }],
                  ["bold", "italic", "underline"],
                  ["link"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["image", "code-block"],
                ],
                handlers: {},
              },
              history: {
                userOnly: true,
              },
            },
            placeholder: "...文档内容...",
            theme: "snow",
            readOnly: !this.can_modify,
          });
          this.ydoc = new Y.Doc();
          this.ytext = this.ydoc.getText("quill");
          this.provider = new WebsocketProvider(
            "ws://101.42.238.192",
            this.$route.query.project_id +
              "and" +
              this.$route.query.document_id,
            this.ydoc
          );
          this.binding = new QuillBinding(
            this.ytext,
            this.quill,
            this.provider.awareness
          );
          this.$showLoading.hide();
        })
        .catch((err) => {
          console.log(err);
          this.$showLoading.hide();
        });
    },
  },
};
</script>
<style scoped>
.ql-editor {
  height: 500px;
  background-color: white;
}
</style>
