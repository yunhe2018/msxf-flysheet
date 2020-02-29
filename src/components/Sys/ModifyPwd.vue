<template>
  <div style="height: 100%">
    <div class="listBot">
      <el-form :model="formInline" :rules="rules" ref="formInline" label-width="150px" class="demo-ruleForm">
        <el-form-item label="输入原密码" prop="oldPwd">
          <el-input size="small" v-model.trim="formInline.oldPwd" class="passWordInput w_305" show-password></el-input>
        </el-form-item>
        <el-form-item label="输入新密码" prop="newPwd">
          <el-input size="small" v-model.trim="formInline.newPwd" class="passWordInput w_305" show-password></el-input>
        </el-form-item>
        <el-form-item label="请再次输入新密码" prop="checkPwd">
          <el-input size="small" v-model.trim="formInline.checkPwd" class="passWordInput w_305" show-password></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button size="small" type="primary" class="saveBtn" @click="modifiyPassWord('formInline')">修改</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getFormData } from '@/util/util'
import { modifyPassWord } from '@/axios/api.js'
export default {
  name: 'ModifyPwd',
  data () {
    return {
      btnDisabled: false,
      formInline: {},
      rules: {
        oldPwd: [
          { required: true, message: '请输入原密码', trigger: 'blur' },
          { min: 6, max: 30, message: '原密码长度为6-30个字符', trigger: 'blur' },
          { pattern: /((?=.*\d)(?=.*\D)|(?=.*[a-zA-Z])(?=.*[^a-zA-Z]))(?!^.*[^x00-xff].*$)\S{5,30}$/, message: '符号、数字、字母两种以上组合' }
        ],
        newPwd: [
          { required: true, message: '请输入新密码!', trigger: 'blur' },
          { min: 6, max: 30, message: '新密码长度为6-30个字符', trigger: 'blur' },
          { pattern: /((?=.*\d)(?=.*\D)|(?=.*[a-zA-Z])(?=.*[^a-zA-Z]))(?!^.*[^x00-xff].*$)\S{5,30}$/, message: '符号、数字、字母两种以上组合' }
        ],
        checkPwd: [
          { required: true, message: '请再次输入新密码！', trigger: 'blur' },
          { min: 6, max: 30, message: '新密码长度为6-30个字符', trigger: 'blur' },
          { pattern: /((?=.*\d)(?=.*\D)|(?=.*[a-zA-Z])(?=.*[^a-zA-Z]))(?!^.*[^x00-xff].*$)\S{5,30}$/, message: '符号、数字、字母两种以上组合' }
        ]
      }
    }
  },
  methods: {
    modifiyPassWord (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false
        }
        this.btnDisabled = true
        this.$confirm(`确认修改密码吗`, '提交', {
          closeOnClickModal: false
        }).then(() => {
          modifyPassWord(getFormData(this.formInline)).then(res => {
            if (res.data.success) {
              this.successMessage(res.data.message)
            } else {
              this.failDialog(res.data.message)
            }
          }).catch(er => {
          })
        })
      })
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
    }
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
</style>
