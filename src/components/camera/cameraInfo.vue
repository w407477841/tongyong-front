<template>
  <section>
    <el-row>
      <el-col :span="24" class="toolbar" style="padding-buttom : 0px">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="addClick"
          :disabled="edit"
        >新增</el-button>
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="edit || selsdetails.length==0"
          @click="delClick"
        >批量删除</el-button>
      </el-col>
    </el-row>
    <el-table
      size="small"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      class="tb-edit"
      highlight-current-row
      @selection-change="selectionChange"
      :row-class-name="tableRowClassName"
    >
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column type="index" width="40"></el-table-column>
      <el-table-column label="类型">
        <template slot-scope="scope">
          <el-select v-model="scope.row.platformType" placeholder="请选择" :disabled="edit">
            <el-option
              v-for="item in units"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="IP地址">
        <template slot-scope="scope">
          <el-input v-model="scope.row.ipAddress" :disabled="edit" @change="formatterIp(scope.row)"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="端口号">
        <template slot-scope="scope">
          <el-input v-model="scope.row.port" :disabled="edit" @change="formatterPort(scope.row)"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="用户名">
        <template slot-scope="scope">
          <el-input v-model="scope.row.loginName" :disabled="edit" :maxlength="20"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="密码">
        <template slot-scope="scope">
          <el-input v-model="scope.row.password" :disabled="edit" :maxlength="20"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="区域">
        <template slot-scope="scope">
          <el-select v-model="scope.row.area" placeholder="请选择" :disabled="edit">
            <el-option label="生产区" :value="1"></el-option>
            <el-option label="生活区" :value="2"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="通道">
        <template slot-scope="scope">
          <el-input-number
            :precision="0"
            :max="999999999"
            v-model="scope.row.tunnel"
            :controls="false"
            :disabled="edit"
          ></el-input-number>
        </template>
      </el-table-column>
      <el-table-column label="appkey">
        <template slot-scope="scope">
          <el-input v-model="scope.row.appkey" :disabled="edit" :maxlength="40"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="secret">
        <template slot-scope="scope">
          <el-input v-model="scope.row.secret" :disabled="edit" :maxlength="40"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="HTTP地址(逗号分隔)">
        <template slot-scope="scope">
          <el-input v-model="scope.row.httpAddress" :disabled="edit" :maxlength="3000"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="备注">
        <template slot-scope="scope">
          <el-input v-model="scope.row.comments" :disabled="edit" :maxlength="200"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" align="center" fixed="right">
        <template slot-scope="scope">
          <!-- <el-button type="primary" size="mini" :disabled="edit || selsdetails.length==0" @click="lookClick">查看</el-button> -->
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            :disabled="edit"
            @click="delClickOne(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>

<script>
import { validateIp, validatePort } from "@/utils/validate.js";
export default {
  data() {
    return {
      selsdetails: [],
      units: [
        {
          value: 1,
          label: "海康web平台"
        },
        {
          value: 2,
          label: "海康8700平台"
        },
        {
          value: 3,
          label: "大华"
        },
        {
          value: 4,
          label: "萤石云"
        }
        ,
        {
          value: 5,
          label: "乐橙"
        }
      ],
      addObj: {
        port: "",
        ipAddress: "",
        platformType: null,
        loginName: "",
        password: "",
        tunnel: "",
        httpAddress:"",
        comments: ""
      }
    };
  },
  props: {
    listData: {
      type: Array,
      default: function() {
        return [];
      }
    },
    edit: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  computed: {
    tableData() {
      let list = this.listData;

      return list;
    }
  },
  methods: {
    //地址验证
    formatterIp(row) {
      if (row.ipAddress == "") {
        return;
      } else if (!validateIp(row.ipAddress)) {
        this.$message({ type: "error", message: "请输入正确的IP地址" });
        row.ipAddress = "";
      }
    },
    //端口验证
    formatterPort(row) {
      if (row.port == "") {
        return;
      } else if (!validatePort(row.port)) {
        this.$message({ type: "error", message: "请输入正确端口号(0~65535)" });
        row.port = "";
      }
    },
    //行数
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex;
    },
    //选中的记录
    selectionChange(selection) {
      this.selsdetails = selection;
    },
    //新增
    addClick() {
      let data = this.listData;
      let addObj = Object.assign({}, this.addObj);
      if (data.length == 0) {
        this.$set(this.listData, 0, addObj);
      } else {
        for (let i = data.length; i > 0; i--) {
          this.$set(this.listData, i, this.listData[i - 1]);
          if (i == 1) {
            this.$set(this.listData, 0, addObj);
          }
        }
      }
    },
    //单条删除
    delClickOne(row) {
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      }).then(res => {
        this.listData.splice(row.index, 1);
      });
    },
    //删除
    delClick() {
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      }).then(res => {
        var ids = this.selsdetails.map(item1 => item1.index).toString();
        var sp = ids.split(",");
        var tab = this.listData;
        if (ids != "") {
          for (var i = 0; i < sp.length; i++) {
            tab.forEach((item2, index) => {
              if (item2.index == sp[i]) {
                this.listData.splice(index, 1);
              }
            });
          }
        }
      });
    }
  }
};
</script>

<style  scoped>
.el-input-number {
  width: 100%;
}
</style>
