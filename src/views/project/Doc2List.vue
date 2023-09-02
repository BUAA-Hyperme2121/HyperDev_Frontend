<template>
  <div class="collaborative-manage-page-container">
    <div class="manage-page-container">
      <div class="operation-container">
        <div class="operation-title">工作台</div>
        <div class="operation-notice" style="margin-top: 50px">
          新建项目文档
        </div>
        <div
          class="create-new-doc-area"
          @click="ifShowTheCreateNewDocWindow = true"
        ></div>
        <div class="operation-notice" style="margin-top: 80px">新建文件夹</div>
        <div
          class="create-new-doc-area"
          @click="ifShowTheCreateNewFolderWindow = true"
        ></div>
      </div>
      <div class="table-container">
        <div class="operation-title">项目文档列表</div>
        <div style="margin: 0 50px">
          <el-tree :data="document_list" :props="treeProps">
            <template v-slot="{ node, data }">
              <div class="custom-tree-node">
                <span v-if="data.doc_name"
                  ><i
                    style="font-size: large; font-weight: 700"
                    class="el-icon-document"
                  ></i
                ></span>
                <span v-else
                  ><i
                    style="font-size: large; font-weight: 700"
                    class="el-icon-folder-opened"
                  ></i
                ></span>
                <span>{{ data.doc_name || data.folder_name }}</span>
                <span v-if="data.doc_name">
                  <el-button type="primary" @click="handleEdit(data)"
                    >编辑</el-button
                  >
                  <el-button type="primary" @click="handleDocRename(data)"
                    >重命名</el-button
                  >
                  <el-button type="primary" @click="handleDocDelete(data)"
                    >删除</el-button
                  >
                </span>
                <span v-else>
                  <el-button
                    type="primary"
                    @click="handleDocInFolderCreate(data)"
                    >新建</el-button
                  >
                  <el-button type="primary" @click="handleFolderRename(data)"
                    >重命名</el-button
                  >
                  <el-button type="primary" @click="handleFolderDelete(data)"
                    >删除</el-button
                  >
                </span>
              </div>
            </template>
          </el-tree>
        </div>
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
            新建项目文档
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
            <button class="btn-fav" @click="handleDocCreate">确定</button>
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
              @click="renameDocument(curOperationDoc.id, renameDocumentTitle)"
            >
              确定
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 用于新建文件夹的悬浮窗口 -->
    <div
      class="dialog-m"
      v-if="ifShowTheCreateNewFolderWindow"
      @click.self="closeCreateNewFolderWindow"
    >
      <div class="dialog-bomb">
        <div class="create-doc-wrap">
          <div class="title">
            新建项目文件夹
            <!-- 关闭悬浮窗口 -->
            <i class="close" @click="closeCreateNewFolderWindow"></i>
          </div>
          <div
            class="content"
            @click.self="changeToNewFolderTitleInput = false"
          >
            <div class="group-list">
              <div class="add-doc">
                <div
                  class="add-btn"
                  v-if="changeToNewFolderTitleInput === false"
                  @click="changeToNewFolderTitleInput = true"
                >
                  在这里输入新建文件夹名
                </div>

                <div
                  class="input-group"
                  v-else
                  @keydown.esc="changeToNewFolderTitleInput = false"
                >
                  <input
                    type="text"
                    maxlength="20"
                    placeholder="最多可以输入20字"
                    v-model="newFolderTitle"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="bottom">
            <button class="btn-fav" @click="handleFolderCreate">确定</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 用于更改文件夹名字的悬浮窗口 -->
    <div
      class="dialog-m"
      v-if="ifShowTheRenameFolderWindow"
      @click.self="closeRenameFolderWindow"
    >
      <div class="dialog-bomb">
        <div class="create-doc-wrap">
          <div class="title">
            重命名文件夹
            <!-- 关闭悬浮窗口 -->
            <i class="close" @click="closeRenameFolderWindow"></i>
          </div>
          <div class="content" @click.self="changeToRenameFolderInput = false">
            <div class="group-list">
              <div class="add-doc">
                <div
                  class="add-btn"
                  v-if="changeToRenameFolderInput === false"
                  @click="changeToRenameFolderInput = true"
                >
                  输入新的文件夹名称
                </div>

                <div
                  class="input-group"
                  v-else
                  @keydown.esc="changeToRenameFolderInput = false"
                >
                  <input
                    type="text"
                    maxlength="20"
                    placeholder="最多可以输入20字"
                    v-model="renameFolderTitle"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="bottom">
            <!-- 这里传入 输入的内容新标题 -->
            <button
              class="btn-fav"
              @click="renameFolder(curOperationFolder.id, renameFolderTitle)"
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
const DEFAULT_FOLDER_NAME = "未命名文件夹";
const DEFAULT_FOLDER_RENAME = "新的文件夹名称";
export default {
  data() {
    return {
      newDocumentTitle: DEFAULT_DOC_NAME,
      renameDocumentTitle: DEFAULT_RENAME,
      currentFolderID: -1,
      newFolderTitle: DEFAULT_FOLDER_NAME,
      renameFolderTitle: DEFAULT_FOLDER_RENAME,
      false_list: [
        {
          id: 1,
          doc_name: "文档1",
        },
        {
          id: 1,
          folder_name: "文件夹1",
          documents: [
            {
              id: 3,
              doc_name: "文档3",
            },
            {
              id: 4,
              doc_name: "文档4",
            },
          ],
        },
        {
          id: 2,
          doc_name: "文档2",
        },
      ],
      treeProps: {
        label: "doc_name",
        children: "documents", // 指定子节点的属性名
      },
      // VERY IMPORTANT 当前正在操作的文档
      curOperationDoc: {
        id: 1,
        doc_name: "1-标题",
        text: "",
      },
      curOperationFolder: {
        id: 1,
        folder_name: "1-标题",
      },
      // 当前项目下已经创建的文件列表
      document_list: [],
      /*
      文档相关
      */
      //是否显示新建悬浮窗
      ifShowTheCreateNewDocWindow: false,
      // 切换进入新文档输入框的属性
      changeToNewTitleInput: false,

      // 是否浮现重命名文档的悬浮窗
      ifShowTheRenameDocWindow: false,

      changeToRenameInput: false,
      /*
      文件夹相关
      */
      ifShowTheCreateNewFolderWindow: false,
      // 切换进入新文档输入框的属性
      changeToNewFolderTitleInput: false,
      // 是否浮现重命名文档的悬浮窗
      ifShowTheRenameFolderWindow: false,

      changeToRenameFolderInput: false,
    };
  },
  created() {
    this.getCurrentDocumentList();
  },
  methods: {
    //获取当前列表
    async getCurrentDocumentList() {
      this.$showLoading.show();
      let project_id = this.$route.params.project_id;
      this.axios({
        method: "GET",
        url: `/project/${project_id}/document`,
        params: {
          jwt: JSON.parse(localStorage.getItem("jwt")),
          folder_view: true,
        },
      })
        .then((res) => {
          console.log(res);
          this.document_list = res.data.data;
          this.$showLoading.hide();
        })
        .catch((err) => {
          console.log(err);
          this.$showLoading.hide();
        });
    },
    //处理文档新建
    closeCreateNewDocWindow() {
      // 如果是不点击确定就退出，那么就需要还原更改的操作
      this.newDocumentTitle = DEFAULT_DOC_NAME;
      // 清除以后再关闭窗口
      this.ifShowTheCreateNewDocWindow = false;
      // 切换回原来的按钮
      this.changeToNewTitleInput = false;
      //将文件夹id调成-1
      this.currentFolderID = -1;
    },
    async handleDocCreate() {
      // 先关掉窗口
      this.ifShowTheCreateNewDocWindow = false;
      //判断是否在文件夹中创建
      if (this.currentFolderID != -1) {
        let folder_id = this.currentFolderID;
        let document_title = this.newDocumentTitle;
        //改回初始设置
        this.newDocumentTitle = DEFAULT_DOC_NAME;
        this.currentFolderID = -1;
        let formData = new FormData();
        let project_id = this.$route.params.project_id;
        formData.append("doc_name", document_title);
        formData.append("jwt", JSON.parse(localStorage.getItem("jwt")));
        formData.append("text", "");
        this.axios({
          method: "POST",
          url: `/project/${project_id}/folder/${folder_id}/document`,
          data: formData,
        })
          .then((res) => {
            console.log(res);
            this.$message.success("创建成功");
            this.getCurrentDocumentList();
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        let formData = new FormData();
        let project_id = this.$route.params.project_id;
        let document_title = this.newDocumentTitle;
        this.newDocumentTitle = DEFAULT_DOC_NAME;
        formData.append("doc_name", document_title);
        formData.append("jwt", JSON.parse(localStorage.getItem("jwt")));
        this.axios({
          method: "POST",
          url: `/project/${project_id}/document`,
          data: formData,
        })
          .then((res) => {
            console.log(res);
            this.$message.success("创建成功");
            this.getCurrentDocumentList();
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },

    //处理文档编辑
    async handleEdit(data) {
      let document_id = data.id;
      let project_id = this.$route.params.project_id;
      this.$router.push({
        path: `/project/${project_id}/doc`,
        query: {
          document_id: document_id,
        },
      });
    },
    //处理文档删除
    async handleDocDelete(data) {
      let formData = new FormData();
      formData.append("jwt", JSON.parse(localStorage.getItem("jwt")));
      let document_id = data.id;
      let project_id = this.$route.params.project_id;
      this.axios({
        method: "DELETE",
        url: `/project/${project_id}/document/${document_id}`,
        data: formData,
      })
        .then((res) => {
          console.log(res);
          this.$message.success("文档删除成功！");
          this.getCurrentDocumentList();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //处理文档重命名
    async renameDocument(documentID, newTitle) {
      this.ifShowTheRenameDocWindow = false;

      let formData = new FormData();
      formData.append("jwt", JSON.parse(localStorage.getItem("jwt")));
      formData.append("doc_name", newTitle);
      let document_id = documentID;
      let project_id = this.$route.params.project_id;
      this.axios({
        method: "PUT",
        url: `/project/${project_id}/document/${document_id}`,
        data: formData,
      })
        .then((res) => {
          console.log(res.data);
          this.$message.success("文档重命名成功！");
          this.getCurrentDocumentList();
        })
        .catch((err) => {
          console.log(err);
        });
    },

    closeRenameDocWindow() {
      this.renameDocumentTitle = DEFAULT_RENAME;
      this.ifShowTheRenameDocWindow = false;
      this.changeToRenameInput = false;
    },

    handleDocRename(data) {
      this.curOperationDoc.id = data.id;
      this.curOperationDoc.doc_name = data.doc_name;
      this.changeToRenameInput = false;
      this.renameDocumentTitle = data.doc_name;
      this.ifShowTheRenameDocWindow = true;
    },
    //处理文件夹新建
    closeCreateNewFolderWindow() {
      // 如果是不点击确定就退出，那么就需要还原更改的操作
      this.newFolderTitle = DEFAULT_FOLDER_NAME;
      // 清除以后再关闭窗口
      this.ifShowTheCreateNewFolderWindow = false;
      // 切换回原来的按钮
      this.changeToNewFolderTitleInput = false;
    },
    async handleFolderCreate() {
      // 先关掉窗口
      this.ifShowTheCreateNewFolderWindow = false;
      let formData = new FormData();
      let project_id = this.$route.params.project_id;
      let folder_name = this.newFolderTitle;
      this.newFolderTitle = DEFAULT_FOLDER_NAME;
      formData.append("folder_name", folder_name);
      formData.append("jwt", JSON.parse(localStorage.getItem("jwt"))),
        this.axios({
          method: "POST",
          url: `/project/${project_id}/folder/`,
          data: formData,
        })
          .then((res) => {
            console.log(res);
            this.$message.success("创建成功");
            this.getCurrentDocumentList();
          })
          .catch((err) => {
            console.log(err);
          });
    },
    //处理文件夹删除
    async handleFolderDelete(data) {
      let formData = new FormData();
      formData.append("jwt", JSON.parse(localStorage.getItem("jwt")));
      let folder_id = data.id;
      let project_id = this.$route.params.project_id;
      this.axios({
        method: "DELETE",
        url: `/project/${project_id}/folder/${folder_id}`,
        data: formData,
      })
        .then((res) => {
          console.log(res);
          this.$message.success("文件夹删除成功！");
          this.getCurrentDocumentList();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //处理文件夹重命名
    async renameFolder(folderID, newTitle) {
      this.ifShowTheRenameFolderWindow = false;

      let formData = new FormData();
      formData.append("jwt", JSON.parse(localStorage.getItem("jwt")));
      formData.append("folder_name", newTitle);
      let folder_id = folderID;
      let project_id = this.$route.params.project_id;
      this.axios({
        method: "PUT",
        url: `/project/${project_id}/folder/${folder_id}`,
        data: formData,
      })
        .then((res) => {
          console.log(res.data);
          this.$message.success("文件夹重命名成功！");
          this.getCurrentDocumentList();
        })
        .catch((err) => {
          console.log(err);
        });
    },

    closeRenameFolderWindow() {
      this.renameFolderTitle = DEFAULT_FOLDER_RENAME;
      this.ifShowTheRenameFoldercWindow = false;
      this.changeToRenameFolderInput = false;
    },

    handleFolderRename(data) {
      this.curOperationFolder.id = data.id;
      this.curOperationFolder.folder_name = data.folder_name;
      this.changeToRenameFolderInput = false;
      this.renameFolderTitle = data.folder_name;
      this.ifShowTheRenameFolderWindow = true;
    },
    //处理在文件夹中新建文件
    handleDocInFolderCreate(data) {
      this.currentFolderID = data.id;
      this.ifShowTheCreateNewDocWindow = true;
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep .el-button {
  background-color: #f0f4ff;
  color: black;
  &:hover {
    background-color: #b7cbff;
  }
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 600;
  padding-right: 8px;
}
::v-deep .el-tree-node__content {
  height: 50px !important;
  background-color: transparent;
  &:hover {
    background: #cccccc;
  }
}
::v-deep .el-tree {
  background-color: transparent !important;
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

.operation-container .operation-notice {
  margin-top: 10px;

  /* font-family: 'Courier New', Courier, monospace; */
  font-family: "PingFang SC";
  font-size: 18px;
}

.operation-title {
  text-align: center;
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

.operation-container .create-new-doc-area:hover {
  border: 3px dashed #6d757a;
  color: #6d757a;
}

.operation-container .create-new-doc-area {
  margin: 10px 10px;
  /* height: 50px; */
  height: 100px;
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
  width: 60%;
  border: 2px solid #808080;
  border-radius: 0.75rem;
  overflow-y: auto;
  height: 562px;
  /* overflow-y: hidden; 
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
</style>
