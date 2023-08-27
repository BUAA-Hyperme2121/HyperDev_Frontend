<template>
  <div class="collaborative-manage-page-container">
    <div class="manage-page-container">
      <div class="operation-container">
        <div class="operation-title" @click="jumpTo">操作列表</div>
        <div class="operation-notice">新建共享文档</div>
        <div
          class="create-new-doc-area"
          @click="ifShowTheCreateNewDocWindow = true"
        ></div>
      </div>

      <div class="table-container">
        <el-table :data="falselist" style="width: 100%" border height="550">
          <!-- <el-table-column
            prop="document_id"
            label="文档id"
            width="80"
          >
          </el-table-column> -->

          <el-table-column prop="document_title" label="文档标题" width="190">
          </el-table-column>

          <el-table-column prop="creator_name" label="文档创建者" width="130">
          </el-table-column>

          <el-table-column
            label="文档创建时间"
            width="170"
            style="display: flex; align-items: center"
          >
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <!-- <span style="margin-left: 10px;">{{scope.row.created_time}}</span> -->
              <span style="margin-left: 10px">{{
                scope.row.created_time.substring(0, 10)
              }}</span>
              <span style="margin-left: 3px">{{
                scope.row.created_time.substring(11, 16)
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            style="
              display: flex;
              flex-direction: column;
              align-items: stretch;
              justify-content: space-between;
            "
          >
            <template slot-scope="scope">
              <el-button type="primary" @click="openRenameDocWindow(scope.row)"
                >重命名</el-button
              >
              <el-button
                type="primary"
                @click="getOldDocumentToken(scope.row.document_id)"
                >编辑</el-button
              >
              <el-button
                type="primary"
                @click="removeSingleDocument(scope.row.document_id)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 用于新建文档的悬浮窗口 -->
    <div
      class="dialog-m"
      v-if="ifShowTheCreateNewDocWindow"
      @click.self="closeCreateNewDocWindow"
    >
      <div class="dialog-bomb">
        <div class="create-doc-wrap">
          <div class="title">
            新建即时协作文档
            <!-- 关闭悬浮窗口 -->
            <i class="close" @click="closeCreateNewDocWindow"></i>
          </div>
          <div class="content" @click.self="changeToNewTitleInput = false">
            <div class="group-list">
              <div class="add-doc">
                <div
                  class="add-btn"
                  v-if="changeToNewTitleInput === false"
                  @click="changeToNewTitleInput = true"
                >
                  在这里输入新建文档名
                </div>

                <div
                  class="input-group"
                  v-else
                  @keydown.esc="changeToNewTitleInput = false"
                >
                  <input
                    type="text"
                    maxlength="20"
                    placeholder="最多可以输入20字"
                    v-model="newDocumentTitle"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="bottom">
            <button class="btn-fav" @click="getNewDocumentToken">确定</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 用于更改文档名字的悬浮窗口 -->
    <div
      class="dialog-m"
      v-if="ifShowTheRenameDocWindow"
      @click.self="closeRenameDocWindow"
    >
      <div class="dialog-bomb">
        <div class="create-doc-wrap">
          <div class="title">
            重命名即时协作文档
            <!-- 关闭悬浮窗口 -->
            <i class="close" @click="closeRenameDocWindow"></i>
          </div>
          <div class="content" @click.self="changeToRenameInput = false">
            <div class="group-list">
              <div class="add-doc">
                <div
                  class="add-btn"
                  v-if="changeToRenameInput === false"
                  @click="changeToRenameInput = true"
                >
                  输入新的文档名称
                </div>

                <div
                  class="input-group"
                  v-else
                  @keydown.esc="changeToRenameInput = false"
                >
                  <input
                    type="text"
                    maxlength="20"
                    placeholder="最多可以输入20字"
                    v-model="renameDocumentTitle"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="bottom">
            <!-- 这里传入 输入的内容新标题 -->
            <button
              class="btn-fav"
              @click="
                renameDocument(curOperationDoc.document_id, renameDocumentTitle)
              "
            >
              确定
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
const DEFAULT_DOC_NAME = "未命名文档";
const DEFAULT_RENAME = "新的文档名称";
export default {
  data() {
    return {
      newDocumentTitle: DEFAULT_DOC_NAME,
      renameDocumentTitle: DEFAULT_RENAME,
      falselist: [
        {
          document_id: 7,
          creator_id: 0,
          document_title: "1-标题",
          creator_name: "xiaoyi",
          document_content:
            "<p>dashodhaso</p><p></p><p>asfasddassdda</p><p>da</p><p></p><p>dsadasada</p><p></p><p></p><p></p><p>dasdasds</p><p>dasdas</p><p>dsa</p>",
          created_time: "2022-08-04T14:56:22.274",
          updated_time: "",
        },
        {
          document_id: 8,
          creator_id: 0,
          document_title: "2-标题",
          creator_name: "xiaoyi",
          document_content:
            "<p>dashodhaso</p><p></p><p>asfasddassdda</p><p>da</p><p></p><p>dsadasada</p><p></p><p></p><p></p><p>dasdasds</p><p>dasdas</p><p>dsa</p>",
          created_time: "2022-08-04T14:56:22.274",
          updated_time: "",
        },
        {
          document_id: 9,
          creator_id: 0,
          document_title: "3-标题",
          creator_name: "xiaoyi",
          document_content:
            "<p>dashodhaso</p><p></p><p>asfasddassdda</p><p>da</p><p></p><p>dsadasada</p><p></p><p></p><p></p><p>dasdasds</p><p>dasdas</p><p>dsa</p>",
          created_time: "2022-08-04T14:56:22.274",
          updated_time: "",
        },
      ],
      // VERY IMPORTANT 当前正在操作的文档
      curOperationDoc: {
        document_id: 7,
        creator_id: 0,
        document_title: "1-标题",
        document_content:
          "<p>dashodhaso</p><p></p><p>asfasddassdda</p><p>da</p><p></p><p>dsadasada</p><p></p><p></p><p></p><p>dasdasds</p><p>dasdas</p><p>dsa</p>",
        created_time: "2022-08-04T14:56:22.274",
        updated_time: "",
      },
      // 当前项目下已经创建的文件列表
      document_list: [],
      ifShowTheCreateNewDocWindow: false,
      // 切换进入新文档输入框的属性
      changeToNewTitleInput: false,

      // 是否浮现重命名文档的悬浮窗
      ifShowTheRenameDocWindow: false,

      changeToRenameInput: false,
    };
  },
  created() {
    this.getCurrentDocumentList();
  },
  methods: {
    async getCurrentDocumentList() {
      let formData = new FormData();
      let project_id = this.$route.params.project_id;
      formData.append("JWT", JSON.parse(localStorage.getItem("loginInfo")).JWT);
      formData.append("project_id", project_id);
      this.axios({
        method: "POST",
        url: "https://summer.super2021.com/api/document/list_document",
        data: formData,
      })
        .then((res) => {
          this.document_list = res.data.document_list;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    closeCreateNewDocWindow() {
      // 如果是不点击确定就退出，那么就需要还原更改的操作
      this.newDocumentTitle = DEFAULT_DOC_NAME;
      // 清除以后再关闭窗口
      this.ifShowTheCreateNewDocWindow = false;
      // 切换回原来的按钮
      this.changeToNewTitleInput = false;
    },
    async getNewDocumentToken() {
      // 先关掉窗口
      this.ifShowTheCreateNewDocWindow = false;
      let formData = new FormData();
      let project_id = this.$route.params.project_id;
      let document_title = this.newDocumentTitle;
      formData.append("JWT", JSON.parse(localStorage.getItem("loginInfo")).JWT);
      formData.append("project_id", project_id);
      formData.append("document_title", document_title);
      this.axios({
        method: "POST",
        url: "https://summer.super2021.com/api/document/create_token",
        data: formData,
      })
        .then((res) => {
          let document_id = res.data.document_id;
          this.$router.push({
            path: "/project/doc",
            query: {
              document_id: document_id,
            },
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async getOldDocumentToken(documentID) {
      let document_id = documentID;
      this.$router.push({
        path: "/project/doc",
        query: {
          document_id: document_id,
        },
      });
    },
    async removeSingleDocument(documentID) {
      let formData = new FormData();
      formData.append("JWT", JSON.parse(localStorage.getItem("loginInfo")).JWT);
      formData.append("document_id", documentID);
      this.axios({
        method: "POST",
        url: "https://summer.super2021.com/api/document/delete_document",
        data: formData,
      })
        .then((res) => {
          this.$message.success("文档删除成功！");
          this.document_list = res.data.document_list;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    /**
     * 重命名某个文档
     * @param {string} documentID 需要重命名的文档id
     * @param {string} newTitle 重新命名的新文档名字
     */
    async renameDocument(documentID, newTitle) {
      console.log(
        `想要重命名的文件id是 :${documentID}, 新的名字是 :${newTitle}`
      );

      /// 先关闭窗口
      this.ifShowTheRenameDocWindow = false;

      let formData = new FormData();
      let document_id = documentID;
      let document_title = newTitle;

      formData.append("JWT", JSON.parse(localStorage.getItem("loginInfo")).JWT);
      formData.append("document_id", document_id);
      formData.append("document_title", document_title);
      this.axios({
        method: "POST",
        url: "https://summer.super2021.com/api/document/rename_document",
        data: formData,
      })
        .then((res) => {
          console.log(res);
          this.$message.success("文档重命名成功！");
          this.document_list = res.data.document_list;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    /**
     * 除了点击“确定”以外其他的退出重命名窗口的方式
     * 有一些注意事项
     */
    closeRenameDocWindow() {
      this.renameDocumentTitle = DEFAULT_RENAME;
      this.ifShowTheRenameDocWindow = false;
      this.changeToRenameInput = false;
    },
    /**
     * VERY IMPORTANT NOTE
     * 这里在打开重命名文件窗口时，需要传入这个文件对象
     * 这里是因为打开重命名窗口和发送重命名请求是两端，
     *    打开重命名窗口不代表一定会重命名
     * @param {document} item
     */
    openRenameDocWindow(item) {
      this.curOperationDoc = item;
      this.changeToRenameInput = false;
      this.renameDocumentTitle = item.document_title;
      this.ifShowTheRenameDocWindow = true;
    },
    jumpTo() {
      this.$router.push("/project/1/doc?document_id=1");
    },
  },
};
</script>

<style scoped>
.operation-container {
  float: left;
  margin-top: 40px;
  text-align: center;
  width: 20%;
  height: 550px;
  border: 2px solid #808080;
  border-radius: 0.75rem;
  overflow: hidden;
}
.operation-container .operation-title {
  margin-top: 10px;
  margin-bottom: 10px;
  padding-bottom: 10px;
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
  width: 70%;
  border: 2px solid #808080;
  border-radius: 0.75rem;
  overflow: hidden;
  /* overflow-y: hidden; */
  /* overflow-x: scroll; */
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
/* #endregion 创建新文档/重命名文档的浮窗 */
</style>
