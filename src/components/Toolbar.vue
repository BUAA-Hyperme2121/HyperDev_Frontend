<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <div class="toolbar">
      <el-button @click="handleAceEditorChange">JSON</el-button>
      <el-button @click="undo">撤消</el-button>
      <el-button @click="redo">重做</el-button>
      <label for="input" class="insert">
        插入图片
        <input id="input" type="file" hidden @change="handleFileChange" />
      </label>

      <el-button style="margin-left: 10px" @click="preview(false)"
        >预览</el-button
      >
      <el-button @click="save">保存</el-button>
      <el-button @click="clearCanvas">清空</el-button>
      <!-- <el-button :disabled="!areaData.components.length" @click="compose"
        >组合</el-button
      >
      <el-button
        :disabled="
          !curComponent ||
          curComponent.isLock ||
          curComponent.component != 'Group'
        "
        @click="decompose"
      >
        拆分
      </el-button> -->
      <el-button @click="preview(true)">导出</el-button>
      <el-button @click="showDialog()">模板</el-button>
      <el-button @click="showLink()">分享链接</el-button>
      <el-switch
        v-model="previewable"
        active-text="共享"
        @change="changePreviewable"
        style="margin-left: 10px; margin-top: -2px"
      >
      </el-switch>
      <div class="canvas-config">
        <span>画布大小</span>
        <input v-model="canvasStyleData.width" />
        <span>*</span>
        <input v-model="canvasStyleData.height" />
      </div>
      <div class="canvas-config">
        <span>比例</span>
        <input v-model="scale" @input="handleScaleChange" />
      </div>
    </div>

    <!-- 预览 -->
    <Preview
      v-if="isShowPreview"
      :is-screenshot="isScreenshot"
      @close="handlePreviewChange"
    />
    <AceEditor v-if="isShowAceEditor" @closeEditor="closeEditor" />
    <el-dialog
      :visible.sync="dialogVisible"
      title="选择你想要的模板"
      :append-to-body="true"
      :width="'250px'"
    >
      <el-select v-model="selectedItem">
        <el-option label="PC在线商城" value="A"></el-option>
        <el-option label="PC视频网站" value="B"></el-option>
        <el-option label="PC视频播放页面" value="C"></el-option>
        <el-option label="mobile播放音乐" value="D"></el-option>
        <el-option label="mobile页面样例" value="E"></el-option>
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button @click="importFile" type="primary">确认</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="linkVisible"
      title="分享链接"
      :append-to-body="true"
      :width="'250px'"
    >
      <div style="text-align: center">
        <h5 v-if="previewable">{{ link }}</h5>
        <h5 v-else>请先设置为共享</h5>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import pageList from "@/assets/template/page_template";
import FileSaver from "file-saver";
import generateID from "@/utils/generateID";
import toast from "@/utils/toast";
import { mapState } from "vuex";
import Preview from "@/components/Editor/Preview";
import AceEditor from "@/components/Editor/AceEditor.vue";
import { commonStyle, commonAttr } from "@/custom-component/component-list";
import eventBus from "@/utils/eventBus";
import { $ } from "@/utils/utils";
import { deepCopy } from "@/utils/utils";
import changeComponentsSizeWithScale, {
  changeComponentSizeWithScale,
} from "@/utils/changeComponentsSizeWithScale";

export default {
  components: { Preview, AceEditor },
  data() {
    return {
      isShowPreview: false,
      isShowAceEditor: false,
      timer: null,
      isScreenshot: false,
      scale: 100,
      dialogVisible: false,
      selectedItem: "",
      linkVisible: false,
      link: "",
      previewable: false,
    };
  },
  computed: mapState([
    "componentData",
    "canvasStyleData",
    "areaData",
    "curComponent",
    "curComponentIndex",
  ]),
  created() {
    eventBus.$on("preview", this.preview);
    eventBus.$on("save", this.save);
    eventBus.$on("clearCanvas", this.clearCanvas);

    this.scale = this.canvasStyleData.scale;
  },
  methods: {
    getPreviewable(previewable) {
      this.previewable = previewable;
    },
    changePreviewable() {
      let project_id = this.$route.params.project_id;
      let prototype_id = this.$route.query.page_id;
      this.axios.put(`/project/${project_id}/prototype/${prototype_id}`, {
        jwt: JSON.parse(localStorage.getItem("jwt")),
        previewable: this.previewable,
      });
    },
    showLink() {
      if (this.previewable) {
        //获取分享码
        let project_id = this.$route.params.project_id;
        let prototype_id = this.$route.query.page_id;
        this.axios({
          method: "GET",
          url: `/project/${project_id}/prototype/${prototype_id}`,
          params: {
            jwt: JSON.parse(localStorage.getItem("jwt")),
            need_share: "true",
          },
        })
          .then((res) => {
            console.log(res);
            this.link = `http://8.130.12.73/designread?project_id=${project_id}&document_id=${prototype_id}&share_code=${res.data.data.share_code}`;
            this.linkVisible = true;
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.linkVisible = true;
      }
    },
    showDialog() {
      this.dialogVisible = true;
    },
    handleScaleChange() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        // 画布比例设一个最小值，不能为 0
        // eslint-disable-next-line no-bitwise
        this.scale = ~~this.scale || 1;
        changeComponentsSizeWithScale(this.scale);
      }, 1000);
    },

    handleAceEditorChange() {
      this.isShowAceEditor = !this.isShowAceEditor;
    },

    closeEditor() {
      this.handleAceEditorChange();
    },

    lock() {
      this.$store.commit("lock");
    },

    unlock() {
      this.$store.commit("unlock");
    },

    compose() {
      this.$store.commit("compose");
      this.$store.commit("recordSnapshot");
    },

    decompose() {
      this.$store.commit("decompose");
      this.$store.commit("recordSnapshot");
    },

    undo() {
      this.$store.commit("undo");
    },

    redo() {
      this.$store.commit("redo");
    },

    handleFileChange(e) {
      const file = e.target.files[0];
      if (!file.type.includes("image")) {
        toast("只能插入图片");
        return;
      }

      const reader = new FileReader();
      reader.onload = (res) => {
        const fileResult = res.target.result;
        const img = new Image();
        img.onload = () => {
          const component = {
            ...commonAttr,
            id: generateID(),
            component: "Picture",
            label: "图片",
            icon: "",
            propValue: {
              url: fileResult,
              flip: {
                horizontal: false,
                vertical: false,
              },
            },
            style: {
              ...commonStyle,
              top: 0,
              left: 0,
              width: img.width,
              height: img.height,
            },
          };

          // 根据画面比例修改组件样式比例 https://github.com/woai3c/visual-drag-demo/issues/91
          changeComponentSizeWithScale(component);

          this.$store.commit("addComponent", { component });
          this.$store.commit("recordSnapshot");

          // 修复重复上传同一文件，@change 不触发的问题
          $("#input").setAttribute("type", "text");
          $("#input").setAttribute("type", "file");
        };

        img.src = fileResult;
      };

      reader.readAsDataURL(file);
    },

    preview(isScreenshot) {
      this.isScreenshot = isScreenshot;
      this.isShowPreview = true;
      this.$store.commit("setEditMode", "preview");
    },

    save() {
      localStorage.setItem("canvasData", JSON.stringify(this.componentData));
      localStorage.setItem("canvasStyle", JSON.stringify(this.canvasStyleData));
      console.log(localStorage.getItem("canvasData"));
      console.log(localStorage.getItem("canvasStyle"));
      /* const a = new Blob([JSON.stringify(this.componentData)], {
        type: "text/plain;charset=utf-8",
      });
      FileSaver.saveAs(a, "canvasData.js");
      const b = new Blob([JSON.stringify(this.canvasStyleData)], {
        type: "text/plain;charset=utf-8",
      });
      FileSaver.saveAs(b, "canvasStyle.js"); */

      console.log(this.componentData);
      let formData = new FormData();
      formData.append("jwt", JSON.parse(localStorage.getItem("jwt")));
      formData.append("page_style", JSON.stringify(this.canvasStyleData));
      formData.append("page_data", JSON.stringify(this.componentData));
      let project_id = this.$route.params.project_id;
      let prototype_id = this.$route.query.page_id;
      this.axios({
        method: "PUT",
        url: `/project/${project_id}/prototype/${prototype_id}`,
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

    clearCanvas() {
      this.$store.commit("setCurComponent", { component: null, index: null });
      this.$store.commit("setComponentData", []);
      this.$store.commit("recordSnapshot");
    },

    handlePreviewChange() {
      this.isShowPreview = false;
      this.$store.commit("setEditMode", "edit");
    },
    importFile() {
      if (this.selectedItem === "A") {
        this.$store.commit(
          "setComponentData",
          deepCopy(pageList[0].canvasData)
        );
        this.$store.commit("setCanvasStyle", deepCopy(pageList[0].canvasStyle));
      } else if (this.selectedItem === "B") {
        this.$store.commit(
          "setComponentData",
          deepCopy(pageList[1].canvasData)
        );
        this.$store.commit("setCanvasStyle", deepCopy(pageList[1].canvasStyle));
      } else if (this.selectedItem === "C") {
        this.$store.commit(
          "setComponentData",
          deepCopy(pageList[2].canvasData)
        );
        this.$store.commit("setCanvasStyle", deepCopy(pageList[2].canvasStyle));
      } else if (this.selectedItem === "D") {
        this.$store.commit(
          "setComponentData",
          deepCopy(pageList[3].canvasData)
        );
        this.$store.commit("setCanvasStyle", deepCopy(pageList[3].canvasStyle));
      } else if (this.selectedItem === "E") {
        this.$store.commit(
          "setComponentData",
          deepCopy(pageList[4].canvasData)
        );
        this.$store.commit("setCanvasStyle", deepCopy(pageList[4].canvasStyle));
      }
      this.dialogVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.toolbar {
  padding: 6px 10px;
  white-space: nowrap;
  overflow-x: auto;
  background: #fff;
  border-bottom: 1px solid #ddd;

  .canvas-config {
    display: inline-block;
    margin-left: 10px;
    font-size: 14px;
    color: #606266;

    input {
      width: 50px;
      margin-left: 4px;
      outline: none;
      padding: 0 5px;
      border: 1px solid #ddd;
      color: #606266;
    }

    span {
      margin-left: 10px;
    }
  }

  .insert {
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #fff;
    border: 1px solid #dcdfe6;
    color: #606266;
    appearance: none;
    text-align: center;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    transition: 0.1s;
    font-weight: 500;
    padding: 9px 15px;
    font-size: 12px;
    border-radius: 3px;
    margin-left: 10px;

    &:active {
      color: #3a8ee6;
      border-color: #3a8ee6;
      outline: 0;
    }

    &:hover {
      background-color: #ecf5ff;
      color: #3a8ee6;
    }
  }
}
</style>
