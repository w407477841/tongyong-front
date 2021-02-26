<template>
  <div class="home__overview">
    <div class="home__overview-notice">
      <div class="title">最新公告：</div>
      <div class="content">
        <vueSeamless :data="noticeList" :class-option="classOption" class="seamless-warp">
          <ul>
            <li
              v-for="(item,index) in noticeList"
              :key="index"
              :title="item.content"
            >{{item.content}}</li>
          </ul>
        </vueSeamless>
      </div>
      <router-link tag="div" to="/notice" class="link">查看所有公告>></router-link>
    </div>
    <div class="home__overview-container">
      <div class="home__overview-top">
        <div class="item item1">
          <div class="val">{{topInfo.craneAccount}}</div>
          <div class="title">塔吊（塔）</div>
        </div>
        <div class="item item2">
          <div class="val">{{topInfo.driverAccount}}</div>
          <div class="title">塔吊司机（人）</div>
        </div>
        <div class="item item3">
          <div class="val">{{topInfo.projectAccount}}</div>
          <div class="title">建筑项目（个）</div>
        </div>
      </div>
      <div class="home__overview-mid">
        <el-form :inline="true" class="condition-form" size="small">
          <el-form-item>
            <el-input v-model="keyword" placeholder="备案编号/工程名称/SIM卡号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              class="searchBtn"
              type="primary"
              size="mini"
              icon="el-icon-search"
              @click="handleSearch"
            >搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="home__overview-bottom">
        <div class="table-box">
          <el-table
            size="small"
            :data="listData"
            style="width: 100%"
            height="100%"
            border
            highlight-current-row
            header-row-class-name="xyTableHeader"
          >
            <el-table-column type="index" :width="indexWidth"></el-table-column>
            <el-table-column label="备案编号" prop="identifier" min-width="150" show-overflow-tooltip></el-table-column>
            <el-table-column label="工程名称" prop="projectName" min-width="150" show-overflow-tooltip></el-table-column>
            <el-table-column label="SIM卡号" prop="gprs" min-width="150" show-overflow-tooltip></el-table-column>
            <el-table-column label="运行时长" prop="timeSum" min-width="150" :formatter="timeSumFormat"></el-table-column>
            <el-table-column label="使用频率(次/月)" min-width="120" prop="frequencyMonth"></el-table-column>
            <el-table-column label="违章次数" prop="weightAlarm"></el-table-column>
            <el-table-column label="当前状态" prop="isOnline" :formatter="handleSIsOnline"></el-table-column>
            <el-table-column label="操作" prop="deviceNo" align="center" fixed="right" width="120">
              <template slot-scope="scope">
                <router-link class="pointer" :to="`/realTimeMonitoring?deviceNo=${scope.row.deviceNo}`">使用履历</router-link>
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
    <div class="copyright">Copyright © 2019 江苏鸿鹄电子科技有限公司</div>
  </div>
</template>

<script>
import {
  craneNotice,
  towerIndex,
  billboard
} from "@/views/crane/api/craneReport.js";
import vueSeamless from "vue-seamless-scroll";

export default {
  components: {
    vueSeamless
  },
  data() {
    return {
      keyword: "",
      pageIndex: 1, //
      listData: [],
      pageSizes: [10, 20, 30],
      pageSize: 10,
      pageTotal: 0,
      noticeList: [],
      topInfo: {}
    };
  },
  computed: {
    classOption() {
      return {
        // direction: 0,
        openWatch: true,
        // step: 0.3,
        limitMoveNum: 2,
        singleHeight: 50,
        waitTime: 2500
        // waitTime: 2500
      };
    }
  },
  mounted() {
    this.craneNotice();
    this.handleSearch();
    this.billboard();
  },
  methods: {
    craneNotice() {
      craneNotice({}).then(res => {
        this.noticeList = res.data || [];
      });
    },
    billboard() {
      billboard({}).then(res => {
        this.topInfo = res.data;
      });
    },
    //查询
    handleSearch() {
      this.pageIndex = 1;
      this.getListData();
    },
    //获取数据
    getListData() {
      let params = {
        pageSize: this.pageSize,
        pageNum: this.pageIndex,
        body: {
          param: this.keyword
        }
      };
      towerIndex(params).then(res => {
        this.listData = res.data.list || [];
        this.pageTotal = res.data.total;
      });
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
    timeSumFormat(row, column, cellValue, index) {
      if (cellValue) {
        return `${this.$moment
          .duration(cellValue)
          .days()}天${this.$moment
          .duration(cellValue)
          .hours()}小时${this.$moment.duration(cellValue).minutes()}分钟`;
      } else {
        return "0天0小时0分钟";
      }
    },
    //设备状态
    handleSIsOnline(row) {
      return row.isOnline == 1 ? "在线" : "离线";
    },
  }
};
</script>

<style lang="scss">
.home__overview {
  height: calc(100vh - 84px);
  .home__overview-notice {
    height: 50px;
    display: flex;
    align-items: center;
    padding: 0 15px;
    font-size: 14px;
    .content {
      flex: 1;
      height: 100%;
    }
    .title {
      color: #8a8d9b;
    }
    .link {
      color: #4d83ff;
      cursor: pointer;
    }
    .seamless-warp {
      height: 50px;
      overflow: hidden;
      li {
        line-height: 50px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
  .home__overview-container {
    height: calc(100% - 50px);
    background-color: #fff;
    padding: 15px 15px 40px;
    display: flex;
    flex-direction: column;
  }
  .home__overview-top {
    height: 150px;
    display: flex;
    .item {
      flex: 1;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding-left: 50px;
      color: #fff;
      background-repeat: no-repeat;
      background-position: right 15px bottom;
    }
    .item1 {
      background-color: #4b8aff;
      background-image: url(~@/assets/image/top1.png);
    }
    .item2 {
      margin: 0 10px;
      background-color: #0aabff;
      background-image: url(~@/assets/image/top2.png);
    }
    .item3 {
      background-color: #5a70ff;
      background-image: url(~@/assets/image/top3.png);
    }
    .title {
      font-size: 16px;
      margin-top: 5px;
    }
    .val {
      font-size: 50px;
    }
  }
  .home__overview-mid {
    padding: 20px 0 10px;
    .el-form-item {
      margin: 0;
    }
  }
  .home__overview-bottom {
    flex: 1;
    display: flex;
    flex-direction: column;
    .table-box {
      flex: 1;
    }
    .pagination-box {
      text-align: center;
    }
    .xyTableHeader th {
      background-color: #f5f6fa;
    }
  }
  .copyright {
    position: absolute;
    width: 100%;
    bottom: 0;
    left: 0;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    color: #000;
    text-align: center;
    background-color: #fff;
    z-index: 11;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.25);
  }
}
</style>
