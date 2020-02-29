<template>
  <div>
    <div class="title-comm">查询条件</div>
    <div class="box-comm">
      <el-form :model="form" ref="ruleForm" :inline="true">
        <el-form-item label="姓名" class="label_180">
          <el-input class="w_197" size="small" v-model.trim="form.userName" clearable ></el-input>
        </el-form-item>
        <el-form-item label="识别位置" class="label_180">
          <el-input class="w_197" size="small" v-model.trim="form.devicePosition" clearable ></el-input>
        </el-form-item>
        <el-form-item label="时间">
          <el-date-picker
            class="w_260"
            v-model="timeRange"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button size="small" class="editBtn" @click="query(1)">查询</el-button>
          <el-button size="small" @click="exportExcel" :loading="recordExportLoading">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="title-comm">数据列表</div>
    <div class="pdlr-comm">
      <el-table :data="tableData" class="processTable">
        <el-table-column prop="userName" label="客户姓名" align="left"></el-table-column>
        <el-table-column label="客户头像" align="left">
          <template slot-scope="scope">
            <el-image class="headImg" fit="cover" :src="getImgUrl(scope.row.libraryImg)" @click="imgClick(scope.row, scope.$index, 'libraryImg')">
                <div slot="error" class="headimg-default"></div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="识别照片" align="left">
          <template slot-scope="scope">
            <el-image class="headImg" fit="cover" :src="getImgUrl(scope.row.bigImg)" @click="imgClick(scope.row, scope.$index, 'bigImg')">
                <div slot="error" class="headimg-default"></div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="userMobile" label="客户手机号" align="left"></el-table-column>
        <el-table-column prop="channelTypeName" label="渠道" align="left"></el-table-column>
        <el-table-column prop="channelName" label="渠道经纪人" align="left"></el-table-column>
        <el-table-column prop="channelMobile" label="渠道手机号" align="left"></el-table-column>
        <el-table-column prop="devicePosition" label="识别位置" align="left"></el-table-column>
        <el-table-column prop="createTime" label="记录时间" align="left" min-width="110"></el-table-column>
      </el-table>
      <el-pagination
        v-if="total"
        class="pageView"
        @current-change="handleCurrentChange"
        layout="total, prev, pager, next, jumper"
        :current-page.sync="form.pageNum"
        :total="total"
        :page-size="form.pageSize"
      ></el-pagination>
    </div>
    <detailDialog ref="openDia" />
    <imgSwipper ref="showBigImg" />
  </div>
</template>

<script>
import { listRecord, exportRecord } from '@/axios/api.js'
import { getFormData, filterObjNull, getImg } from '@/util/util'
import imgSwipper from '@/components/inc/imgSwipper'
import { mapState, mapMutations } from 'vuex'
export default {
  components: {
    imgSwipper
  },
  data () {
    return {
      timeRange: '',
      total: 0,
      tableData: [],
      form: {
        userType: 1, // 0：陌生人(陌生人记录)，1：客户(识别记录页)
        // userId: '', // 用于从 客户报备跳转查询识别记录
        userName: '',
        devicePosition: '', // 识别位置
        startTime: '',
        endTime: '',
        pageSize: 10,
        pageNum: 0
      },
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      }
    }
  },
  computed: {
    ...mapState(['recordExportLoading'])
  },
  methods: {
    ...mapMutations(['recordExportLoadingEvent']),
    query (page, userId) {
      // this.form.pageNum = page || this.form.pageNum
      this.form.pageNum = page && page
      let data = filterObjNull(this.form)
      if (userId) {
        data.userId = userId
      }
      listRecord(getFormData(data)).then(res => {
        if (res.data.success) {
          this.total = res.data.value ? res.data.value.total : 0
          this.tableData = res.data.value ? res.data.value.list : []
        } else {
          this.failMessage(res.data.message)
        }
      })
    },
    exportExcel () {
      // 二次确认
      this.$confirm('是否确认导出?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        type: 'warning'
      }).then(() => {
        this.recordExportLoadingEvent(true)
        let reqData = filterObjNull({
          userType: 1,
          userName: this.form.userName,
          devicePosition: this.form.devicePosition,
          startTime: this.form.startTime,
          endTime: this.form.endTime
        })
        exportRecord(reqData).then(res => {
          let url = window.URL.createObjectURL(res.data)
          let a = document.getElementById('aDownload')
          if (!a) {
            a = document.createElement('a')
            a.setAttribute('id', 'aDownload')
            document.body.appendChild(a)
          }
          a.download = '识别记录.xlsx'
          a.href = url
          a.click()
          window.URL.revokeObjectURL(url)
          this.recordExportLoadingEvent(false)
          this.successMessage('导出成功！')
        }).catch(() => {
          this.recordExportLoadingEvent(false)
          this.failMessage('导出失败！')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消导出'
        })
      })
    },
    imgClick (detail, index, imgType) {
      this.$refs.showBigImg.showData({
        dataList: this.tableData.map(i => ({ imgUrl: i[imgType], userName: i.userName })),
        imgInit: index,
        imgEnd: this.pageSize - 1
      })
    },
    handleCurrentChange (page) {
      this.query(page)
    },
    getImgUrl (imgData, defaultImg) {
      return getImg(imgData, defaultImg)
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
    if (this.$route.query) {
      this.query(1, this.$route.query.userId)
    } else {
      this.query(1)
    }
  },
  watch: {
    timeRange () {
      if (this.timeRange !== '' && this.timeRange !== null) {
        this.form.startTime = this.timeRange[0]
        this.form.endTime = this.timeRange[1]
      } else {
        this.form.startTime = ''
        this.form.endTime = ''
      }
    }
  }
}
</script>
