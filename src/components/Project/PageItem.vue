<template>
  <div>
    <el-row v-for="(page, index) in pagelist" :key="index" class="page-item">
      <el-col :span="4">
        <i class="el-icon-notebook-2"></i>
      </el-col>
      <el-col :span="20">
        <div class="page-title">{{ page.title }}</div>
        <div class="icon-options">
          <el-tooltip content="编辑" placement="top">
            <i class="el-icon-edit"></i>
          </el-tooltip>
          <el-tooltip content="重命名" placement="top">
            <i class="el-icon-edit-outline"></i>
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
            <i class="el-icon-delete"></i>
          </el-tooltip>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "PageList",
  props: {
    pagelist: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped>
.page-item {
  margin-bottom: 10px;
}

.page-icon {
  width: 32px;
  height: 32px;
}

.page-title {
  font-size: 16px;
  font-weight: bold;
}

.icon-options {
  margin-top: 5px;
}

.icon-options i {
  margin-right: 10px;
  cursor: pointer;
}
</style>
