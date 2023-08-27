<template>
  <div style="text-align: center">
    <h3>{{ this.document_title }}</h3>
    <at :members="members">
      <div ref="editor"></div>
    </at>
  </div>
</template>

<script>
import Quill from "quill";
import QuillCursors from "quill-cursors";
import "quill/dist/quill.snow.css"; // 使用了 snow 主题色
import * as Y from "yjs";
import { QuillBinding } from "y-quill";
import { WebsocketProvider } from "y-websocket";
import At from "vue-at";
Quill.register("modules/cursors", QuillCursors);
export default {
  components: { At },
  data() {
    return {
      members: ["Roxie Miles", "grace.carroll", "小浩"],
      document_title: "测试文档",
      quill: null,
      ydoc: null,
      ytext: null,
      provider: null,
      binding: null,
    };
  },
  mounted() {
    this.quill = new Quill(this.$refs.editor, {
      modules: {
        cursors: true,
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline"],
          ["link"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["image", "code-block"],
        ],
        history: {
          userOnly: true,
        },
      },
      placeholder: "...文档内容...",
      theme: "snow",
    });
    console.log(this.$route.query.document_id);
    this.ydoc = new Y.Doc();
    this.ytext = this.ydoc.getText("quill");
    this.provider = new WebsocketProvider(
      "ws://localhost:1234",
      this.$route.query.document_id,
      this.ydoc
    );
    this.binding = new QuillBinding(
      this.ytext,
      this.quill,
      this.provider.awareness
    );
  },
};
</script>
<style>
.ql-editor {
  min-height: 570px;
  max-height: 570px;
}
</style>
