<template>
  <div>
    <div class="title-comm">查询条件</div>
    <div class="box-comm">
      <el-form :model="form" ref="ruleForm" :inline="true">
        <el-form-item label="安装位置" class="label_180">
          <el-input class="w_197" size="small" v-model.trim="form.deviceAddress" clearable ></el-input>
        </el-form-item>
        <el-form-item label="设备唯一码" class="label_180">
          <el-input class="w_197" size="small" v-model.trim="form.deviceCode" clearable ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" class="editBtn" @click="query(1)">查询</el-button>
          <el-button size="small" @click="add">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="title-comm">数据列表</div>
    <div class="pdlr-comm">
      <el-table :data="tableData" class="processTable">
        <el-table-column prop="deviceAddress" label="安装位置" align="left"></el-table-column>
        <el-table-column label="设备类型" align="left">
          <template slot-scope="scope">
            {{scope.row.deviceType === 'deviceType:1' ? '摄像头' : '访客机'}}
          </template>
        </el-table-column>
        <el-table-column prop="deviceNorms" label="设备型号" align="left"></el-table-column>
        <el-table-column prop="deviceCode" label="设备唯一码" align="left"></el-table-column>
        <el-table-column prop="videoIp" label="视频流地址" align="left"></el-table-column>
        <el-table-column prop="updateTime" label="时间" align="left"></el-table-column>
        <el-table-column prop="status" label="状态" align="left"></el-table-column>
        <el-table-column label="操作" align="left" fixed="right" min-width="100">
          <template slot-scope="scope">
            <el-link type="primary" class="opreationBtn" @click="edit(scope.row)">修改</el-link>
            <el-link type="primary" class="opreationBtn" @click="deleteOne(scope.row)">删除</el-link>
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
    <editDialog ref="editDia" @undateList='query()' />
    <imgSwipper ref="showBigImg" />
  </div>
</template>

<script>
import { listDevice, deleteDevice } from '@/axios/api.js'
import { getFormData, filterObjNull } from '@/util/util'
import editDialog from './editDialog'
export default {
  components: {
    editDialog
  },
  data () {
    return {
      total: 0,
      tableData: [],
      form: {
        deviceAddress: '',
        deviceCode: '',
        pageSize: 10,
        pageNum: 0
      }
    }
  },
  methods: {
    query (page) {
      // this.form.pageNum = page || this.form.pageNum
      page && (this.form.pageNum = page)
      listDevice(getFormData(filterObjNull(this.form))).then(res => {
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
    deleteOne (item) {
      this.$confirm(`确认删除该条数据吗？`, '删除', {
        closeOnClickModal: false
      }).then(() => {
        deleteDevice(getFormData({id: item.id})).then(res => {
          if (res.data.success) {
            this.successMessage(res.data.message)
            this.query(this.form.pageNum)
          } else {
            this.failMessage(res.data.message)
          }
          this.allChecked = false
        })
          .catch(res => {
            this.failMessage(res && res.data && res.data.message)
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
    successMessage (txt) {
      this.$message({
        message: txt,
        type: 'success'
      })
    }
  },
  mounted () {
    this.query(1)
  }
}
</script>
