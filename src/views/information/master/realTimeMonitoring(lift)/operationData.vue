<template>
  <div class="app-container list-container">
    <div class="container-box condition-box">
      <div class="conditionBar">
        <el-form :inline="true" class="condition-form">
          <el-form-item >
            <el-select v-model="checkTime" placeholder="查询时间" @change="dateChange"  :clearable="true" :filterable="true" size="mini">
              <el-option v-for="item in checkTimeList" :label="item.label" :value="item.value" :key="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-date-picker v-model="beginDate" :picker-options="beginPicker" :disabled="dateShow" type="date" placeholder="选择日期" format="yyyy-MM-dd" size="mini"></el-date-picker>
            <i>-</i>
            <el-date-picker v-model="endDate" :picker-options="endPicker" :disabled="dateShow" type="date" placeholder="选择日期" format="yyyy-MM-dd" size="mini"></el-date-picker>
          </el-form-item>
          <!-- <el-form-item>
            <el-select v-model="momentPercentage" placeholder="力矩百分比" size="mini">
              <el-option v-for="item in momentPercentageList" :label="item.label" :value="item.value" :key="item.value"></el-option>
            </el-select>
          </el-form-item> -->
          <!-- <el-form-item >
            <el-select v-model="status" placeholder="状态" size="mini" clearable>
              <el-option v-for="item in statusList" :label="item.label" :value="item.value" :key="item.value" ></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item>
            <el-button class="searchBtn" type="primary" size="mini" icon="el-icon-search" @click="handleSearch">查询</el-button>
              <el-button size="mini" @click="handleCancel">取 消</el-button>
          </el-form-item>
          <el-form-item>
              <el-button type="primary" icon="el-icon-yckz" size="mini" @click="routerLink">切换成图表形式</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div class="container-box list-box">
      <div class="table-box">
        <el-table size="small" :data="listData" style="width: 100%" height="100%" highlight-current-row @selection-change="listSelectionChange" header-row-class-name="xyTableHeader">
          <el-table-column type="selection" :width="selectionWidth"></el-table-column>
          <el-table-column type="index" :width="indexWidth"></el-table-column>
          <el-table-column label="运行时间"  min-width="150" prop="deviceTime"></el-table-column>
          <el-table-column label="载重 (t)" prop="weight"></el-table-column>
          <el-table-column label="人数" prop="people"></el-table-column>
          <el-table-column label="楼层数" prop="floor"></el-table-column>
          <!-- <el-table-column label="倾斜角度" prop="tiltAngle"></el-table-column> -->
          <!-- <el-table-column label="司机" prop="driver"></el-table-column> -->
          <!-- <el-table-column label="设备状态" prop="status"></el-table-column> -->
        </el-table>
      </div>
      <div class="pagination-box">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex" :page-sizes="pageSizes" :page-size="pageSize" :total="pageTotal" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { selectOperationData } from "@/views/information/api/lift.js";
export default {
  data() {
    return {
      listData: [],
      checkTime: "",
      status: "",
      liftId: null,
      pageIndex: 1,
      pageSizes: [10, 20, 30],
      pageSize: 10,
      pageTotal: 0,
      sels: [],
      detailsPath: this.$route.path + "/deviceTypeDetail",
      checkTimeList: [
        { label: "7天内", value: 1 },
        { label: "15天内", value: 2 },
        { label: "30天内", value: 3 },
        { label: "自定义", value: 4 }
      ],
      beginDate: "",
      endDate: "",
      statusList: [{ label: "受控", value: 1 }, { label: "未受控", value: 0 }],
      momentPercentage: "",
      momentPercentageList: [
        { label: "90%以下", value: 1 },
        { label: "90%~110%", value: 2 },
        { label: "110%~120%", value: 3 },
        { label: "120%以上", value: 4 }
      ],
      edit: false,
      dateShow: true
    };
  },
  computed: {
    params() {
      let param = {
        body: {
          deviceTimeBegin: this.beginDate,
          deviceTimeEnd: this.endDate,
          id: this.$route.query.id,
          status: this.status
        },
        pageNum: this.pageIndex,
        pageSize: this.pageSize
      };
      return param;
    },
    beginPicker() {
      let endTime = this.endDate;
      return {
        disabledDate(time) {
          return time.getTime() > new Date(endTime);
        }
      };
    },
    endPicker() {
      let beginTime = this.$moment(this.beginDate);
      return {
        disabledDate(time) {
          return time.getTime() < new Date(beginTime);
        }
      };
    }
  },
  mounted() {
    this.liftId = this.$route.query.id;
    this.getListData();
  },
  methods: {
    routerLink() {
      this.$router.push({
        path: "/realTimeLift/operationChart",
        query: { id: this.liftId }
      });
    },
    //选择查询条件时改变日期选择器的可用性
    dateChange: function() {
      if (this.checkTime == 1) {
        this.dateShow = true;
        let begin = new Date(this.$moment(new Date()).format("YYYY-MM-DD"));
        this.endDate = new Date();
        this.beginDate = new Date(begin.setDate(begin.getDate() - 7));
      } else if (this.checkTime == 2) {
        this.dateShow = true;
        let begin = new Date(this.$moment(new Date()).format("YYYY-MM-DD"));
        this.endDate = new Date();
        this.beginDate = new Date(begin.setDate(begin.getDate() - 15));
      } else if (this.checkTime == 3) {
        this.dateShow = true;
        let begin = new Date(this.$moment(new Date()).format("YYYY-MM-DD"));
        this.endDate = new Date();
        this.beginDate = new Date(begin.setDate(begin.getDate() - 30));
      } else if (this.checkTime == 4) {
        this.dateShow = false;
      }
    },
    //取消
    handleCancel() {
      //this.$router.back(-1);
      this.$router.push("/realTimeLift");
    },
    handleSearch() {
      this.pageIndex = 1;
      this.getListData();
    },
    getListData() {
      selectOperationData(this.params).then(res => {
        this.listData = res.data.list;
        this.pageTotal = Number(res.data.total);
        if (this.pageTotal == 0 && this.pageIndex > 1) {
          this.pageIndex--;
          this.getListData();
        }
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getListData();
    },
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.getListData();
    },
    listSelectionChange(sels) {
      this.sels = sels;
    },
    handleInsert() {
      this.$router.push({ path: this.detailsPath, query: { type: "insert" } });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
