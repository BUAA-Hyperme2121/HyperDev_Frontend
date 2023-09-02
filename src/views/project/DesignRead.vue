<!-- eslint-disable no-unused-vars -->
<template>
  <div class="home" v-if="shouldRenderComponent">
    <Previewbar ref="previewbar" />
  </div>
</template>

<script>
import componentList from "@/custom-component/component-list"; // 左侧列表数据
import Previewbar from "@/components/Previewbar";
import { deepCopy } from "@/utils/utils";
import { mapState } from "vuex";
import generateID from "@/utils/generateID";
import { listenGlobalKeyDown } from "@/utils/shortcutKey";
import { changeComponentSizeWithScale } from "@/utils/changeComponentsSizeWithScale";
import { setDefaultcomponentData } from "@/store/snapshot";
export default {
  components: {
    Previewbar,
  },
  data() {
    return {
      activeName: "attr",
      reSelectAnimateIndex: undefined,
      shouldRenderComponent: true,
    };
  },
  computed: mapState([
    "componentData",
    "curComponent",
    "isClickComponent",
    "canvasStyleData",
    "editor",
  ]),
  created() {
    this.$showLoading.show();
    this.$store.commit("setComponentData", []);
    this.$store.commit("setCanvasStyle", {
      // 页面全局数据
      width: 1000,
      height: 760,
      scale: 100,
      color: "#000",
      opacity: 1,
      background: "#fff",
      fontSize: 14,
    });
    let project_id = this.$route.query.project_id;
    this.axios({
      method: "GET",
      url: `/project/${project_id}/prototype/share`,
      params: {
        share_code: this.$route.query.share_code,
        show_single: true,
      },
    })
      .then((res) => {
        console.log(res);
        let pageData = res.data.data.page_data;
        let pageStyle = res.data.data.page_style;
        this.$store.commit("setCanvasStyle", JSON.parse(pageStyle));
        this.$store.commit("setComponentData", JSON.parse(pageData));
        setDefaultcomponentData(JSON.parse(pageData));
        this.$refs.previewbar.ShowPreview();
        this.$showLoading.hide();
      })
      .catch((err) => {
        console.log(err);
      });
    // 全局监听按键事件
    listenGlobalKeyDown();
  },
  methods: {
    handleDrop(e) {
      e.preventDefault();
      e.stopPropagation();

      const index = e.dataTransfer.getData("index");
      const rectInfo = this.editor.getBoundingClientRect();
      if (index) {
        const component = deepCopy(componentList[index]);
        component.style.top = e.clientY - rectInfo.y;
        component.style.left = e.clientX - rectInfo.x;
        component.id = generateID();

        // 根据画面比例修改组件样式比例 https://github.com/woai3c/visual-drag-demo/issues/91
        changeComponentSizeWithScale(component);

        this.$store.commit("addComponent", { component });
        this.$store.commit("recordSnapshot");
      }
    },

    handleDragOver(e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
    },

    handleMouseDown(e) {
      e.stopPropagation();
      this.$store.commit("setClickComponentStatus", false);
      this.$store.commit("setInEditorStatus", true);
    },

    deselectCurComponent(e) {
      if (!this.isClickComponent) {
        this.$store.commit("setCurComponent", { component: null, index: null });
      }

      // 0 左击 1 滚轮 2 右击
      if (e.button != 2) {
        this.$store.commit("hideContextMenu");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.home {
  height: 100vh;
  background: #fff;

  main {
    height: calc(100% - 64px);
    position: relative;

    .left {
      position: absolute;
      height: 100%;
      width: 200px;
      left: 0;
      top: 0;

      & > div {
        overflow: auto;

        &:first-child {
          border-bottom: 1px solid #ddd;
        }
      }
    }

    .right {
      position: absolute;
      height: 100%;
      width: 288px;
      right: 0;
      top: 0;

      .el-select {
        width: 100%;
      }
    }

    .center {
      margin-left: 200px;
      margin-right: 288px;
      background: #f5f5f5;
      height: 100%;
      overflow: auto;
      padding: 20px;

      .content {
        width: 100%;
        height: 100%;
        overflow: auto;
      }
    }
  }

  .placeholder {
    text-align: center;
    color: #333;
  }

  .global-attr {
    padding: 10px;
  }
}
</style>
