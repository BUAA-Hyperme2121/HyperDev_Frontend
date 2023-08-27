<template>
  <el-card class="box-card" slot="header">
    <div class="card-header">
      <span>
        {{ item.project_name }}
      </span>
      <!-- 操作按钮 -->
      <el-dropdown>
        <span class="el-dropdown-link"> ··· </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>恢复</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <div v-for="o in 4" :key="o" class="text item">{{ "List item " + o }}</div>
  </el-card>
</template>

<script>
export default {
  // 接收传来的props
  props: ["item"],
};
</script>

<style scoped>
.box-card {
  margin: 20px;
}
.box-card:hover {
  cursor: pointer;
  filter: drop-shadow(0 0 0.5em #5e5f68aa);
}
.card-header {
  display: flex;
  justify-content: space-between;
}

.el-dropdown-link {
  font-weight: 700;
}
</style>
