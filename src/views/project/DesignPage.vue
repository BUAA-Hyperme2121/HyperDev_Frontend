<!-- eslint-disable no-unused-vars -->
<template>
  <div class="home" v-if="shouldRenderComponent">
    <Toolbar />

    <main>
      <!-- 左侧组件列表 -->
      <section class="left">
        <ComponentList />
        <RealTimeComponentList />
      </section>
      <!-- 中间画布 -->
      <section class="center">
        <div
          class="content"
          @drop="handleDrop"
          @dragover="handleDragOver"
          @mousedown="handleMouseDown"
          @mouseup="deselectCurComponent"
        >
          <Editor />
        </div>
      </section>
      <!-- 右侧属性列表 -->
      <section class="right">
        <el-tabs v-if="curComponent" v-model="activeName">
          <el-tab-pane label="属性" name="attr">
            <component :is="curComponent.component + 'Attr'" />
          </el-tab-pane>
          <el-tab-pane label="动画" name="animation" style="padding-top: 20px">
            <AnimationList />
          </el-tab-pane>
          <el-tab-pane label="事件" name="events" style="padding-top: 20px">
            <EventList />
          </el-tab-pane>
        </el-tabs>
        <CanvasAttr v-else></CanvasAttr>
      </section>
    </main>
  </div>
</template>

<script>
import Editor from "@/components/Editor/index";
import ComponentList from "@/components/ComponentList"; // 左侧列表组件
import AnimationList from "@/components/AnimationList"; // 右侧动画列表
import EventList from "@/components/EventList"; // 右侧事件列表
import componentList from "@/custom-component/component-list"; // 左侧列表数据
import Toolbar from "@/components/Toolbar";
import { deepCopy } from "@/utils/utils";
import { mapState } from "vuex";
import generateID from "@/utils/generateID";
import { listenGlobalKeyDown } from "@/utils/shortcutKey";
import RealTimeComponentList from "@/components/RealTimeComponentList";
import CanvasAttr from "@/components/CanvasAttr";
import { changeComponentSizeWithScale } from "@/utils/changeComponentsSizeWithScale";
import { setDefaultcomponentData } from "@/store/snapshot";
import axios from "axios";
import { Message } from "element-ui";
export default {
  components: {
    Editor,
    ComponentList,
    AnimationList,
    EventList,
    Toolbar,
    RealTimeComponentList,
    CanvasAttr,
  },
  beforeRouteEnter(to, from, next) {
    let project_id = to.params.project_id;
    let prototype_id = to.query.page_id;
    let formData = new FormData();
    formData.append("jwt", JSON.parse(localStorage.getItem("jwt")));
    formData.append("try_modify", true);
    axios({
      method: "PATCH",
      url: `/project/${project_id}/prototype/${prototype_id}`,
      data: formData,
    })
      .then((res) => {
        if (res.data.result != 0) {
          Message.error("无法获得权限");
          next(from.fullPath);
        } else {
          next();
        }
      })
      .catch((err) => {
        next(from.fullPath);
      });
  },
  beforeRouteLeave(to, from, next) {
    let project_id = this.$route.params.project_id;
    let prototype_id = this.$route.query.page_id;
    this.axios.patch(`/project/${project_id}/prototype/${prototype_id}`, {
      jwt: JSON.parse(localStorage.getItem("jwt")),
      try_modify: false,
    });
    this.$store.commit("setComponentData", []);
    this.$store.commit("setCanvasStyle", {
      // 页面全局数据
      width: 1240,
      height: 760,
      scale: 100,
      color: "#000",
      opacity: 1,
      background: "#fff",
      fontSize: 14,
    });
    next();
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
      width: 1240,
      height: 760,
      scale: 100,
      color: "#000",
      opacity: 1,
      background: "#fff",
      fontSize: 14,
    });
    let project_id = this.$route.params.project_id;
    let prototype_id = this.$route.query.page_id;
    this.axios({
      method: "GET",
      url: `/project/${project_id}/prototype/${prototype_id}`,
      params: {
        jwt: JSON.parse(localStorage.getItem("jwt")),
      },
    })
      .then((res) => {
        let pageData = res.data.data.page_data;
        let pageStyle = res.data.data.page_style;
        this.$store.commit("setComponentData", JSON.parse(pageData));
        this.$store.commit("setCanvasStyle", JSON.parse(pageStyle));
        setDefaultcomponentData(JSON.parse(pageData));
        this.$showLoading.hide();
        console.log(pageData);
        console.log(pageStyle);
      })
      .catch((err) => {
        console.log(err);
        this.$showLoading.hide();
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
