<template>
  <div v-if="showFullScreenBtn" class="full-screen-btn-con">
    <i v-if="value" class="el-icon-tuichuquanping" @click="handleChange"></i>
    <i v-if="!value" class="el-icon-quanping" @click="handleChange"></i>
  </div>
</template>

<script>
export default {
  name: 'Fullscreen',
  data(){
    return {
      value:false
    }
  },
  computed: {
    showFullScreenBtn () {
      return window.navigator.userAgent.indexOf('MSIE') < 0
    }
  },
  methods: {
    handleFullscreen () {
      let main = document.body
      if (this.value) {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
        this.value = false;
      } else {
        if (main.requestFullscreen) {
          main.requestFullscreen()
        } else if (main.mozRequestFullScreen) {
          main.mozRequestFullScreen()
        } else if (main.webkitRequestFullScreen) {
          main.webkitRequestFullScreen()
        } else if (main.msRequestFullscreen) {
          main.msRequestFullscreen()
        }
        this.value = true;
      }
    },
    handleChange () {
      this.handleFullscreen()
    }
  },
  mounted () {
  }
}
</script>

<style lang="scss">
.full-screen-btn-con{
  height: 64px;
  line-height: 56px;
  i{
    cursor: pointer;
  }
}
</style>
