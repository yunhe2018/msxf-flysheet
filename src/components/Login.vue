<template>
    <div class="container-fluid">
      <div class="loginTol row">
        <div class="loginLeft">
          <!-- <img src="../assets/images/login/logo_zkj.png" class="logo" /> -->
          <div class="loginText">
            <div class="textTop">让生活更轻松</div>
          </div>
        </div>
        <div class="loginRight">
          <div class="rightTitle">防飞单管理平台</div>
          <el-form :model="validateForm" class="form-login mgt-30" :rules="rules" ref="validateForm" @submit.native.prevent>
            <el-form-item label prop="userName">
              <el-input
                type="text"
                placeholder="用户名"
                class="inpt"
                v-model.trim="validateForm.userName"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label prop="passWord">
              <el-input
                class="inpt"
                type="password"
                placeholder="密码"
                v-model.trim="validateForm.passWord"
                autocomplete="off"
                @keyup.enter.native="submit('validateForm')"
              ></el-input>
            </el-form-item>
            <el-form-item
              class="verifyInput"
              label
              prop="code"
            >
              <el-input
                type="text"
                v-model.trim="validateForm.code"
                class="widt_146"
                @keyup.enter.native="submit('validateForm')"
              ></el-input>
              <img :src="verifyCodeImg" class="verifyCodeImg" @click="getVerifyCode">
            </el-form-item>
            <el-checkbox v-model="checked" class="loginCheck">记住密码</el-checkbox>
            <el-form-item>
              <el-button
                type="primary"
                class="loginBtn"
                @click="submit('validateForm')"
              >立即登录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="logincopy">copyright ©{{year}} 有限元 版权所有 京ICP备16065273号</div>
      <!-- <div class="logincopy">Copyright ©{{year}} 马上消费金融股份有限公司 版权所有 渝ICP备15005075号</div> -->
    </div>
</template>

<script>
import { login, verifyCode } from '../axios/api.js'
import { getFormData, filterObjNull, getImg } from '@/util/util.js'
export default {
  name: 'Login',
  data () {
    return {
      sessionId: '',
      validateForm: {
        userName: '',
        passWord: ''
      },
      checked: false,
      verifyCodeImg: '',
      apiPrefix: this.$globalConst.apiPrefix,
      year: new Date().getFullYear(),
      rules: {
        userName: [
          {
            required: true,
            message: '请输入用户名'
          },
          {
            min: 5,
            max: 30,
            message: '用户名长度为5-30个字符'
          }
        ],
        passWord: [
          {
            required: true,
            message: '请输入密码'
          },
          {
            min: 5,
            max: 30,
            message: '密码长度为5-30个字符'
          }
        ],
        code: [
          {
            required: true,
            message: '验证码不能为空'
          }
        ]
      }
    }
  },
  created () {
    this.sessionId = this.$store.state.sessionId
    this.getLocalStorage()
    this.getVerifyCode()
  },
  methods: {
    getLocalStorage () {
      this.validateForm.userName = localStorage.getItem('SDM_USER') || ''
      this.validateForm.passWord = window.atob(localStorage.getItem('SDM_PASSWORD') || '')
      this.checked = localStorage.getItem('SDM_CHECKED') === 'true'
    },
    submit (formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) return false
        // 是否记住密码
        let SDM_USER = localStorage.getItem('SDM_USER')
        if (!SDM_USER || SDM_USER !== this.validateForm.userName) {
          localStorage.setItem('SDM_USER', this.validateForm.userName)
        }
        if (this.checked) {
          localStorage.setItem('SDM_PASSWORD', window.btoa(this.validateForm.passWord))
          localStorage.setItem('SDM_CHECKED', this.checked)
        } else {
          // localStorage.removeItem('SDM_USER')
          localStorage.removeItem('SDM_PASSWORD')
          localStorage.removeItem('SDM_CHECKED')
        }
        // 登录验证
        let data = filterObjNull(this.validateForm)
        login(getFormData(data))
          .then(res => {
            if (res.data.success) {
              let result = res.data.value || {}
              sessionStorage.setItem('SDM_SESSIONID', result.sessionId)
              sessionStorage.setItem('SDM_USERNAME', result.userName)
              this.$store.commit('modifySessionId', result.sessionId)
              let redirect = this.$route.query.redirect || '/'
              this.$router.push(redirect)
            } else {
              this.failMessage(res.data.message)
              this.getVerifyCode()
            }
          })
          .catch(res => {
            this.failMessage('登录失败')
            this.getVerifyCode()
          })
      })
    },
    getVerifyCode () {
      verifyCode().then(res => {
        this.verifyCodeImg = 'data:image/png;base64,' + btoa(
          new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))
      }).catch(res => {
        let message = (res && res.data && res.data.message) || '验证码获取失败'
        this.failMessage(message)
      })
    },
    failMessage (txt) {
      txt = txt || '请求失败'
      this.$message({
        message: txt,
        type: 'error'
      })
    },
    getImgUrl (imgData, defaultImg) {
      return getImg(imgData, defaultImg)
    }
  }
}
</script>

<style scoped>
.container-fluid {
    width: 100%;
    height: 100%;
    background: url('../assets/images/login/bg.png') no-repeat center;
    border: 1px solid white;
    position: relative;
}
.loginTol {
    height: 344px;
    display: flex;
    justify-content: center;
    margin-top: 10%;
}
/* login左边logo部分 */
.loginLeft {
    height: 100%;
    width:240px;
    background: url('../assets/images/login/img_left@2x.png') no-repeat center;
    background-size:cover;
    position: relative;
}
.logo {
    width: 75px;
    position: absolute;
    top: 16px;
    left: 16px;
}
.loginText {
    width: 100%;
    position: absolute;
    bottom: 24px;
    left: 19px;
    right: 19px;
    text-align: center;
    color: #FFFFFF;
}
.textTop {
    font-size: 16px;
    line-height: 16px;
    margin-bottom: 17px;
}
.textBottom {
    opacity: 0.78;
    font-size: 12px;
    line-height: 12px;
}
/* login右边信息录入 */
.loginRight {
  box-sizing: border-box;
  height: 100%;
  width:352px;
  background-image: linear-gradient(-135deg, #FFFFFF 0%, rgba(255,255,255,0.98) 100%);
  box-shadow: 0 2px 6px 0 rgba(0,0,0,0.18);
  padding: 32px 48px 0;
}
.rightTitle {
  /* font-family: PingFangSC-Semibold; */
  font-size: 18px;
  color: #606266;
  letter-spacing: 0;
  text-align: center;
  line-height: 18px;
  font-weight: bold
}
/* user的input */
/* user的input */
.inpt {
  width: 100%;
  height:40px;
  line-height: 40px;
}
.el-form-item{
  margin-bottom: 16px;
}
/* check */
.loginCheck {
  margin: 13px 0;
}

/* 立即登录 */
.loginBtn {
  width: 100%;
  background: #4C7EE9;
  border-radius: 4px;
  /* font-family: PingFangSC-Medium; */
  font-weight:bold;
  font-size: 14px;
  color: #FFFFFF;
  line-height: 14px;
}
/* 版权 */
.logincopy {
  opacity: 0.45;
  /* font-family: PingFangSC-Regular; */
  font-size: 14px;
  color: #333;
  margin-top: 53px;
  display: flex;
  justify-content: center;
}

.verifyInput {
  display: flex;
  margin-bottom:0;
  justify-content: center;
}
.widt_146{width:146px}
.verifyCodeImg {
  width: 88px;
  height: 40px;
  margin-left: 15px;
  vertical-align: middle
}
</style>
