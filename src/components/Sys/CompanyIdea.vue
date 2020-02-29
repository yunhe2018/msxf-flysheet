<template>
  <div style="height: 100%">
    <div class="listBot">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">
         <el-form-item label="照片" prop="logo" class="logoWrap">
          <el-upload
            class="avatar-uploader"
            ref="upload"
            :class="{'avatar-uploader-error': isUploadError}"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            :http-request="uploadSectionFileOne">
            <img v-if="form.logo" :src="getImgUrl(form.logo)" class="avatar">
            <i v-else class="el-icon-picture-outline avatar-uploader-icon"><p>上传照片</p></i>
          </el-upload>
          <div class="imgUploadTip">
            <p>图片大小不得超过2M</p>
            <p>文件格式支持jpg、jpeg、png</p>
          </div>
        </el-form-item>
        <el-form-item size="small" label="企业名称" prop="name">
          <el-input v-model.trim="form.name" class="w_305" clearable></el-input>
        </el-form-item>
        <el-form-item size="small" label="企业简称" prop="code">
          <el-input v-model.trim="form.code" class="w_305" clearable></el-input>
        </el-form-item>
        <el-form-item size="small" label="行业类型" prop="type">
          <el-select class="w_305" size="small" v-model="form.type" clearable>
            <el-option v-for="item in companyTypeOptions" :key="item.dictCode" :value="item.dictCode" :label="item.dictName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item size="small" label="规模" prop="size">
          <el-select class="w_305" size="small" v-model="form.size" clearable>
            <el-option v-for="item in companySizeOptions" :key="item.dictCode" :value="item.dictCode" :label="item.dictName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item size="small" label="联系电话" prop="phone">
          <el-input v-model.trim="form.phone" class="w_305" clearable></el-input>
        </el-form-item>
        <el-form-item size="small" label="官网地址" prop="address">
          <el-input v-model.trim="form.address" class="w_305" clearable></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button size="small" type="primary" class="saveBtn" @click="modifiyBtn('form')">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { imgUpload, getSysDictByParentCode, saveCompanyInfo, getCompanyInfo } from '@/axios/api.js'
import { getFormData, filterObjNull, getImg } from '@/util/util'
export default {
  name: 'CompanyIdea',
  data () {
    return {
      btnDisabled: false,
      form: {
        id: '',
        logo: '',
        name: '',
        code: '',
        type: '',
        size: '',
        phone: '',
        address: ''
      },
      companyTypeOptions: [],
      companySizeOptions: [],
      rules: {
        // logo: { required: true, message: '请上传图片！', trigger: 'blur' },
        name: { required: true, message: '请输入企业名称！', trigger: 'blur' }
      },
      upload_name: '', // 图片名称
      isUploadError: false
    }
  },
  methods: {
    beforeAvatarUpload (file) {
      let isLt5M = file.size / 1024 / 1024 < 2
      let isIMAGE = ['image/jpg', 'image/jpeg', 'image/png'].indexOf(file.type) > -1
      if (!isIMAGE) {
        this.$message.error('上传图片格式不对!')
      }
      if (!isLt5M) {
        this.$message({
          message: '上传图片大小不能超过 2MB!',
          type: 'warning'
        })
        self.$refs.upload.uploadFiles = []
      }
      return isIMAGE && isLt5M
    },
    uploadSectionFileOne (params) {
      let self = this
      let file = params.file
      self.upload_name = 'file_img[]'
      imgUpload(getFormData({ file: file, type: 'logo' })).then(res => {
        if (res.data.success) {
          self.$set(self.form, 'logo', res.data.value)
          self.isUploadError = false
        } else {
          this.failMessage(res.data.message || '上传失败，请重新上传')
          self.$refs.upload.uploadFiles = []
        }
      }).catch(() => {
        // 请求失败返回的数据
        this.failMessage('上传失败，请重新上传')
      })
    },
    getImgUrl (imgData, defaultImg) {
      return getImg(imgData, defaultImg)
    },
    modifiyBtn (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false
        }
        this.btnDisabled = true
        saveCompanyInfo(filterObjNull(this.form)).then(res => {
          if (res.data.success) {
            this.successMessage(res.data.message)
          } else {
            this.failDialog(res.data.message)
          }
        }).catch(er => {
        })
      })
    },
    successMessage (txt) {
      this.$message({
        message: txt,
        type: 'success'
      })
    },
    failMessage (txt) {
      txt = txt || '请求失败'
      this.$message({
        message: txt,
        type: 'error'
      })
    }
  },
  mounted () {
    // 公司类型
    getSysDictByParentCode(getFormData({
      parentCode: 'companyType'
    })).then(res => {
      if (res.data.success) {
        if (res.data.value) {
          this.companyTypeOptions = res.data.value
        } else {
          this.companyTypeOptions = []
        }
      } else {
        this.companyTypeOptions = []
        this.failMessage(res.data.message)
      }
    }).catch(res => {
      this.failMessage(res && res.data && res.data.message)
    })
    // 公司规模
    getSysDictByParentCode(getFormData({
      parentCode: 'companySize'
    })).then(res => {
      if (res.data.success) {
        if (res.data.value) {
          this.companySizeOptions = res.data.value
        } else {
          this.companySizeOptions = []
        }
      } else {
        this.companySizeOptions = []
        this.failMessage(res.data.message)
      }
    }).catch(res => {
      this.failMessage(res && res.data && res.data.message)
    })
    // 公司信息获取
    getCompanyInfo().then(res => {
      if (res.data.success) {
        if (res.data.value) {
          this.form = res.data.value
        }
      } else {
        this.failMessage(res.data.message)
      }
    }).catch(res => {
      this.failMessage(res && res.data && res.data.message)
    })
  }
}
</script>

<style scoped>
.demo-ruleForm {
    width: 60%;
}
.passWordInput /deep/ .el-input__inner {
    width: 100%;
}
.demo-ruleForm {
  padding-top:30px;
}
.saveBtn {
  margin-top: 24px;
  background: #4C7EE9;
  border-radius: 4px;
  color: #FFF;
}
.avatar-uploader{
    border: 1px solid #ebeef5;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 112px;
    height: 112px;
}
.avatar-uploader-icon{
    font-size: 28px;
    color: #5cb6ff;
    width: 112px;
    margin-top: 36px;
    text-align: center;
}
.el-icon-picture-outline p{
    color: #c0c4cc;
    font-size: 12px;
}
.imgUploadTip{
  font-size: 12px;
  line-height: 22px;
  color: #c0c4cc;
  position: absolute;
  left: 120px;
  bottom: 0;
}
.avatar-uploader-error{
  border-color:#F56C6C
}
.avatar{
  display: block;
  width: 100%;
  height: 100%;
}
</style>
