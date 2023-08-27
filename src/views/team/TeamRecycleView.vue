<template>
  <div class="projects-box">
    <DelProjectItem
      v-for="item in delProjectList"
      :key="item.id"
      :item="item"
    />
  </div>
</template>

<script>
import DelProjectItem from "@/components/Project/DelProjectItem.vue";
export default {
  components: {
    DelProjectItem,
  },
  data() {
    return {
      delProjectList: [
        {
          id: 1,
          project_name: "项目1",
        },
        {
          id: 2,
          project_name: "项目2",
        },
        {
          id: 3,
          project_name: "项目3",
        },
      ],
    };
  },
};
</script>

<style scoped>
.projects-box {
  display: flex;
}
</style>
