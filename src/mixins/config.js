let config = {
  data() {
    return {
      selectionWidth: "45",
      indexWidth: "40",
      dateWidth: "100",
      userWidth: "100",
      operateWidth: "280",
      allOperations: sessionStorage.getItem("userOperations")
        ? sessionStorage.getItem("userOperations").split(",")
        : null
    };
  },
  computed: {},
  watch: {},
  methods: {
    //权限校验
    validateOperation(operation) {
      let show = false;
      if (
        this.allOperations.indexOf(this.operationPrex + ":" + operation) > -1
      ) {
        show = true;
      }
      return show;
    },
    //根据传入参数判断按钮是否置灰
    checkDisabled(check, sels) {
      let list = sels ? sels : this.sels;
      let disabled = false;

      if (list != null && list.length > 0) {
        disabled = false;
        if (check) {
          let checks = check.split("=");
          let key = checks[0];
          let val = checks[1];
          list.forEach(el => {
            if (el[key] == val) {
              disabled = true;
            }
          });
        }
      } else {
        disabled = true;
      }
      return disabled;
    },

    removeEmpty(obj) {
      if (obj instanceof Array) {
        obj.forEach(el => {
          for (let k in el) {
            if (
              k.indexOf("_") >= 0 ||
              el[k] == "" ||
              el[k] == undefined ||
              el[k] == null ||
              el[k] == "NaN"
            ) {
              delete el[k];
            }
          }
        });
      } else {
        for (let k in obj) {
          if (
            k.indexOf("_") >= 0 ||
            obj[k] == "" ||
            obj[k] == undefined ||
            obj[k] == null ||
            obj[k] == "NaN"
          ) {
            delete obj[k];
          }
        }
      }
      return obj;
    },
    //处理时间快捷选择(7天,15天,30天,X天)
    chooseShortcutDate() {
      this.edit = false;
      if (this.checkTime) {
        this.endTime = this.$moment(new Date()).format("YYYY-MM-DD");
        if (this.checkTime === 1) {
          this.edit = true;
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
          this.beginTime = this.$moment(start).format("YYYY-MM-DD");
          this.handleSearchButton();
          return;
        }
        if (this.checkTime === 2) {
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 15);
          this.beginTime = this.$moment(start).format("YYYY-MM-DD");
          this.edit = true;
          this.handleSearchButton();
          return;
        }
        if (this.checkTime === 3) {
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
          this.beginTime = this.$moment(start).format("YYYY-MM-DD");
          this.edit = true;
          this.handleSearchButton();
          return;
        }
        if (this.checkTime === 4) {
          this.edit = false;
          this.beginTime = "";
          this.handleSearchButton();
          //const start = new Date();
          //start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
          //this.beginTime = this.$moment(start).format('YYYY-MM-DD');
        }
      }
    },
    toFixedFormat(row, column, cellValue, index) {
      return cellValue ? Number(cellValue).toFixed(2) : cellValue;
    },
    // dateFormat(row, column, cellValue, index) {
    //   return cellValue ? this.$moment(cellValue).format("YYYY-MM-DD") : "";
    // },
    // dateTimeFormat(row, column, cellValue, index) {
    //   return cellValue
    //     ? this.$moment(cellValue).format("YYYY-MM-DD HH:mm:ss")
    //     : "";
    // }
  },
  created() {}
};
export default config;
