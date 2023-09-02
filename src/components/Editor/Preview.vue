<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div ref="container" class="bg">
    <el-button v-if="!isScreenshot" class="close" @click="close"
      >返回</el-button
    >
    <!--button
      v-if="!isScreenshot"
      style="position: absolute; right: 100px; top: 20px"
      @click="exportCode"
    >
      导出代码
    </button-->
    <el-button v-else class="close" @click="htmlToImage">确定</el-button>
    <div class="canvas-container" ref="exportArea">
      <div
        class="canvas"
        :style="{
          ...getCanvasStyle(canvasStyleData),
          width: changeStyleWithScale(canvasStyleData.width) + 'px',
          height: changeStyleWithScale(canvasStyleData.height) + 'px',
        }"
      >
        <ComponentWrapper
          v-for="(item, index) in copyData"
          :key="index"
          :config="item"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { getStyle, getCanvasStyle } from "@/utils/style";
import { mapState } from "vuex";
import ComponentWrapper from "./ComponentWrapper";
import { changeStyleWithScale } from "@/utils/translate";
import { toPng } from "html-to-image";
import { deepCopy } from "@/utils/utils";

export default {
  components: { ComponentWrapper },
  props: {
    isScreenshot: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      copyData: [],
    };
  },
  computed: mapState(["componentData", "canvasStyleData"]),
  created() {
    this.$set(this, "copyData", deepCopy(this.componentData));
  },
  methods: {
    getStyle,
    getCanvasStyle,
    changeStyleWithScale,
    exportCode() {
      const exportArea = this.$refs.exportArea;
      // 获取区域的内容，可以根据需要进行处理
      const htmlCode = exportArea.innerHTML;
    },
    close() {
      this.$emit("close");
    },

    htmlToImage() {
      toPng(this.$refs.container.querySelector(".canvas"))
        .then((dataUrl) => {
          const a = document.createElement("a");
          a.setAttribute("download", "screenshot");
          a.href = dataUrl;
          a.click();
        })
        .catch((error) => {
          console.error("oops, something went wrong!", error);
        })
        .finally(this.close);
    },
  },
};
</script>

<style lang="scss" scoped>
.bg {
  z-index: 999;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  position: fixed;
  background: rgb(0, 0, 0, 0.5);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;

  .canvas-container {
    z-index: 1000;
    width: 100%;
    height: calc(100% - 60px);
    overflow: auto;

    .canvas {
      z-index: 1000;
      background: #fff;
      position: relative;
      margin: auto;
    }
  }

  .close {
    z-index: 1001;
    position: absolute;
    right: 20px;
    top: 20px;
  }
}
</style>
