<template>
  <div>
    <el-dropdown trigger="click" @command="selectLang">
      <span class="el-dropdown-link">
        {{ title }}
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="(value, key) in localList" :command="key" :key="`lang-${key}`">{{ value }}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  name: 'Language',
  data() {
    return {
      lang: this.$i18n.locale,
      langList: {
        zh: '语言',
        en: 'Lang'
      },
      localList: {
        zh: '中文简体',
        en: 'English'
      }
    };
  },
  watch: {
    lang(lang) {
      this.$i18n.locale = lang;
    }
  },
  computed: {
    title() {
      return this.langList[this.lang];
    }
  },
  methods: {
    selectLang(command) {
      this.lang = command;
    }
  }
};
</script>

<style lang="scss" scoped>
.el-dropdown-link{
  cursor: pointer;
}
</style>
