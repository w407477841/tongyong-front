<template>
    <div class="details-container">
        <div class="container-box details-box">
            <div class="details-body">
                <el-tabs type="border-card" style="height:100%">
                    <el-tab-pane label="批量导入">
               <el-form :inline="true" class="condition-form">
                            <el-row> 
                                    <el-col :xs="24" :sm="24" :md="24" class="itemHeight">
                                         <el-button size="mini" type="primary" >选择文件</el-button>
                                        <input class="filess" ref="filess" style="opacity:0;position:absolute;left:0;" type="file" id="excel-file" @change="fileChange">
                                        
                                    </el-col>
                                    <el-col :xs="24" :sm="24" :md="24" class="itemHeight">
                                       <el-tag v-for="tag in cards" :key="tag.cardNo" closable :disable-transitions="false"
                                                      @close="handleClose(tag)"  style="display: inline-block; margin-right: 10px;">
                                                      {{tag.cardNo}}
                                       </el-tag>
                                    </el-col>
                            </el-row>
        </el-form>
                     </el-tab-pane>
                </el-tabs>
            </div>

            <div class="details-footer">
              <el-button size="small" @click="handleCancel">取 消</el-button>
              <el-button size="small"  type="primary" @click="handleSubmit">保 存</el-button>
            </div>
        </div>
    </div>
</template>

<script>

import {batchInsertBasicCard} from './api.js';
import {validatePhone,validateCard,validateName} from '@/utils/validate.js'

export default {
  components: {
  },
  data() {
    let checkCardNo = (rule,value,callback) => {
      if(value.length > 10) {
        return callback(new Error("请输入正确的卡号"));
      }else {
        return callback();
      }
    };
    return {
      cards: [
         
         
        ],
      labelWidth : '150px',
      statusSelect : [{"name" : "未绑定", "id" : 0}, {"name" : "已绑定", "id" : 1} ],
     
    };
  },
  computed: {
    params() {
      let param = {
        body: this.formDatas
      };
      return param;
    }
  },
  mounted() {
    if (
      this.openType == 'view' ||
      this.openType == 'update'
    ) {
      //this.getInfo();
    }
    
  },
  methods: {
change_btn_click(){

},
    //打开页面时根据id查询数据给表单
    getInfo() {
      let param = {
        id: this.id
      };
      getBasicCardById(param).then(res => {
        this.formDatas = res.data;
      });
    },
    //保存
    handleSubmit() {

       
          this.$confirm('确认保存吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let method;
          
              method = batchInsertBasicCard({body:this.cards});
      
            method.then((res) => {
              if(res.code == 200) {
                this.$message({
                  type : 'success',
                  message : res.message
                });
                this.$emit('setShow',{});
              }else {
                this.$message({
                  type : 'error',
                  message : res.message
                });
              }
            });
          });
   
     
    },
    //取消
    handleCancel : function() {
                 
      let  msg = "是否确认取消？";
      
      if (this.openType == "view") {
        this.$emit('setShow',{});
        return;
      }
      this.$confirm(msg, "提示", {type: "warning"}).then(() => {
        this.$emit('setShow',{});
      });
    },
    //关闭
    handleClose:function(tag){
      
        this.cards.splice(this.cards.indexOf(tag), 1);
    },
    // 文件
    fileChange : function(e) {
    
      var _this = this;
      var files = e.target.files;
      var fileReader = new FileReader();
      fileReader.onload = function(ev) {
        try {
          var data = ev.target.result
          var workbook = XLSX.read(data, {
            type: 'binary'
          }) // 以二进制流方式读取得到整份excel表格对象
          var fileList = []; // 存储获取到的数据
        } catch (e) {
          _this.$message({
            type : 'error',
            message : "文件类型不正确"
          });
          return;
        }
        // 表格的表格范围，可用于判断表头是否数量是否正确
        var fromTo = '';
        // 遍历每张表读取
        for (var sheet in workbook.Sheets) {
          if (workbook.Sheets.hasOwnProperty(sheet)) {
            fromTo = workbook.Sheets[sheet]['!ref'];
            fileList = fileList.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
            break; // 如果只取第一张表，就取消注释这行
          }
        }
        //在控制台打印出来表格中的数据
        for(let i = 0;i < fileList.length;i++) {
          let data = {
            "cardNo":"","status":0
          };
         
          for(var key in fileList[i]) {
            if(key == '卡号') {
              data.cardNo = fileList[i][key];
            }
            _this.$set(_this.cards,i,data);
          }
        }
        _this.uploadVisible = false;
      };
      // 以二进制方式打开文件
      fileReader.readAsBinaryString(files[0]);
    },
  },
  props : ['edit','openType','id']
};
</script>
<style lang="scss" scoped>
  .itemHeight {
    height : 50px
  }
  .change_btn{
    padding:5px 10px;
    color:#666;
  }

</style>
