<template>
  <el-container class="homeContainer">
  <el-aside :width="isCollapse? '64px' : '200px'" style="position:relative;">
    <div class="homeTitle" @click="gohome">
      <img src="../../assets/images/login/logoIcon.png" class="logo" >
      <span v-show="!isCollapse">防飞单管理平台</span>
    </div>
    <el-menu
      class="el-menu-vertical-demo"
      :default-active="this.$route.path.replace(/Detail$/,'')"
      router
      :collapse="isCollapse"
      :collapse-transition="false"
      unique-opened>
      <Menu :menuList="menuList"></Menu>
    </el-menu>
  </el-aside>
  <el-container class="mainCont">
    <el-header height="48px">
      <Header :isCollapse="isCollapse" @handleCollapse="collapseEvent"></Header>
    </el-header>
    <el-main class="mainInCont">
      <div style="height:100%;" class="dialogAndScrollbar">
        <el-scrollbar style="height:100%;">
          <router-view></router-view>
        </el-scrollbar>
      </div>
    </el-main>
  </el-container>
</el-container>
</template>

<script>
import Menu from './Menu'
import Header from './Header'
import { getUserMenu } from '@/axios/api.js'
import consts from '@/util/constant.js'

export default {
  name: 'Layout',
  components: {
    Menu,
    Header
  },
  data () {
    return {
      menuList: [],

      isCollapse: false,
      curActive: 'home',
      logoInfo: '',
      apiPrefix: consts.apiPrefix,
      isDefault: false,
      unCollapse: {
        width: '220px'
      },
      collapse: {
        width: '50px'
      },
      unCollapseMain: {
        paddingLeft: '220px'
      },
      collapseMain: {
        paddingLeft: '50px'
      }
    }
  },
  created () {
    this.getMenuList()
  },
  methods: {
    collapseEvent (isCollapse) {
      this.isCollapse = isCollapse
    },
    getMenuList () {
      getUserMenu().then(res => {
        if (res.data.success) {
          this.menuList = res.data.value || []
        }
      })
    },
    gohome () {
      this.$router.push({
        path: '/home'
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .homeContainer {
    height: 100%;
  }
  .logo {
    display: inline-block;
    height: 25px;
    margin-right: 5px;
  }
  .el-header {
    color:#606266;
    height:48px;
    line-height: 48px;
    background-color:#fff;
  }
  .el-aside {
    text-align: center;
    line-height: 200px;
    height: 100%;
    background-color:#1E283C
  }
  .el-menu{
    border:0 none;
    background-color: #1E283C;
  }
  .el-main {
    color: #606266;
    margin: 16px;
    padding: 0px;
    overflow: hidden;
    height:100%;
    zoom:1;
    position: relative;
  }
  body > .el-container {
    margin-bottom: 40px;
  }
  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }
  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }

  .mainCont{
    overflow:hidden;
    width: 100%;
    flex: 1;
  }
  .homeTitle {
    display: flex;
    position: absolute;
    left: 0;
    top:0;
    width: 100%;
    z-index: 9;
    cursor: pointer;
    height: 64px;
    line-height: 62px;
    font-family: PingFangSC-Semibold;
    font-size: 16px;
    color: #FFFFFF;
    letter-spacing: 0;
    align-items: center;
    justify-content:left;
    padding-left:16px;
    box-sizing: border-box
  }
  .homeTitle img{
    padding: 18px 0px 20px 0px;
  }
</style>
