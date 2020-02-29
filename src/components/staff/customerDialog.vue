<template>
  <div class="dialogDiv">
    <template v-if="photoShow">
        <el-dialog
        title="照片规范"
        :close-on-click-modal=false
        :visible.sync="photoShow">
          <img src="@/assets/images/photoRule.png" width="100%"/>
      </el-dialog>
    </template>
    <template>
      <el-dialog
        :title="title"
        width="700px"
        :close-on-click-modal=false
        :visible.sync="visible"
        :before-close="handleClose">
        <div style="height:340px;" class="dialogAndScrollbar">
          <el-scrollbar style="height:100%;" ref="myScrollbar">
          <el-form :model="form" :rules="rules" ref="ruleForm" label-width="80px" class="margin-space">
            <div class="row">
              <div class="col">
                <el-form-item label="客户姓名" prop="userName">
                  <el-input size="small" v-model.trim="form.userName" clearable class="w_210"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                  <el-input size="small" v-model.trim="form.phone" clearable class="w_210"></el-input>
                </el-form-item>
                <el-form-item label="身份证" prop="idCard">
                  <el-input size="small" v-model.trim="form.idCard" clearable class="w_210"></el-input>
                </el-form-item>
                <el-form-item label="渠道经纪人" prop="channelId">
                  <el-select size="small" v-model="form.channelId" clearable class="w_210">
                    <el-option v-for="item in channelIdOptions" :key="item.channelId" :value="item.channelId" :label="item.userName"></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="col">
                <el-form-item label="照片" prop="headImg" class="pictureBox">
                  <el-upload
                    class="avatar-uploader"
                    ref="upload1"
                    :show-file-list="false"
                    :before-upload="beforeAvatarUpload"
                    :http-request="uploadSectionFileOne">
                    <div class="avatarWrap" v-if="form.headImg">
                      <img :src="getImgUrl(form.headImg)" class="avatar">
                    </div>
                    <i v-else class="el-icon-picture-outline avatar-uploader-icon"><p>上传照片</p></i>
                  </el-upload>
                  <div class="imgUploadTip mgl-20">
                    <p>
                      支持JPG\JPEG\PNG，4M内
                      <el-link type="primary" @click="showPhotoPop">照片规范</el-link>
                    </p>
                  </div>
                </el-form-item>
              </div>
            </div>
          </el-form>
          </el-scrollbar>
        </div>
        <span slot="footer" class="dialog-footer">
           <el-button size="small" class="editBtn" @click="submitForm('ruleForm')" :disabled="this.subdisabled">提交</el-button>
        </span>
      </el-dialog>
    </template>
  </div>
</template>

<script>
import { getFormData, filterObjNull, getImg } from '@/util/util'
import { imgUpload, getSysDictByParentCode, toAddCustomer, addCustomer, updateCustomer, CustomerDetail } from '@/axios/api.js'
export default {
  components: {
  },
  data () {
    return {
      subdisabled: false,
      visible: false,
      form: {
        id: '',
        userName: '',
        phone: '',
        idCard: '',
        channelId: '', // 渠道经纪人
        headImg: ''
      },
      title: '新增/编辑',
      upload_name: '', // 图片名称,
      channelIdOptions: [],
      photoShow: false,
      rules: {
        headImg: { required: true, message: '图片不能为空', trigger: 'change' },
        userName: [{ required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 30, message: '名称长度为2-30个字符', trigger: 'blur' }],
        phone: [{ pattern: /^\d{11}$/, message: '手机格式不正确，请填写11位', trigger: 'blur' }],
        idCard: [{pattern: /(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '身份证为18位数字/字母/数字字母组合', trigger: 'blur'}]
        // channelId: [{ required: true, message: '请选择', trigger: 'blur' }]
      }
    }
  },
  methods: {
    showData (cfg) {
      this.visible = true
      if (cfg) {
        this.form.id = cfg.id
        this.getDetail()
      } else {
        toAddCustomer().then(res => {
          if (res.data.success) {
            this.channelIdOptions = res.data.value || []
          }
        })
        this.$nextTick(() => {
          this.$refs['ruleForm'].clearValidate()
        })
      }
    },
    getDetail () {
      CustomerDetail(getFormData({id: this.form.id})).then(res => {
        if (res.data.success) {
          this.form = res.data.value.userInfo || {}
          this.form = Object.assign({}, this.form)
          this.channelIdOptions = res.data.value.channelList || []
          this.form.channelId = this.channelIdOptions.filter(i => i.isChoose)[0].channelId
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
          updateCustomer(filterObjNull(this.form)).then(res => {
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
          addCustomer(filterObjNull(this.form)).then(res => {
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
    handleClose () {
      this.$refs['ruleForm'].clearValidate()
      this.form = {
        id: '',
        userName: '',
        phone: '',
        idCard: '',
        channelId: '', // 渠道经纪人
        headImg: ''
      }
      this.sub2false()
      this.visible = false
    },
    beforeAvatarUpload (file) {
      let isLt4M = file.size / 1024 / 1024 < 4
      let isIMAGE = ['image/jpeg', 'image/jpg', 'image/png'].indexOf(file.type) > -1
      if (!isIMAGE) {
        this.$message.error('上传图片格式不对!')
      }
      if (!isLt4M) {
        this.$message({
          message: '上传图片大小不能超过 4MB!',
          type: 'warning'
        })
        self.$refs.upload.uploadFiles = []
      }
      return isIMAGE && isLt4M
    },
    uploadSectionFileOne (params) {
      let self = this
      let file = params.file

      self.upload_url = ''
      self.upload_name = 'file_img[]'
      imgUpload(getFormData({ file: file, type: 'head' })).then(res => {
        if (res.data.success) {
          self.$set(self.form, 'headImg', res.data.value)
          // self.$set(self.form, 'imgId', res.data.value.imgId)
          // this.imgId = res.data.value.imgId
        } else {
          this.failMessage(res.data.message || '上传失败，请重新上传')
          self.$refs.upload1.uploadFiles = []
        }
      }).catch(() => { // 请求失败返回的数据
        this.failMessage('上传失败，请重新上传')
      })
    },
    showPhotoPop (e) {
      this.photoShow = true
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
    getImgUrl (imgData, defaultImg) {
      // if (!imgData) return ''
      // return 'data:image/jpg;base64,' + imgData
      return getImg(imgData, defaultImg)
    },
    sub2false () {
      setTimeout(() => {
        this.subdisabled = false
      }, 300)
    }
  },
  mounted () {
    getSysDictByParentCode(getFormData({parentCode: 'channelId'})).then(res => {
      if (res.data.success) {
        if (res.data.value) {
          this.channelIdOptions = res.data.value || []
        } else {
          this.channelIdOptions = []
        }
      } else {
        this.channelIdOptions = []
        this.failMessage(res.data.message)
      }
    }).catch(res => {
      this.failMessage(res && res.data && res.data.message)
    })
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
