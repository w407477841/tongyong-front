<template>
  <div>
    <!-- <org></org> -->
    <org v-if="isOrg"></org>
    <project v-if="isProject"></project>
  </div>
</template>

<script>
import org from "./org.vue";
import project from "./project.vue";

export default {
  components: {
    org,
    project
  },
  data() {
    return {
      isProject: false,
      isOrg: false
    };
  },
  created() {
    let pros = JSON.parse(sessionStorage.getItem("pros"));
    let orgId = sessionStorage.getItem("orgId");
    if (pros.length == 1) {
      if (pros[0].level == 1) {
        this.isProject = false;
        this.isOrg = true;
      } else {
        this.isProject = true;
        this.isOrg = false;
      }
    } else {
      if (orgId == pros[0].id) {
        this.isProject = false;
        this.isOrg = true;
      } else {
        this.isProject = true;
        this.isOrg = false;
      }
    }
  }
};
</script>