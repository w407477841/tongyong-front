<!--
 * @Description: 设备循环工作时长
 * @Author: pangyu
 * @Date: 2019-06-17 17:46:19
 * @LastEditors: pangyu
 * @LastEditTime: 2019-07-17 20:49:19
 -->

<template>
  <div class="app-container list-container">
    <div class="container-box condition-box">
      <div class="conditionBar">
        <el-form :inline="true" class="condition-form" size="mini">
          <el-form-item>
            <el-select v-model="projectId" filterable clearable placeholder="工程名称">
              <el-option
                v-for="item in projectList"
                :label="item.name"
                :value="item.id"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model="keyWord" clearable placeholder="塔机/黑匣子编号"></el-input>
          </el-form-item>
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
            <el-button
              class="searchBtn"
              type="primary"
              icon="el-icon-search"
              @click="handleSearch"
            >查询</el-button>
            <el-button
              class="searchBtn"
              type="primary"
              icon="el-icon-download"
              @click="handleDown"
            >导出</el-button>
          </el-form-item>
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
          <el-table-column label="塔机编号" prop="craneNo" show-overflow-tooltip></el-table-column>
          <el-table-column label="黑匣子编号" prop="deviceNo" min-width="150" show-overflow-tooltip></el-table-column>
          <el-table-column label="工程名称" prop="projectName" min-width="150" show-overflow-tooltip></el-table-column>
          <el-table-column label="吊重次数" prop="liftFrequency">
            <template slot-scope="scope">
              <span class="pointer" @click="routeToWeight(scope.row)">{{scope.row.liftFrequency}}</span>
            </template>
          </el-table-column>
          <el-table-column label="违章次数" prop="weightAlarm">
            <template slot-scope="scope">
              <span class="pointer" @click="routeToProcess(scope.row)">{{scope.row.weightAlarm}}</span>
            </template>
          </el-table-column>
          <el-table-column label="力矩百分比" align="center">
            <el-table-column label="90%以下">
              <template slot-scope="scope">
                <span
                  class="pointer"
                  @click="routeToFilter(scope.row,1)"
                >{{scope.row.percentage0+scope.row.percentage40+scope.row.percentage60+scope.row.percentage80}}</span>
              </template>
            </el-table-column>
            <el-table-column label="90%-110%" prop="percentage90">
              <template slot-scope="scope">
                <span class="pointer" @click="routeToFilter(scope.row,2)">{{scope.row.percentage90}}</span>
              </template>
            </el-table-column>
            <el-table-column label="110%-120%" prop="percentage110" width="90">
              <template slot-scope="scope">
                <span
                  class="pointer"
                  @click="routeToFilter(scope.row,3)"
                >{{scope.row.percentage110}}</span>
              </template>
            </el-table-column>
            <el-table-column label="120%以上" prop="percentage120">
              <template slot-scope="scope">
                <span
                  class="pointer"
                  @click="routeToFilter(scope.row,4)"
                >{{scope.row.percentage120}}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="载荷系数" prop="load" :formatter="toFixedFormat"></el-table-column>
          <el-table-column width="250">
            <template slot="header">
              <div class="promptHeader">
                <span>载荷情况</span>
                <el-popover width="410" trigger="hover">
                  <div class="promptMain">
                    <div class="promptMain">按国标GB13752-2017规定，塔机载荷状态有四钟：</div>
                    <div>
                      <span class="s1">
                        Q
                        <sub>1</sub>
                      </span>
                      <span class="s2">0~0.125</span>
                      <span class="s3">很少吊运额定载荷，经常吊运较轻载荷</span>
                    </div>
                    <div>
                      <span class="s1">
                        Q
                        <sub>2</sub>
                      </span>
                      <span class="s2">0.125~0.250</span>
                      <span class="s3">较少吊运额定载荷，经常吊运中等载荷</span>
                    </div>
                    <div>
                      <span class="s1">
                        Q
                        <sub>3</sub>
                      </span>
                      <span class="s2">0.250~0.500</span>
                      <span class="s3">有时吊运额定载荷，经常吊运较重载荷</span>
                    </div>
                    <div>
                      <span class="s1">
                        Q
                        <sub>4</sub>
                      </span>
                      <span class="s2">0.500~1.000</span>
                      <span class="s3">经常吊运额定载荷</span>
                    </div>
                  </div>
                  <i class="el-icon-tishi" slot="reference"></i>
                </el-popover>
              </div>
            </template>
            <template slot-scope="scope">{{scope.row.$load}}</template>
          </el-table-column>
          <el-table-column width="110">
            <template slot="header">
              <div class="promptHeader">
                <span>使用等级</span>
                <el-popover width="320" trigger="hover">
                  <div class="promptMain">
                    <div class="promptMain">按塔机使用寿命20年计算，按国标GB13752-2017规定，塔机使用情况有五钟：</div>
                    <div>
                      <span class="s1">
                        U
                        <sub>1</sub>
                      </span>
                      <span class="s2">
                        1.60 × 10
                        <sup>4</sup>~3.20 × 10
                        <sup>4</sup>
                      </span>
                      <span class="s3">很少使用</span>
                    </div>
                    <div>
                      <span class="s1">
                        U
                        <sub>2</sub>
                      </span>
                      <span class="s2">
                        3.20 × 10
                        <sup>4</sup>~6.30 × 10
                        <sup>4</sup>
                      </span>
                      <span class="s3">很少使用</span>
                    </div>
                    <div>
                      <span class="s1">
                        U
                        <sub>3</sub>
                      </span>
                      <span class="s2">
                        6.30 × 10
                        <sup>4</sup>~1.25 × 10
                        <sup>5</sup>
                      </span>
                      <span class="s3">很少使用</span>
                    </div>
                    <div>
                      <span class="s1">
                        U
                        <sub>4</sub>
                      </span>
                      <span class="s2">
                        1.25 × 10
                        <sup>5</sup>~2.50 × 10
                        <sup>5</sup>
                      </span>
                      <span class="s3">不频繁使用</span>
                    </div>
                    <div>
                      <span class="s1">
                        U
                        <sub>5</sub>
                      </span>
                      <span class="s2">
                        2.50 × 10
                        <sup>5</sup>~5.00 × 10
                        <sup>5</sup>
                      </span>
                      <span class="s3">中等频繁使用</span>
                    </div>
                  </div>
                  <i class="el-icon-tishi" slot="reference"></i>
                </el-popover>
              </div>
            </template>
            <template slot-scope="scope">{{scope.row.$level}}</template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="220" align="center">
            <template slot-scope="scope">
              <el-button
                type="primary"
                plain
                size="small"
                icon="el-icon-search"
                @click="handleView(scope.row)"
              >查看</el-button>
              <el-button
                type="primary"
                plain
                size="small"
                icon="el-icon-download"
                @click="reportPdf(scope.row)"
              >导出pdf</el-button>
            </template>
          </el-table-column>
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
import { getProjectListApi } from "@/views/device/api/crane.js";
import {
  getMomentPercentList,
  createURL,
  reportPDF
} from "@/views/crane/api/craneReport.js";
export default {
  name: "crane-workTime",
  data() {
    return {
      keyWord: "",
      projectId: "",
      projectList: [],
      listData: [],
      pageIndex: 1,
      pageSizes: [10, 20, 30],
      pageSize: 10,
      pageTotal: 0,
      sels: [],
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
  mounted() {
    this.getProjectList();
    let startTime = this.$moment()
      .startOf("month")
      .format("YYYY-MM-DD");
    let endTime = this.$moment().format("YYYY-MM-DD");
    this.daterange = [startTime, endTime];
    this.handleSearch();
  },
  methods: {
    getProjectList() {
      getProjectListApi({}).then(res => {
        this.projectList = res.data;
      });
    },
    handleSearch() {
      this.pageIndex = 1;
      this.getListData();
    },
    routeToProcess(row) {
      let [startTime, endTime] = this.daterange || ["", ""];
      this.$router.push({
        name: "craneProcess",
        params: { deviceNo: row.deviceNo },
        query: {
          craneNo: row.craneNo,
          type: 3,
          startTime: startTime,
          endTime: endTime
        }
      });
    },
    routeToWeight(row) {
      let [startTime, endTime] = this.daterange || ["", ""];
      this.$router.push({
        name: "craneTimeWeight",
        params: { deviceNo: row.deviceNo },
        query: { craneNo: row.craneNo, startTime: startTime, endTime: endTime }
      });
    },
    routeToFilter(row, type) {
      let [startTime, endTime] = this.daterange || ["", ""];
      this.$router.push({
        name: "craneFilter",
        params: { deviceNo: row.deviceNo },
        query: {
          craneNo: row.craneNo,
          type: type,
          startTime: startTime,
          endTime: endTime
        }
      });
    },
    handleDown() {
      let [startTime, endTime] = this.daterange || ["", ""];
      let params = {
        keyWord: this.keyWord,
        projectId: this.projectId,
        startTime: `${startTime}%2000:00:00`,
        endTime: `${endTime}%2023:59:59`
      };
      window.location.href = createURL(
        "/craneData/api/getMomentPercentExcel",
        params
      );
    },
    getListData() {
      let [startTime, endTime] = this.daterange || ["", ""];
      let params = {
        pageSize: this.pageSize,
        pageNum: this.pageIndex,
        startTime: `${startTime} 00:00:00`,
        endTime: `${endTime} 23:59:59`,
        body: {
          keyWord: this.keyWord,
          projectId: this.projectId
        }
      };
      getMomentPercentList(params).then(res => {
        let diff =
          this.$moment(endTime).diff(this.$moment(startTime), "days") + 1;
        this.listData = (res.data.list || []).map(item => {
          item.frequencyMonth = ((item.liftFrequency / diff) * 30).toFixed(2);
          let val = item.frequencyMonth * 12 * 20;
          let $level = "很少使用";
          if (val <= 3.2 * 10000) {
            $level = "很少使用";
          } else if (val <= 6.3 * 10000) {
            $level = "很少使用";
          } else if (val <= 1.25 * 100000) {
            $level = "很少使用";
          } else if (val <= 2.5 * 100000) {
            $level = "不频繁使用";
          } else if (val <= 5 * 100000) {
            $level = "中等频繁使用";
          }
          let $load = "很少吊运额定载荷，经常吊运较轻载荷";
          if (item.load <= 0.125) {
            $load = "很少吊运额定载荷，经常吊运较轻载荷";
          } else if (item.load <= 0.25) {
            $load = "较少吊运额定载荷，经常吊运中等载荷";
          } else if (item.load <= 0.5) {
            $load = "有时吊运额定载荷，经常吊运较重载荷";
          } else if (item.load > 0.5) {
            $load = "经常吊运额定载荷";
          }
          return {
            $level: $level,
            $load: $load,
            ...item
          };
        });
        this.pageTotal = res.data.total;
      });
    },
    handleView(row) {
      let [startTime, endTime] = this.daterange || ["", ""];
      this.$router.push({
        name: "craneTorque",
        params: {
          deviceNo: row.deviceNo
        },
        query: {
          startTime: startTime,
          endTime: endTime
        }
      });
    },

    reportPdf(row) {
      let param = {
        deviceNo: row.deviceNo,
        craneNo: row.craneNo,
        load: row.load,
        liftFrequency: row.liftFrequency,
        startTime: this.daterange[0],
        endTime: this.daterange[1],
        projectId: row.projectId
      };
      // reportPDF(param).then(res=>{

      // })

      window.location.href = createURL("/craneToPdf/report", param);
    },
    //条数变更
    handleSizeChange(val) {
      this.pageSize = val;
      this.getListData();
    },
    //页数变更
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.getListData();
    },
    listSelectionChange(sels) {
      this.sels = sels;
    }
  }
};
</script>