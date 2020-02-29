<template>
  <div>
    <div class="title-comm">查询条件</div>
    <div class="box-comm">
      <el-form :model="form" ref="ruleForm" :inline="true">
        <el-form-item label="在职状态" class="label_180">
          <el-select clearable v-model="form.status" placeholder="请选择">
            <el-option
              v-for="item in statusOptions"
              :key="item.code"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="渠道" class="label_180">
          <el-select clearable v-model="form.channelType" placeholder="请选择">
            <el-option
              v-for="item in channelTypeOptions"
              :key="item.dictCode"
              :label="item.dictName"
              :value="item.dictCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名" class="label_180">
          <el-input class="w_197" size="small" v-model.trim="form.visitorName" clearable ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" class="editBtn" @click="query(1)">查询</el-button>
          <el-button size="small" @click="addOne">新增</el-button>
          <el-button size="small" @click="exportExcel" :loading="channelUserExportLoading">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="title-comm">数据列表</div>
    <div class="pdlr-comm">
      <el-table :data="tableData" class="processTable">
        <el-table-column prop="userName" label="渠道经纪人" align="left"></el-table-column>
        <el-table-column prop="phone" label="渠道手机号" align="left"></el-table-column>
        <el-table-column prop="channelType" label="渠道" align="left"></el-table-column>
        <el-table-column prop="entryTime" label="入职时间" align="left"></el-table-column>
        <el-table-column prop="status" label="在职状态" align="left"></el-table-column>
        <el-table-column label="操作" align="left" fixed="right" min-width="100">
          <template slot-scope="scope">
            <el-link type="primary" class="opreationBtn" @click="edit(scope.row)">修改</el-link>
          </template>
        </el-table-column>
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
    <channelUserDialog ref="editDia" @undateList='query()' />
    <imgSwipper ref="showBigImg" />
  </div>
</template>

<script>
import { listChannelUser, getSysDictByParentCode, exportChannelUser } from '@/axios/api.js'
import { getFormData, filterObjNull } from '@/util/util'
import channelUserDialog from './channelUserDialog'
import { mapState, mapMutations } from 'vuex'
export default {
  components: {
    channelUserDialog
  },
  data () {
    return {
      total: 0,
      tableData: [],
      statusOptions: [{name: '在职', code: 1}, {name: '离职', code: 0}],
      channelTypeOptions: [],
      form: {
        status: '',
        channelType: '', // 渠道类型
        userName: '',
        pageSize: 10,
        pageNum: 0
      }
    }
  },
  computed: {
    ...mapState(['channelUserExportLoading'])
  },
  methods: {
    ...mapMutations(['channelUserExportLoadingEvent']),
    query (page) {
      this.form.pageNum = page || this.form.pageNum
      listChannelUser(getFormData(filterObjNull(this.form))).then(res => {
        if (res.data.success) {
          this.total = res.data.value ? res.data.value.total : 0
          this.tableData = res.data.value ? res.data.value.list : []
        } else {
          this.failMessage(res.data.message)
        }
      })
    },
    addOne () {
      this.$refs.editDia.showData()
    },
    edit (row) {
      this.$refs.editDia.showData({id: row.id})
    },
    exportExcel () {
      // 二次确认
      this.$confirm('是否确认导出?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        type: 'warning'
      }).then(() => {
        this.channelUserExportLoadingEvent(true)
        let reqData = filterObjNull({
          status: this.form.status,
          channelType: this.form.channelType,
          userName: this.form.userName
        })
        exportChannelUser(reqData).then(res => {
          let url = window.URL.createObjectURL(res.data)
          let a = document.getElementById('aDownload')
          if (!a) {
            a = document.createElement('a')
            a.setAttribute('id', 'aDownload')
            document.body.appendChild(a)
          }
          a.download = '渠道员工.xlsx'
          a.href = url
          a.click()
          window.URL.revokeObjectURL(url)
          this.channelUserExportLoadingEvent(false)
          this.successMessage('导出成功！')
        }).catch(() => {
          this.channelUserExportLoadingEvent(false)
          this.failMessage('导出失败！')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消导出'
        })
      })
    },
    handleCurrentChange (page) {
      this.query(page)
    },
    failMessage (txt) {
      txt = txt || '请求失败'
      this.$message({
        message: txt,
        type: 'error'
      })
    },
    getChannelType () {
      getSysDictByParentCode(getFormData({
        parentCode: 'channelType'
      })).then(res => {
        if (res.data.success) {
          if (res.data.value) {
            this.channelTypeOptions = res.data.value
          } else {
            this.channelTypeOptions = []
          }
        } else {
          this.channelTypeOptions = []
          this.failMessage(res.data.message)
        }
      }).catch(res => {
        this.failMessage(res && res.data && res.data.message)
      })
    }
  },
  mounted () {
    this.getChannelType()
    this.query(1)
  }
}
</script>
