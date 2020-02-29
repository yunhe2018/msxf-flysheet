<template>
    <div class="header">
        <i class="icon-menu" :class="[isCollapse?'icon-menu-unfold':'icon-menu-fold']" @click="foldEvent"></i>
        <div class="headerBtn" @click="logout"><i class="el-icon-switch-button mgr-5"></i>退出</div>
        <div class="headerUser">{{this.userName}}</div>
    </div>
</template>

<script>
import { logout } from '@/axios/api.js'

export default {
  name: 'Header',
  props: {
    isCollapse: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      userName: '',
      strangernNum: 0,
      backNum: 0,
      leaveNum: 0,
      flag: 0,
      yellowFlag: 0,
      time: '',
      yellowTime: '',
      diffTime: 0
    }
  },
  created () {
    this.userName = sessionStorage.getItem('SDM_USERNAME')
  },
  methods: {
    logout () {
      this.$confirm('确认退出?', '提示', {})
        .then(() => {
          logout().then(res => {
            if (res.data.success) {
              clearTimeout(this.timeOut)
              sessionStorage.removeItem('SDM_SESSIONID')
              this.$router.push('/login')
            } else {
              this.failMessage('退出操作失败！')
            }
          }).catch(() => {
            this.failMessage('退出操作失败！')
          })
        })
        .catch(() => { })
    },
    foldEvent () {
      this.$emit('handleCollapse', !this.isCollapse)
    },
    intervalCount () {
      this.flag = 1
      this.yellowFlag = 1
      clearTimeout(this.timeOut)
      this.timeOut = setTimeout(() => {
      }, 10000)
    },
    iconClick () {
      this.$router.push('/allMng')
    },
    failMessage (txt) {
      txt = txt || '请求失败'
      this.$message({
        message: txt,
        type: 'error'
      })
    }
  }
}
</script>

<style scoped>
.header {
  display: flex;
  flex-direction: row-reverse;
  padding: 14px 0 10px 0;
  /* border-bottom: 1px solid #E5E7ED; */
  font-family: PingFangSC-Regular;
  font-size: 14px;
  line-height: 20px;
  color: #606266;
  position: relative;
}
.headerBtn {
  cursor: pointer;
  width: 92px;
  text-align: center;
  border-left: 1px solid #E3E3E3;
  margin-left: 16px;
}
.headerUser{
    background: url("../../assets/images/icon_admin.svg") left center no-repeat;
    background-size:20px 20px;
    padding-left:30px;
    height: 20px;
}
.icon-menu{
    cursor: pointer;
    position: absolute;
    left:0;
    top:0;
    padding:16px 9px;
    width:16px;
    height: 16px;
    display: inline-block;
    background-size: 16px;
    background-position: center;
    background-repeat: no-repeat;
}
.icon-menu-fold{
    background-image: url("../../assets/images/icon_menu_fold@2x.png");
}
.icon-menu-unfold{
    background-image: url("../../assets/images/icon_menu_unfold@2x.png")
}
.header_img{
  /* display: inline-block; */
  float: left;
  margin: 1px 10px 0 0;
  width: 18px;
}
.header_img img{
  width: 100%;
}
.warnNum{
  cursor: pointer;
}
.dataBtn {
  display: flex;
  margin-right: 40px;
  cursor: pointer;
}
.iconImg {
  height: 20px;
  display: inline-block;
  margin-right: 5px;
}
</style>
