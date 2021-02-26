<template>
  <div class="app-container list-container">
    <div class="container-box condition-box">
      <div class="conditionBar">
        <el-form :inline="true" class="condition-form" size="mini">
          <el-form-item>
            <el-date-picker
              v-model="daterange"
              type="daterange"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
              :clearable="false"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="percentage"
              placeholder="力矩百分比"
              :clearable="true"
              :filterable="true"
              size="mini"
            >
              <el-option
                v-for="item in momentPercentageList"
                :label="item.label"
                :value="item.value"
                :key="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item>
            <el-select v-model="status" placeholder="状态" :clearable="true" :filterable="true" size="mini">
              <el-option v-for="item in statusList" :label="item.label" :value="item.value" :key="item.value"></el-option>
            </el-select>
          </el-form-item>-->
          <el-form-item>
            <el-button
              class="searchBtn"
              type="primary"
              size="mini"
              icon="el-icon-search"
              @click="handleSearch"
            >查询</el-button>
          </el-form-item>
          <!-- <el-form-item>
            <el-button type="primary" icon="el-icon-yckz" size="mini" @click="routerLink">切换成图表形式</el-button>
          </el-form-item> -->
        </el-form>
      </div>
    </div>

    <div class="container-box list-box">
      <div class="table-box">
        <el-table
          size="small"
          :data="listData"
          style="width: 100%"
          height="100%"
          highlight-current-row
          @selection-change="listSelectionChange"
          header-row-class-name="xyTableHeader"
        >
          <el-table-column type="selection" :width="selectionWidth"></el-table-column>
          <el-table-column type="index" :width="indexWidth"></el-table-column>
          <el-table-column label="运行时间"  min-width="150" prop="deviceTime" :formatter="getDate"></el-table-column>
          <el-table-column label="幅度(m)" prop="range"></el-table-column>
          <el-table-column label="高度(m)" prop="height"></el-table-column>
          <el-table-column label="下降深度(m)" prop="ropeLength"></el-table-column>
          <el-table-column label="重量(t)" prop="weight"></el-table-column>
          <el-table-column label="力矩(KN.m)" prop="moment"></el-table-column>
          <el-table-column label="力矩百分比(%)" prop="momentPercentage"></el-table-column>
          <el-table-column label="回转角度(°)" prop="rotaryAngle"></el-table-column>
          <el-table-column label="倾斜角度(°)" prop="tiltAngle"></el-table-column>
          <el-table-column label="风速(m/s)" prop="windSpeed"></el-table-column>
          <el-table-column label="风力(级)">
            <template slot-scope="scope">{{Math.ceil(scope.row.windSpeed/2)}}</template>
          </el-table-column>
          <el-table-column label="司机" prop="driver"></el-table-column>
          <!-- 
          <el-table-column label="设备状态" prop="status" :formatter="getStatus"></el-table-column>-->
        </el-table>
      </div>
      <div class="pagination-box">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageIndex"
          :page-sizes="pageSizes"
          :page-size="pageSize"
          :total="pageTotal"
          layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { selectCraneData } from "@/views/api/equipmentApi.js";

export default {
  data() {
    return {
      listData: [],
      status: "",
      pageIndex: 1,
      pageSizes: [10, 20, 30],
      pageSize: 10,
      pageTotal: 0,
      sels: [],
      detailsPath: this.$route.path + "/deviceTypeDetail",
      statusList: [{ label: "未受控", value: 0 }, { label: "受控", value: 1 }],
      percentage: "",
      momentPercentageList: [
        { label: "90%以下", value: 1 },
        { label: "90%~110%", value: 2 },
        { label: "110%~120%", value: 3 },
        { label: "120%以上", value: 4 }
      ],
      edit: false,
      dateShow: true,
      //时间
      daterange: "",
      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近十五天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 15);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      }
    };
  },
  computed: {
    params() {
      let [startTime, endTime] = this.daterange || ["", ""];
      let param = {
        id: this.$route.query.id,
        pageNum: this.pageIndex,
        pageSize: this.pageSize,
        startTime: `${startTime} 00:00:00`,
        endTime: `${endTime} 23:59:59`,
        body: {
          checkTime: 4,
          percentage: this.percentage,
          status: this.status
        }
      };
      return param;
    }
  },
  mounted() {
    let startTime = this.$moment()
      .startOf("month")
      .format("YYYY-MM-DD");
    let endTime = this.$moment().format("YYYY-MM-DD");
    this.daterange = [startTime, endTime];
    this.getListData();
  },
  methods: {
    routerLink() {
      //alert(this.$route.query.row.id);
      this.$router.push({
        path: "/realTimeMonitoring/operationChart",
        query: { id: this.$route.query.id }
      });
    },
    //条件查询
    handleSearch() {
      this.pageIndex = 1;
      this.getListData();
    },
    //获取列表
    getListData() {
      selectCraneData(this.params).then(res => {
        this.listData = res.data.list;
        this.pageTotal = Number(res.data.total);
        if (this.pageTotal == 0 && this.pageIndex > 1) {
          this.pageIndex--;
          this.getListData();
        }
      });
    },
    //改变页面显示条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.getListData();
    },
    //改变页数
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.getListData();
    },
    //勾选复选框时给sels赋值
    listSelectionChange(sels) {
      this.sels = sels;
    },

    //日期格式化
    getDate: function(row) {
      return moment(row.deviceTime).format("YYYY-MM-DD HH:mm:ss");
    },
    //状态格式化
    getStatus: function(row) {
      if (row.status == 0) {
        return "未受控";
      } else if (row.status == 1) {
        return "受控";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
