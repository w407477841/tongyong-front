<!--
 * @Description: 充值
 * @Author: pangyu
 * @Date: 2019-06-17 17:46:19
 * @LastEditors: pangyu
 * @LastEditTime: 2019-07-03 11:32:01
 -->

<template>
  <div class="app-container list-container">
    <div class="container-box list-box">
      <el-tabs class="rechargeTab" v-model="activeName" @tab-click="getActive">
        <el-tab-pane class="rechargePane" label="充值" name="first">
          <div class="recharge-form">
            <div class="form">
              <div class="form-content">
                <div class="form-item">
                  <div class="title">SIM卡</div>
                  <div class="content">
                    <div class="sim">
                      <div class="input">
                        <el-input
                          class="input-new-tag"
                          v-if="inputVisible"
                          v-model="inputValue"
                          ref="saveTagInput"
                          size="small"
                          @keyup.enter.native="handleInputConfirm"
                          @blur="handleInputConfirm"
                        ></el-input>
                        <el-button
                          v-else
                          class="button-new-tag"
                          size="small"
                          @click="showInput"
                        >添加SIM卡</el-button>
                        <template v-for="tag in deviceList">
                          <el-tag
                            class="recharge-tag"
                            v-if="tag.active"
                            @close="addSim(tag.gprs)"
                            :key="tag.craneNo"
                            closable
                            type="success"
                          >{{tag.craneNo}}</el-tag>
                        </template>
                      </div>
                      <div class="btn">
                        <el-button @click="show=show?false:true" type="success">选择充值塔吊</el-button>
                      </div>
                    </div>
                    <div class="num">
                      已选择
                      <span>{{num}}</span>台设备
                    </div>
                    <div class="device-group" v-if="show">
                      <template v-for="item in deviceList">
                        <div
                          :class="['device',item.active?'active':'']"
                          @click="addSim(item.gprs)"
                          :key="item.craneNo"
                        >
                          <div class="craneNo">塔机编号：{{item.craneNo}}</div>
                          <div class="gprs">SIM：{{item.gprs}}</div>
                        </div>
                      </template>
                    </div>
                  </div>
                </div>
                <div class="form-item">
                  <div class="title">充值金额</div>
                  <div class="content">
                    <div class="btn-group">
                      <div :class="['btn',time==1?'active':'']" @click="timeChange(1)">一个月</div>
                      <div :class="['btn',time==2?'active':'']" @click="timeChange(2)">两个月</div>
                      <div :class="['btn',time==3?'active':'']" @click="timeChange(3)">一个季度</div>
                      <div :class="['btn',time==6?'active':'']" @click="timeChange(6)">半年</div>
                      <div :class="['btn',time==12?'active':'']" @click="timeChange(12)">一年</div>
                    </div>
                  </div>
                </div>
                <div class="form-item">
                  <div class="title">应付金额</div>
                  <div class="content">
                    <div class="money">{{total}}元</div>
                  </div>
                </div>
                <div class="form-item">
                  <div class="title"></div>
                  <div class="content">
                    <el-button
                      class="payBtn"
                      type="warning"
                      :disabled="total==0"
                      @click="paySum"
                    >立即充值</el-button>
                  </div>
                </div>
              </div>
            </div>
            <div class="help">
              <h4>充值帮助</h4>
              <div class="content">
                <ul>
                  <li>在线充值服务是星云公司为客户提供的代充值服务，客户打款到星云公司账户上后，将在1个工作日内完成充值。</li>
                  <li>付款成功后，请妥善保管好打款凭证。</li>
                  <li>
                    <div>星云充值客服</div>
                    <div>
                      0513-80702305
                      <br />0513-80702306
                    </div>
                  </li>
                  <li>
                    <div>充值流程</div>
                    <div class="process">
                      <br />选择/输入SIM号码
                      <br />↓
                      <br />确认充值清单
                      <br />↓
                      <br />付款至星云支付宝
                      <br />↓
                      <br />1个工作日内完成充值
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane class="rechargePane" label="已充值列表" name="second">
          <div class="recharge-table">
            <el-form :inline="true" class="condition-form" size="mini">
              <el-form-item>
                <el-input v-model="keyWord" clearable placeholder="塔机/黑匣子编号/SIM"></el-input>
              </el-form-item>
              <el-form-item>
                <el-select v-model="status" filterable clearable placeholder="受理状态">
                  <el-option label="已受理" value="1"></el-option>
                  <el-option label="未受理" value="0"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button
                  class="searchBtn"
                  type="primary"
                  icon="el-icon-search"
                  @click="handleSearch"
                >查询</el-button>
              </el-form-item>
            </el-form>
            <div class="table-box">
              <el-table
                size="small"
                :data="listData"
                style="width: 100%"
                height="100%"
                highlight-current-row
                header-row-class-name="xyTableHeader"
              >
                <el-table-column type="index" :width="indexWidth"></el-table-column>

                <el-table-column
                  label="工程名称"
                  prop="projectName"
                  min-width="150"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column label="塔机编号" prop="craneNo" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column
                  label="黑匣子编号"
                  prop="deviceNo"
                  min-width="100"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column label="SIM卡号" prop="gprs" min-width="150" show-overflow-tooltip></el-table-column>

                <!-- <el-table-column label="施工单位" prop="builderName"></el-table-column> -->
                <el-table-column
                  :cell-class-name="acceptClass"
                  label="受理状态"
                  prop="status"
                  :formatter="formstatus"
                ></el-table-column>
                <el-table-column
                  cell-class-name="rechargeClass"
                  label="充值状态"
                  prop="rechargeStatus"
                  :formatter="formCharge"
                ></el-table-column>
                <el-table-column
                  label="操作"
                  width="100"
                  align="center"
                  fixed="right"
                  v-if="validateOperation('update')"
                >
                  <template slot-scope="scope">
                    <el-button
                      type="primary"
                      plain
                      size="small"
                      @click="updateSim(scope.row)"
                      :disabled="scope.row.status==1"
                    >受理</el-button>
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
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import {
  getCraneList,
  createOrder,
  getchargeList,
  updateStatus,
  getReturnUrl
} from "@/views/api/dustHome.js";
import { setTimeout, clearTimeout } from "timers";
export default {
  name: "recharge",
  data() {
    return {
      operationPrex: "recharge",
      keyWord: "",
      status: "",
      inputVisible: false,
      inputValue: "",
      activeName: "first",
      time: 3,
      deviceList: [],
      num: 0,
      price: 20,
      show: false,
      //已充值
      listData: [],
      pageIndex: 1,
      pageSizes: [10, 20, 30],
      pageSize: 10,
      pageTotal: 0,
      devices: [],
      msg_data: [],
      timer: null,
      isShow: false
    };
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  computed: {
    params() {
      let param = {
        flag: this.isShow,
        key: this.keyWord,
        status: this.status,
        pageNum: this.pageIndex,
        pageSize: this.pageSize
      };
      return param;
    },
    total() {
      return this.price * this.num * this.time;
    }
  },
  mounted() {
    this.isShow = this.validateOperation("update");
    this.getDeivce();
  },
  methods: {
    //显示输入框
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    //匹配输入内容
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        //匹配输入SIM卡
        let success = false;
        let num = 0;
        this.deviceList.forEach(item => {
          if (item.gprs == inputValue) {
            item.active = true;
            success = true;
          }
          if (item.active) {
            num++;
          }
        });
        this.num = num;
        if (success) {
          this.$message({ type: "success", message: "添加SIM卡号成功！" });
        } else {
          this.$message({ type: "error", message: "无此SIM卡号！" });
          return;
        }
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    getActive() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      if (this.activeName == "second") {
        this.getListData();
      }
    },
    formstatus(row) {
      if (row.status == 1) {
        return "已受理";
      } else {
        return "未受理";
      }
    },
    formCharge(row) {
      if (row.chargeTime == 1) {
        return "已充值一个月";
      } else if (row.chargeTime == 2) {
        return "已充值两个月";
      } else if (row.chargeTime == 3) {
        return "已充值一个季度";
      } else if (row.chargeTime == 6) {
        return "已充值半年";
      } else if (row.chargeTime == 12) {
        return "已充值一年";
      }
    },
    handleSearch() {
      this.pageIndex = 1;
      this.getListData();
    },
    getListData() {
      console.log("调用此", this.params);
      getchargeList(this.params).then(res => {
        this.listData = res.data.list;
        this.pageTotal = res.data.total;
        if (this.pageTotal == res.data.total) {
          if (this.pageIndex == 1) {
            this.timer = setTimeout(() => {
              if (this.pageIndex == 1) {
                this.getListData();
              }
            }, 15000);
          }
        } else {
          if (this.pageTotal != 0) {
            if (this.timer) {
              clearTimeout(this.timer);
            }
          }
        }
      });
    },
    getDeivce() {
      getCraneList({}).then(data => {
        this.deviceList = (data.data.deviceList || []).map(item => {
          return {
            projectId: item.projectId,
            projectName: item.projectName,
            craneNo: item.craneNo,
            deviceNo: item.deviceNo,
            gprs: item.gprs,
            active: false
          };
        });
      });
    },
    addSim(gprs) {
      let num = 0;
      this.devices = [];
      this.deviceList.forEach(item => {
        if (item.gprs == gprs) {
          item.active = item.active ? false : true;
        }
        if (item.active) {
          num++;
        }
      });
      this.num = num;
    },
    timeChange(time) {
      this.time = time;
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
    acceptClass(row, column, rowIndex, columnIndex) {
      console.log(row, column, rowIndex, columnIndex);
      return "";
    },
    updateSim(row) {
      console.log("处理当前值", row);
      updateStatus({ id: row.id }).then(res => {
        this.getListData();
      });
    },
    paySum() {
      this.devices = [];
      this.deviceList.forEach(item => {
        if (item.active) {
          this.devices.push({
            deviceNo: item.deviceNo,
            craneNo: item.craneNo,
            gprs: item.gprs,
            projectId: item.projectId,
            projectName: item.projectName
          });
        }
      });
      var param = {
        body: {
          chargeTime: this.time,
          chargeMoney: this.total,
          price: this.price,
          devices: this.devices
        }
      };
      createOrder(param).then(res => {
        console.log(res.data);
        let newWindo = window.open("", "_blank");
        let div = newWindo.document.createElement("divform");
        debugger;
        div.innerHTML = res.data;
        console.log(div);
        newWindo.document.body.appendChild(div);
        newWindo.document.forms[0].acceptCharset = "UTF-8"; //保持与支付宝默认编码格式一致，如果不一致将会出现：调试错误，请回到请求来源地，重新发起请求，错误代码 invalid-signature 错误原因: 验签出错，建议检查签名字符串或签名私钥与应用公钥是否匹配
        newWindo.document.forms[0].submit();
      });
      this.activeName = "second";
    }
  }
};
</script>

<style lang="scss">
.rechargeTab {
  height: 100%;
  display: flex;
  flex-direction: column;
  user-select: none;
  .el-tabs__content {
    height: 100%;
  }
  .rechargePane {
    height: 100%;
  }
  .recharge-form {
    height: 100%;
    display: flex;
    .form {
      flex: 1;
      border: 1px solid #9e9e9e;
      padding: 20px;
      .form-content {
        .form-item {
          display: flex;
          margin-bottom: 20px;
          .title {
            width: 90px;
            font-size: 18px;
            line-height: 40px;
          }
          .content {
            flex: 1;
          }
        }
      }
      .sim {
        display: flex;
        .input {
          width: 440px;
          height: 40px;
          padding: 3px 6px;
          border: 1px solid #a1a1a1;
          overflow-x: hidden;
          overflow-y: hidden;
        }
        .recharge-tag {
          margin-right: 5px;
        }
        .btn {
          margin-left: 15px;
        }
      }
      .num {
        font-size: 14px;
        color: #a1a1a1;
        padding: 5px 0;
        span {
          color: #69abca;
          padding: 0 5px;
        }
      }
      .device-group {
        display: flex;
        font-size: 12px;
        flex-wrap: wrap;
        .device {
          width: 187px;
          padding: 7px 6px 5px;
          border: 1px solid #a1a1a1;
          cursor: pointer;
          margin-top: 10px;
          margin-right: 10px;
          &.active {
            color: #00c42c;
            border-color: #00c42c;
          }
        }
      }
      .btn-group {
        display: flex;
        .btn {
          width: 80px;
          height: 40px;
          line-height: 40px;
          text-align: center;
          color: #050505;
          border: 1px solid #a1a1a1;
          cursor: pointer;
          margin-right: 10px;
          &.active {
            color: #fc9a37;
            border-color: #fc9a37;
          }
        }
      }
      .money {
        font-size: 20px;
        font-weight: bold;
        line-height: 40px;
        color: #fc9a37;
      }
      .payBtn {
        width: 150px;
        background-color: #fc9a37;
        border-color: #fc9a37;
        &.is-disabled {
          background-color: #f3d19e;
          border-color: #f3d19e;
        }
      }
    }
    .help {
      width: 280px;
      border: 1px solid #9e9e9e;
      margin-left: 10px;
      h4 {
        height: 50px;
        line-height: 50px;
        padding: 0 10px;
        margin: 0;
        background-color: #f6f6f6;
        border-bottom: 1px solid #9c9c9c;
      }
      .content {
        padding: 10px;
        li {
          padding: 0 10px;
          position: relative;
          margin-bottom: 15px;
          &::before {
            content: " ";
            width: 6px;
            height: 6px;
            border-radius: 100%;
            background-color: #080808;
            position: absolute;
            left: 0px;
            top: 5px;
          }
        }
        .process {
          font-size: 14px;
          color: #aaa;
        }
      }
    }
  }
  .recharge-table {
    height: 100%;
    display: flex;
    flex-direction: column;
    .rechargeClass {
      color: #09cc49;
    }
    .gary {
      color: #999999;
    }
    .red {
      color: #da2127;
    }
  }
}
</style>
