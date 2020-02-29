<template>
  <div>
    <div class="title-comm">查询条件</div>
    <div class="box-comm">
      <el-form :model="form" ref="ruleForm" :inline="true">
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
          <el-input class="w_197" size="small" v-model.trim="form.userName" clearable ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" class="editBtn" @click="query(1)">查询</el-button>
          <el-button size="small" @click="add">新增</el-button>
          <el-button size="small" @click="exportExcel" :loading="customerExportLoading">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="title-comm">数据列表</div>
    <div class="pdlr-comm">
      <el-table :data="tableData" class="processTable" ref="multipleTable" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="userName" label="客户姓名" align="left" min-width="80"></el-table-column>
        <el-table-column prop="headImg" label="客户头像" align="left">
          <template slot-scope="scope">
            <el-image class="headImg" fit="cover" :src="getImgUrl(scope.row.headImg)"
              @click="imgClick(scope.row, scope.$index, 'headImg')">
              <div slot="error" class="headimg-default"></div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="客户手机号" align="left"></el-table-column>
        <el-table-column prop="idCard" label="客户身份证号" align="left"></el-table-column>
        <el-table-column prop="channelType" label="渠道" align="left"></el-table-column>
        <el-table-column prop="channelUserName" label="渠道经纪人" align="left"></el-table-column>
        <el-table-column prop="channelPhone" label="渠道手机号" align="left"></el-table-column>
        <el-table-column label="状态" align="left" fixed="right" min-width="100">
          <template slot-scope="scope">
            <span class="statusSpan" @click="toRecord(scope.row)">{{scope.row.status}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="left" fixed="right" min-width="100">
          <template slot-scope="scope">
            <el-link type="primary" class="opreationBtn" @click="edit(scope.row)">修改</el-link>
            <el-link type="primary" class="opreationBtn" @click="del(scope.row)">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-bar" v-if="total">
        <div class="left">
          <el-checkbox v-model="allChecked" @change="toggleSelection()">全选</el-checkbox>
          <el-link type="primary" class="opreationBtn mgl-10" @click="del()" >批量删除</el-link>
        </div>
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
    </div>
    <customerDialog ref="editDia" @undateList='query()' />
    <imgSwipper ref="showBigImg" />
  </div>
</template>

<script>
import { getSysDictByParentCode, listCustomer, deleteCustomer, exportCustomer } from '@/axios/api.js'
import { getFormData, filterObjNull, getImg } from '@/util/util'
import customerDialog from './customerDialog'
import imgSwipper from '@/components/inc/imgSwipper'
import { mapState, mapMutations } from 'vuex'
export default {
  components: {
    customerDialog,
    imgSwipper
  },
  data () {
    return {
      total: 0,
      tableData: [],
      channelTypeOptions: [],
      form: {
        channelType: '',
        userName: '',
        pageSize: 10,
        pageNum: 0
      },
      allChecked: false,
      multipleSelection: []
    }
  },
  computed: {
    ...mapState(['customerExportLoading'])
  },
  methods: {
    ...mapMutations(['customerExportLoadingEvent']),
    query (page) {
      this.form.pageNum = page || this.form.pageNum
      listCustomer(getFormData(filterObjNull(this.form))).then(res => {
        if (res.data.success) {
          this.total = res.data.value ? res.data.value.total : 0
          this.tableData = res.data.value ? res.data.value.list : []
        } else {
          this.failMessage(res.data.message)
        }
      })
    },
    add () {
      this.$refs.editDia.showData()
    },
    edit (row) {
      this.$refs.editDia.showData({id: row.id})
    },
    del (item) {
      this.$confirm(`确认删除该条数据吗？`, '删除', {
        closeOnClickModal: false
      }).then(() => {
        let arr = []
        if (item) {
          arr = [item.id]
        } else {
          arr = this.multipleSelection.map(i => i.id)
        }
        if (arr.length > 0) {
          deleteCustomer(arr).then(res => {
            if (res.data.success) {
              this.successMessage(res.data.message)
              this.query(this.form.pageNum)
            } else {
              this.failMessage(res.data.message)
            }
            this.allChecked = false
          }).catch(res => {
            this.failMessage(res && res.data && res.data.message)
          })
        }
      })
    },
    toRecord (row) {
      this.$router.push({
        path: '/face_record',
        query: {
          userId: row.id
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
        this.customerExportLoadingEvent(true)
        let reqData = filterObjNull({
          channelType: this.form.channelType,
          userName: this.form.userName
        })
        exportCustomer(reqData).then(res => {
          let url = window.URL.createObjectURL(res.data)
          let a = document.getElementById('aDownload')
          if (!a) {
            a = document.createElement('a')
            a.setAttribute('id', 'aDownload')
            document.body.appendChild(a)
          }
          a.download = '客户报备.xlsx'
          a.href = url
          a.click()
          window.URL.revokeObjectURL(url)
          this.customerExportLoadingEvent(false)
          this.successMessage('导出成功！')
        }).catch(() => {
          this.customerExportLoadingEvent(false)
          this.failMessage('导出失败！')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消导出'
        })
      })
    },
    toggleSelection (rows) {
      this.$refs.multipleTable.toggleAllSelection()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      if (this.multipleSelection.length === this.tableData.length) {
        this.allChecked = true
      } else {
        this.allChecked = false
      }
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
      // if (!imgData) return ''
      // return 'data:image/jpg;base64,' + imgData
      return getImg(imgData, defaultImg)
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
<style scoped>
.statusSpan{
  color: red;
  cursor: pointer;
}
</style>
