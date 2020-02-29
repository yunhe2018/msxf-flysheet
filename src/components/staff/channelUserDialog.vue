<template>
  <div class="dialogDiv">
    <el-dialog
        :title="title"
        :visible.sync="visible"
        @close="$emit('update:show', false)"
        :close-on-click-modal=false
        :before-close="handleClose"
        width="560px"
        :show="show">
          <div style="height:380px;" class="dialogAndScrollbar">
              <el-scrollbar style="height:100%;" ref="myScrollbar">
              <el-form :model="form" :rules="rules" ref="ruleForm" label-width="110px" class="demo-ruleForm">
                <el-form-item size="small" label="渠道经纪人" prop="userName">
                  <el-input v-model.trim="form.userName" class="w_305" clearable></el-input>
                </el-form-item>
                <el-form-item size="small" label="渠道手机号" prop="phone">
                  <el-input v-model.trim="form.phone" class="w_305" clearable></el-input>
                </el-form-item>
                <el-form-item size="small" label="渠道选择" prop="type">
                  <el-select class="w_305" size="small" v-model="form.type" clearable>
                    <el-option v-for="item in this.typeOptions" :key="item.dictCode" :value="item.dictCode" :label="item.dictName"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item size="small" label="入职时间" prop="entryTime">
                  <el-date-picker v-model="form.entryTime" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width:300px"></el-date-picker>
                </el-form-item>
                <el-form-item size="small" label="在职状态" prop="status">
                  <el-select class="w_305" size="small" v-model="form.status" clearable>
                    <el-option v-for="item in this.statusOptions" :key="item.code" :value="item.code" :label="item.name"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </el-scrollbar>
          </div>
          <span slot="footer" class="dialog-footer">
             <el-button size="small" class="editBtn" @click="submitForm('ruleForm')" :disabled="this.subdisabled">提交</el-button>
          </span>
        </el-dialog>
  </div>
</template>

<script>
import { getFormData, filterObjNull } from '@/util/util'
import { getSysDictByParentCode, addChannelUser, ChannelUserDetail, updateChannelUser } from '@/axios/api.js'
export default {
  data () {
    return {
      visible: false,
      form: {
        userName: '',
        type: '',
        phone: '',
        entryTime: '',
        status: ''
      },
      statusOptions: [{name: '在职', code: 1}, {name: '离职', code: 0}],
      typeOptions: [],
      title: '新增/编辑',
      rules: {
        userName: { required: true, message: '请输入渠道经纪人！', trigger: 'change' },
        phone: [{ pattern: /^\d{11}$/, message: '手机格式不正确，请填写11位', trigger: 'blur' }],
        entryTime: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ]
      },
      deviceAmount: []
    }
  },
  methods: {
    showData (cfg) {
      this.visible = true
      if (cfg) {
        this.form.id = cfg.id
        this.getDetail()
      } else {
        this.$nextTick(() => {
          this.$refs['ruleForm'].clearValidate()
        })
      }
    },
    getDetail () {
      ChannelUserDetail(getFormData({id: this.form.id})).then(res => {
        if (res.data.success) {
          this.form = res.data.value
          this.form.entryTime = new Date(res.data.value.entryTime)
        } else {
          this.failDialog(res.data.message)
        }
      })
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid, object) => {
        if (!valid) {
          return false
        }
        this.subdisabled = true
        if (this.form.id) {
          updateChannelUser(filterObjNull(this.form)).then(res => {
            this.sub2false()
            if (res.data.success) {
              this.successMessage(res.data.message)
              this.$emit('undateList')
              this.handleClose()
            } else {
              this.failDialog(res.data.message)
            }
          }).catch(er => {
            this.sub2false()
          })
        } else {
          addChannelUser(filterObjNull(this.form)).then(res => {
            this.sub2false()
            if (res.data.success) {
              this.successMessage(res.data.message)
              this.$emit('undateList')
              this.handleClose()
            } else {
              this.failDialog(res.data.message)
            }
          })
        }
      })
    },
    getType () {
      getSysDictByParentCode(getFormData({
        parentCode: 'channelType'
      })).then(res => {
        if (res.data.success) {
          if (res.data.value) {
            this.typeOptions = res.data.value
          } else {
            this.typeOptions = []
          }
        } else {
          this.typeOptions = []
          this.failMessage(res.data.message)
        }
      }).catch(res => {
        this.failMessage(res && res.data && res.data.message)
      })
    },
    handleClose () {
      this.$refs['ruleForm'].clearValidate()
      this.form = {
        userName: '',
        type: '',
        phone: '',
        entryTime: '',
        status: ''
      }
      this.sub2false()
      this.visible = false
    },
    failDialog (txt) {
      this.$alert(txt || '操作失败！', '提示', {
        confirmButtonText: '确定',
        type: 'error'
      })
    },
    failMessage (txt) {
      txt = txt || '请求失败'
      this.$message({
        message: txt,
        type: 'error'
      })
    },
    successMessage (txt) {
      this.$message({
        message: txt,
        type: 'success'
      })
    },
    sub2false () {
      setTimeout(() => {
        this.subdisabled = false
      }, 300)
    }
  },
  mounted () {
    this.getType()
  }
}
</script>

<style scoped>
  .el-radio{margin-right:15px}
  .avatar-uploader{
    border: 1px solid #EBEEF5 ;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    display: inline-block;
    width:112px;
    height: 112px;
  }
  .avatar-uploader:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #5cb6ff;
    width: 112px;
    margin-top:36px;
    text-align: center;
  }
  .el-icon-picture-outline p{
    color:#C0C4CC;
    font-size:12px
  }
  .avatarWrap{
    position: relative;
  }
  .avatarWrap .deleteImg{
    display: none;
    position: absolute;
    width: 20px;
    height: 20px;
    background: url('../../assets/images/delete.png') no-repeat;
    background-size: 100% 100%;
    right:4px;
    top: 5px;
  }
  .avatarWrap:hover .deleteImg{
    display: block;
  }
  .avatar {
    width: 112px;
    height: 112px;
    display: block;
  }
  .imgUploadTip{
    font-size: 12px;
    line-height: 12px;
    display:inline-block;
    vertical-align: top;
    margin: 0;
    margin-top:17px;
    }
  .imgUploadTip p{
    margin:0;
    color:#909399
  }
  /* .width_400{
    width:305px;
  } */
.row{
  display: flex;
  justify-content: space-between;
  margin-right:20px;
}
.row .col{
  width:50%;
  box-sizing: border-box;
  overflow: hidden;
}
</style>
