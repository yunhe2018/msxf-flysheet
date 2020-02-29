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
                <el-form-item size="small" label="安装位置" prop="deviceAddress">
                  <el-input v-model.trim="form.deviceAddress" class="w_305" clearable></el-input>
                </el-form-item>
                <el-form-item size="small" label="设备类型" prop="deviceType">
                  <el-select class="w_305" size="small" v-model="form.deviceType" @change="typeChange">
                    <el-option v-for="item in this.deviceTpyeOptions" :key="item.dictCode" :value="item.dictCode" :label="item.dictName"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item size="small" label="设备型号" prop="deviceNorms">
                  <el-select class="w_305" size="small" v-model="form.deviceNorms" clearable>
                    <el-option v-for="item in this.deviceAmount" :key="item.dictCode" :value="item.dictCode" :label="item.dictName"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item size="small" label="设备唯一码" prop="deviceCode" v-if="form.deviceType === 'deviceType:2'">
                  <el-input v-model.trim="form.deviceCode" class="w_305" clearable></el-input>
                </el-form-item>
                <el-form-item size="small" label="视频流地址" prop="videoIp" v-if="form.deviceType === 'deviceType:1'">
                  <el-input v-model.trim="form.videoIp" class="w_305" clearable></el-input>
                </el-form-item>
                <el-form-item size="small" label="设备IP地址" prop="deviceIp" >
                  <el-input v-model.trim="form.deviceIp" class="w_305" clearable></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="comment">
                    <el-input type="textarea" v-model.trim="form.comment" class="w_305" maxlength="200" showLeave-word-limit></el-input>
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
import { getSysDictByParentCode, addDevice, deviceDetail, updateDevice } from '@/axios/api.js'
export default {
  data () {
    return {
      visible: false,
      form: {
        id: '',
        deviceAddress: '',
        deviceType: '', // 设备类型
        deviceNorms: '', // 设备型号
        deviceCode: '', // 设备唯一码
        videoIp: '', // 视频流地址
        deviceIp: '', // 设备IP地址
        content: ''
      },
      title: '新增/编辑',
      rules: {
        deviceAddress: [{ required: true, message: '请输入安装位置', trigger: 'blur' },
          { min: 2, max: 50, message: '安装位置为2-50个字符', trigger: 'blur' }],
        deviceType: { required: true, message: '请选择设备类型！', trigger: 'change' },
        deviceNorms: { required: true, message: '请选择设备型号！', trigger: 'change' },
        deviceCode: [{ required: true, message: '请输入设备唯一码！', trigger: 'blur' },
          { min: 2, max: 30, message: '唯一码长度为2-30个字符', trigger: 'blur' }
        ],
        video: [{ required: true, message: '请输入视频流地址！', trigger: 'blur' },
          { min: 2, max: 30, message: '请输入正确的rtsp视频流地址', trigger: 'blur' }
        ],
        deviceIp: { required: true, message: '请输入设备IP地址！', trigger: 'blur' },
        comment: { min: 2, max: 100, message: '备注长度为2-100个字符', trigger: 'blur' }
      },
      deviceTpyeOptions: [],
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
      // console.log(this.form.id)
      deviceDetail(getFormData({id: this.form.id})).then(res => {
        if (res.data.success) {
          this.form = res.data.value
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
          updateDevice(filterObjNull(this.form)).then(res => {
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
          addDevice(filterObjNull(this.form)).then(res => {
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
        }
      })
    },
    getSysDictByParentCode () {
      getSysDictByParentCode(getFormData({
        parentCode: 'deviceType'
      })).then(res => {
        if (res.data.success) {
          if (res.data.value) {
            this.deviceTpyeOptions = res.data.value
          } else {
            this.deviceTpyeOptions = []
          }
        } else {
          this.deviceTpyeOptions = []
          this.failMessage(res.data.message)
        }
      }).catch(res => {
        this.failMessage(res && res.data && res.data.message)
      })
    },
    typeChange () {
      getSysDictByParentCode(getFormData({
        parentCode: this.form.deviceType
      })).then(res => {
        if (res.data.success) {
          if (res.data.value) {
            this.deviceAmount = res.data.value
          } else {
            this.deviceAmount = []
          }
        } else {
          this.deviceAmount = []
          this.failMessage(res.data.message)
        }
      }).catch(res => {
        this.failMessage(res && res.data && res.data.message)
      })
    },
    handleClose () {
      this.$refs['ruleForm'].clearValidate()
      this.form = {
        id: '',
        deviceAddress: '',
        deviceType: '', // 设备类型
        deviceNorms: '', // 设备型号
        deviceCode: '', // 设备唯一码
        videoIp: '', // 视频流地址
        content: ''
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
    this.getSysDictByParentCode()
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
