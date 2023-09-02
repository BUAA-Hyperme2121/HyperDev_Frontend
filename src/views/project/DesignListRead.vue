<template>
  <div class="collaborative-manage-page-container">
    <div class="background">
      <vue-particles
        style="height: 100%"
        color="#8a8591"
        :particleOpacity="0.7"
        :particlesNumber="80"
        shapeType="circle"
        :particleSize="4"
        linesColor="#8a8591"
        :linesWidth="1"
        :lineLinked="true"
        :lineOpacity="0.4"
        :linesDistance="150"
        :moveSpeed="1"
        :hoverEffect="true"
        hoverMode="grab"
        :clickEffect="true"
        clickMode="push"
      >
      </vue-particles>
    </div>
    <div class="manage-page-container">
      <div class="table-container">
        <div class="operation-title">原型设计列表</div>
        <div class="page-list-container">
          <div class="page-list" :style="{ height: containerHeight + 'px' }">
            <div
              v-for="(page, index) in page_list"
              :key="index"
              class="page-item"
            >
              <div
                class="page-icon-wrapper"
                @mouseover="page.hover = true"
                @mouseleave="page.hover = false"
              >
                <i class="el-icon-notebook-2" style="font-size: 50px"></i>
                <div class="icon-overlay">
                  <!--div class="icon-overlay" v-show="page.hover"-->
                  <div class="icon-options">
                    <el-tooltip content="预览" placement="top">
                      <i
                        class="el-icon-edit"
                        @click="getOldDocumentToken(page.id, page.share_code)"
                      ></i>
                    </el-tooltip>
                  </div>
                </div>
              </div>
              <div class="page-title">{{ page.page_name }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "CollaborativeManagePage",
  data() {
    return {
      containerHeight: 550,
      pagelist: [
        { page_name: "第1个页面", page_id: 1, hover: false },
        { page_name: "第2个页面", page_id: 1, hover: false },
        { page_name: "第3个页面", page_id: 1, hover: false },
        { page_name: "第4个页面", page_id: 1, hover: false },
        { page_name: "第5个页面", page_id: 1, hover: false },
        { page_name: "第1个页面", page_id: 1, hover: false },
        { page_name: "第2个页面", page_id: 1, hover: false },
        { page_name: "第3个页面", page_id: 1, hover: false },
        { page_name: "第4个页面", page_id: 1, hover: false },
        { page_name: "第5个页面", page_id: 1, hover: false },
      ],

      // 当前项目下已经创建的文件列表
      page_list: [],
    };
  },
  created() {
    this.getCurrentDocumentList();
  },
  methods: {
    async getCurrentDocumentList() {
      this.$showLoading.show();
      let project_id = this.$route.params.project_id;
      let share_code = this.$route.query.share_code;
      this.axios({
        method: "GET",
        url: `/project/${project_id}/prototype/share`,
        params: {
          share_code: share_code,
          show_single: false,
        },
      })
        .then((res) => {
          this.page_list = res.data.data;
          console.log(this.page_list);
          this.$showLoading.hide();
        })
        .catch((err) => {
          console.log(err);
          this.$showLoading.hide();
        });
    },
    async getOldDocumentToken(pageID, pageShareCode) {
      let page_id = pageID;
      let share_code = pageShareCode;
      let project_id = this.$route.params.project_id;
      this.$router.push({
        path: `/designread`,
        query: {
          project_id: project_id,
          page_id: page_id,
          share_code: share_code,
        },
      });
    },
  },
};
</script>

<style scoped>
.page-list-container {
  height: 500px;
}

.page-list {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 0;
  overflow-y: auto;
}

.page-item {
  width: 25%;
  text-align: center;
  position: relative;
  margin-top: 20px; /* 修改为此行代码 */
  height: 150px;
  margin-bottom: -30px;
}

.page-icon-wrapper {
  position: relative;
}

.page-icon {
  width: 100px;
}

.page-title {
  font-size: 16px;
  font-weight: bold;
  margin-top: 10px;
}

.icon-overlay {
  position: absolute;
  top: -15px;
  left: 0;
  width: 100%;
  height: 100px;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s;
  border-radius: 10%;
}

.icon-overlay:hover {
  opacity: 1;
}

.icon-options {
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon-options i {
  margin-right: 10px;
  color: #fff;
  cursor: pointer;
}

/* Custom scrollbar styles */
.page-list-container::-webkit-scrollbar {
  width: 8px;
}

.page-list-container::-webkit-scrollbar-track {
  background: transparent;
}

.page-list-container::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 4px;
}

.page-list-container::-webkit-scrollbar-thumb:hover {
  background-color: #aaa;
}
.operation-container {
  text-align: center;
  float: left;
  margin-top: 40px;
  margin-left: 5%;
  width: 28%;
  height: 562px;
  border: 2px solid #808080;
  border-radius: 0.75rem;
  overflow: hidden;
  background-color: rgba(219, 219, 219, 0.373);
}
.operation-title {
  margin-top: 10px;
  margin-bottom: 10px;
  padding-bottom: 10px;
  text-align: center;
  /* font-family: 'Courier New', Courier, monospace; */
  font-family: Avenir, Helvetica, Arial, sans-serif;
  font-size: 20px;
  font-weight: 700;
  /* border-bottom: 2px solid #e5e9ef; */
  border-bottom: 2px solid #808080;
}
.operation-container .operation-notice {
  margin-top: 10px;

  /* font-family: 'Courier New', Courier, monospace; */
  font-family: "PingFang SC";
  font-size: 18px;
}

.operation-container .create-new-doc-area:hover {
  border: 3px dashed #6d757a;
  color: #6d757a;
}

.operation-container .create-new-doc-area {
  margin: 10px 10px;
  /* height: 50px; */
  height: 80px;
  line-height: 34px;
  padding: 0 34px;
  border: 3px dashed #131314;
  border-radius: 4px;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAAXNSR0IArs4c6QAAAC5JREFUKBVjYMABZi5a9R+EcUgzMOGSICQ+EjQy4gs5fAFEduDgNHQ0HhnIT6sAudAOjNLnY/wAAAAASUVORK5CYII=)
    no-repeat center center;
  /* font-size: 12px; */
  font-size: 14px;
  color: #131314;
  cursor: pointer;
}

.table-container {
  float: right;
  margin-top: 40px;
  margin-right: 5%;
  width: 90%;
  border: 2px solid #808080;
  border-radius: 0.75rem;
  overflow: hidden;
  /* overflow-y: hidden; */
  /* overflow-x: scroll; */
  background-color: rgba(219, 219, 219, 0.373);
}

/* .editor-page-container{ */

.operation-area {
  float: left;
  width: 28%;
  height: 100%;
  margin-left: 5%;
  box-sizing: border-box;
  border: 2px solid #1b43d6;
}

.editor-area {
  float: right;
  width: 60%;
  height: 100%;
  margin-right: 3%;
  /* padding-top: 10px; */
  box-sizing: border-box;
  border: 2px solid #d61b1b;
}

/* #region 自定义滚动条（为了不影响页面，我在前面加了选择器，限定在.tiptap-editor-container里面） */
/* 整个滚动条 */
.table-container::-webkit-scrollbar {
  width: 14px;
  height: 14px;
}
/* 滚动条上的按钮 (上下箭头) */
.table-container::-webkit-scrollbar-button {
  display: none;
  width: 0;
  height: 0;
}
/* 当同时有垂直滚动条和水平滚动条时交汇的部分. */
.table-container::-webkit-scrollbar-corner {
  background-color: transparent;
}
/* 滚动条上的滚动滑块. */
.table-container::-webkit-scrollbar-thumb {
  border: 4px solid rgba(0, 0, 0, 0);
  background-clip: padding-box;
  border-radius: 8px;
  background-color: #0000;
}
.table-container:hover::-webkit-scrollbar-thumb {
  background-color: #0000001a;
}
/* 滚动条轨道. */
.table-container::-webkit-scrollbar-track {
  border: 4px solid transparent;
  background-clip: padding-box;
  border-radius: 8px;
  background-color: transparent;
}
/* #endregion */

/* #region 创建新文档/重命名文档的浮窗 */
.dialog-m {
  background: rgba(0, 0, 0, 0.65);
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 10102;
}

.dialog-bomb {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);

  box-sizing: border-box;
  margin-bottom: 50px;
}

.create-doc-wrap {
  width: 420px;
  border-radius: 4px;
  background: #fff;
  overflow: hidden;
}

.create-doc-wrap .title {
  position: relative;
  padding: 0 20px;
  height: 50px;
  line-height: 50px;
  font-size: 16px;
  color: #222;
  border-bottom: 1px solid #e5e9ef;
  text-align: center;
}
/* 关闭悬浮窗的图标 */
.create-doc-wrap .title .close {
  position: absolute;
  right: 20px;
  line-height: 50px;
  width: 12px;
  height: 50px;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAAAAXNSR0IArs4c6QAAAN1JREFUKBWdkjEOwjAMRe30QlyBMyBlAbFVlRBHQLCAOAFDK8FSugTYWRAn4EiNiVNcNSVlwIubH7/Y+SnAv1GU5pFXt/EvvqjMKC/Ni4hQcSGpZAu2NkMgA2DhrhD2iEgop3vAgaASnU0nT9EFQIRlOtNX1luIF30wBnxBXdCNsQGidbcD73MEnRoJoDhfFmTp4C68S+d6Jbpkb4QsOPuRXAcGLEIWMyeAgjtwB2dKzNV2vAD4uMSd++aw5qEhgAs4+qAfjywcYy41CIB/Nx61rk/8R3i9/ZCqgSx1bzXyhJUvBN//AAAAAElFTkSuQmCC)
    no-repeat center;
  cursor: pointer;
}

.create-doc-wrap .content {
  padding: 0 36px;
  /* 
    这里基于黄学长的建议减小高度
    height: 300px;
     */
  height: 70px;
  /* overflow: auto 的效果是：
    如果父元素尺寸小于子元素，那么会以父元素为可见区域创建滚动条，
    子元素进行滚动，滚动时只会显示出父元素的大小
    */
  overflow: auto;
}

.create-doc-wrap .content .group-list {
  max-height: 300px;
  padding-bottom: 14px;
  /* border: 1px solid black; */

  padding-top: 14px;
  /* padding-top: 10px; */
}

.create-doc-wrap .content .group-list .add-doc {
  padding-bottom: 1px;
  width: 348px;
}

.create-doc-wrap .content .group-list .add-doc .add-btn:hover {
  border: 1px solid #00a1d6;
}
.create-doc-wrap .content .group-list .add-doc .add-btn {
  height: 34px;
  line-height: 34px;
  padding: 0 34px;
  border: 1px solid #ccd0d7;
  border-radius: 4px;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAAXNSR0IArs4c6QAAAC5JREFUKBVjYMABZi5a9R+EcUgzMOGSICQ+EjQy4gs5fAFEduDgNHQ0HhnIT6sAudAOjNLnY/wAAAAASUVORK5CYII=)
    no-repeat 10px center;
  /* font-size: 12px; */
  font-size: 14px;
  color: #6d757a;
  cursor: pointer;
}

.create-doc-wrap .content .group-list .add-doc .input-group {
  /*  */
  padding: 0;
  /*  */

  height: 34px;
  line-height: 34px;
  /* 新版色调 */
  /* border: 1px solid #00AEEC; */
  border: 1px solid #00a1d6;
  border-radius: 4px;
  position: relative;
}
.create-doc-wrap .content .group-list .add-doc .input-group > input {
  float: left;
  border: none;
  /* border: 1px solid #bfa; */
  outline: none;
  /* font-size: 12px; */
  font-size: 14px;
  /* width: 200px; */
  width: 300px;
  margin-left: 10px;
  padding: 0;
  box-shadow: none;
  height: 100%;
  background: transparent;
  color: #18191c;
}

.create-doc-wrap .bottom {
  height: 76px;
  text-align: center;
  margin: 0 36px;
  border-top: 1px solid #e5e9ef;
}

.create-doc-wrap .bottom .btn-fav {
  font-size: 14px;
  width: 160px;
  height: 40px;
  margin-top: 18px;
  background: #00a1d6;
  border: none;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
}
.create-doc-wrap .bottom .btn-fav:hover {
  background: #00b5e5;
}
.collection-m .bottom .btn-fav.disable {
  background-color: #e5e9ef;
  color: #b8c0cc;
}
.background {
  background-color: #f2f6ff;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}
</style>
