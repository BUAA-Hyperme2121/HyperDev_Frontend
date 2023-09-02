<!-- eslint-disable no-unused-vars -->
<template>
  <div class="home" v-if="shouldRenderComponent">
    <Toolbar ref="toolbar" id="toolbar" />

    <main>
      <!-- 左侧组件列表 -->
      <section class="left">
        <ComponentList id="left" />
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
        <el-tabs v-if="curComponent" v-model="activeName" id="right">
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
import introJs from "intro.js";
import "intro.js/introjs.css";
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
          console.log(res);
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
    this.$store.state.editMode = "edit";
    this.$store.state.canvasStyleData = {
      width: 1000,
      height: 760,
      scale: 100,
      color: "#000",
      opacity: 1,
      background: "#fff",
      fontSize: 14,
    };
    this.initCanvas();
    next();
  },
  data() {
    return {
      activeName: "attr",
      reSelectAnimateIndex: undefined,
      shouldRenderComponent: true,
      previewable: false,
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
    //初始化数据
    this.initCanvas();

    //申请数据
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
        let previewable = res.data.data.previewable;
        setDefaultcomponentData(JSON.parse(pageData));
        this.$store.commit("setCanvasStyle", JSON.parse(pageStyle));
        this.$store.commit("setComponentData", JSON.parse(pageData));
        this.$refs.toolbar.getPreviewable(previewable);
        this.$showLoading.hide();
      })
      .catch((err) => {
        console.log(err);
        this.$showLoading.hide();
      });
    // 全局监听按键事件
    listenGlobalKeyDown();
  },
  mounted() {
    this.$store.state.userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (this.$store.state.userInfo.project_fresh) {
      this.guide();
    }
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
    initCanvas() {
      this.$store.state.editMode = "edit";
      this.$store.state.canvasStyleData = {
        // 页面全局数据
        width: 1000,
        height: 760,
        scale: 100,
        color: "#000",
        opacity: 1,
        background: "#fff",
        fontSize: 14,
      };
      this.$store.state.isInEdiotr = false;
      this.$store.state.componentData = [];
      this.$store.state.curComponent = null;
      this.$store.state.curComponentIndex = null;
      this.$store.state.isClickComponent = false;
      this.$store.state.snapshotData = []; // 编辑器快照数据
      this.$store.state.snapshotIndex = -1; // 快照索引
      this.$store.state.copyData = null; // 复制粘贴剪切
      this.$store.state.isCut = false;
      this.$store.state.menuTop = 0; // 右击菜单数据
      this.$store.state.menuLeft = 0;
      this.$store.state.menuShow = false;
      this.$store.state.areaData = {
        // 选中区域包含的组件以及区域位移信息
        style: {
          top: 0,
          left: 0,
          width: 0,
          height: 0,
        },
        components: [],
      };
      this.$store.state.editor = null;
    },
    guide() {
      introJs()
        .setOptions({
          steps: [
            {
              element: "#toolbar", // 目标元素
              intro: "在工具栏选择对页面的操作🧰", // 提示文本
              position: "top", // 提示位置
            },
            {
              element: "#left", // 目标元素
              intro: "选择组件并拖动👆", // 提示文本
              position: "right",
            },
            {
              element: "#right", // 目标元素
              intro: "在右侧设置组件的样式与事件😍", // 提示文本
              position: "right", // 提示位置
            },
          ],
          nextLabel: "下一个", // 下一个按钮文字
          prevLabel: "上一个", // 上一个按钮文字
          // skipLabel: "跳过", // 跳过按钮文字
          doneLabel: "完成", // 完成按钮文字
          hidePrev: true, // 在第一步中是否隐藏上一个按钮
          // 一开就没有完成按钮
          // hideNext: true, // 在最后一步中是否隐藏下一个按钮
          exitOnOverlayClick: false, // 点击叠加层时是否退出介绍
          showStepNumbers: false, // 是否显示红色圆圈的步骤编号
          disableInteraction: true, // 是否禁用与突出显示的框内的元素的交互，就是禁止点击
          showBullets: false, // 是否显示面板指示点
        })
        .onbeforeexit(() => {
          let formData = new FormData();
          formData.append("jwt", JSON.parse(localStorage.getItem("jwt")));
          this.axios({
            method: "PUT",
            url: `/project/`,
            data: formData,
          })
            .then((res) => {
              console.log(res);
              this.axios({
                method: "get",
                url: "/user/me",
                params: {
                  jwt: JSON.parse(localStorage.getItem("jwt")),
                },
              }).then((res) => {
                if (res.data.result == 0) {
                  // console.log(res.data);
                  // 保存用户信息
                  localStorage.setItem(
                    "userInfo",
                    JSON.stringify(res.data.data)
                  );
                  this.$store.state.userInfo = res.data.data;
                }
              });
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .start();
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
