<template>
  <div style="height: 100%" class="config">
    <div class="listBot mgt-10">
      <template>
        <el-tabs v-model="activeName">
          <el-tab-pane label="识别参数配置" name="firstTab">
            <!-- <div class="headerUser">识别参数配置</div> -->
            <el-form
              :model="formInline"
              :rules="rules"
              ref="formInline"
              label-width="150px"
              class="demo-ruleForm"
            >
              <el-form-item label="识别阈值" prop="algorithmDegree">
                <el-input v-model="formInline.algorithmDegree" class="width_197" size="small">
                  <template slot="prepend">大于</template>
                </el-input>
              </el-form-item>
              <el-form-item label>
                <el-button size="small" type="primary" class="saveBtn" :disabled="btnDisabled"
                @click="saveAlgorithmDegree('formInline')" >保存</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="图片质量参数配置" name="secondTab">
            <el-form :inline="true" :model="form2" :rules="rules2" ref="form2" label-width="170px" class="el-form-small-space">
              <el-form-item label="人脸区域灰度均值下限" prop="search.averageMin">
                <div class="td-cell">
                    <el-input v-model="form2.search.averageMin" class="width_197" size="small"></el-input>
                </div>
              </el-form-item>
              <el-form-item label="人脸区域灰度均值上限" prop="search.averageMax">
                <div class="td-cell">
                  <el-input v-model="form2.search.averageMax" class="width_197" size="small"></el-input>
                </div>
              </el-form-item>
              <el-form-item label="反光度" prop="search.highLight">
                <div class="td-cell">
                  <el-input v-model="form2.search.highLight" class="width_197" size="small"></el-input>
                </div>
              </el-form-item>
              <el-form-item label="人脸完整度" prop="search.intergrity">
                <div class="td-cell">
                  <el-input v-model="form2.search.intergrity" class="width_197" size="small"></el-input>
                </div>
              </el-form-item>
              <el-form-item label="长边/宽边分辨率最小值" prop="search.minResolution">
                <div class="td-cell">
                  <el-input v-model="form2.search.minResolution" class="width_197" size="small"></el-input>
                </div>
              </el-form-item>
              <el-form-item label="俯仰角" prop="search.pitch">
                <div class="td-cell">
                  <el-input v-model="form2.search.pitch" class="width_197" size="small"></el-input>
                </div>
              </el-form-item>
              <el-form-item label="滚转角" prop="search.roll">
                <div class="td-cell">
                  <el-input v-model="form2.search.roll" class="width_197" size="small"></el-input>
                </div>
              </el-form-item>
              <el-form-item label="偏航角" prop="search.yaw">
                <div class="td-cell">
                  <el-input v-model="form2.search.yaw" class="width_197" size="small"></el-input>
                </div>
              </el-form-item>
              <el-form-item label="模糊度" prop="search.defocus">
                <div class="td-cell">
                  <el-input v-model="form2.search.defocus" class="width_197" size="small"></el-input>
                </div>
              </el-form-item>
              <el-form-item label=" ">
                <el-button
                  size="small"
                  type="primary"
                  class="saveBtn"
                  @click="addPicQualityEvent('form2')"
                >保存</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </template>
    </div>
  </div>
</template>

<script>
import { sysAlgorithmDetail, addSysAlgorithm, getPicQuality, addPicQuality } from '@/axios/api.js'
export default {
  name: 'Configuration',
  data () {
    var newReg1 = (rule, value, callback) => {
      if (isNaN(value)) {
        callback(new Error('识别阈值必须为数字'))
      }
      if (
        value.toString().indexOf('.') !== -1 &&
        value.toString().substring(value.toString().indexOf('.')).length > 3
      ) {
        callback(new Error('识别阈值必须小数点后为两位'))
      }
      if (value > 1 || value < 0) {
        callback(new Error('识别阈值不能大于1小于0'))
      } else {
        callback()
      }
    }
    return {
      btnDisabled: false,
      formInline: {
        algorithmDegree: 0.8
      },
      rules: {
        algorithmDegree: [
          { required: true, message: '请输入识别阈值', trigger: 'blur' },
          { validator: newReg1, trigger: 'blur' }
        ]
      },
      activeName: 'firstTab',
      form2: {search: {}},
      rules2: {
        'averageMin': [
          { required: true, message: '请输入人脸区域灰度均值下线', trigger: 'blur' },
          { pattern: /^\d*\.?\d*$/, message: '值须为数值', trigger: 'blur' }
        ],
        'averageMax': [
          { required: true, message: '请输入人脸区域灰度均值上限', trigger: 'blur' },
          { pattern: /^\d*\.?\d*$/, message: '值须为数值', trigger: 'blur' }
        ],
        'highLight': [
          { required: true, message: '请输入反光度', trigger: 'blur' },
          { pattern: /^\d*\.?\d*$/, message: '值须为数值', trigger: 'blur' }
        ],
        'intergrity': [
          { required: true, message: '请输入人脸完整度', trigger: 'blur' },
          { pattern: /^\d*\.?\d*$/, message: '值须为数值', trigger: 'blur' }
        ],
        'minResolution': [
          { required: true, message: '分辨率最小值', trigger: 'blur' },
          { pattern: /^\d*\.?\d*$/, message: '值须为数值', trigger: 'blur' }
        ],
        'pitch': [
          { required: true, message: '请输入俯仰角', trigger: 'blur' },
          { pattern: /^-?\d*\.?\d*$/, message: '值须为数值', trigger: 'blur' }
        ],
        'roll': [
          { required: true, message: '请输入滚转角', trigger: 'blur' },
          { pattern: /^-?\d*\.?\d*$/, message: '值须为数值', trigger: 'blur' }
        ],
        'yaw': [
          { required: true, message: '请输入偏航角', trigger: 'blur' },
          { pattern: /^-?\d*\.?\d*$/, message: '值须为数值', trigger: 'blur' }
        ],
        'defocus': [
          { required: true, message: '请输入模糊度', trigger: 'blur' },
          { pattern: /^\d*\.?\d*$/, message: '值须为数值', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getSysAlgorithm()
    this.getPicQualityData()
  },
  methods: {
    getSysAlgorithm () {
      sysAlgorithmDetail().then(res => {
        if (res.data.success) {
          this.formInline = res.data.value || {}
        } else {
          this.failMessage(res && res.data && res.data.message)
        }
      }).catch(res => {
        this.failMessage(res && res.data && res.data.message)
      })
    },
    saveAlgorithmDegree (formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) {
          return false
        }
        this.btnDisabled = true
        let data = {
          algorithmDegree: this.formInline.algorithmDegree
        }
        addSysAlgorithm(data).then(res => {
          this.allMessage(res.data)
          this.btnDisabled = false
        }).catch(res => {
          this.failMessage(res && res.data && res.data.message)
          this.btnDisabled = false
        })
      })
    },
    getPicQualityData () {
      getPicQuality().then(res => {
        if (res.data.success) {
          if (res.data.value) {
            this.form2.search = res.data.value.search
          }
        } else {
          this.failMessage(res.data.message)
        }
      }).catch(res => {
        this.failMessage(res && res.data && res.data.message)
      })
    },
    addPicQualityEvent (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false
        }
        this.btnDisabled = true
        addPicQuality(this.form2).then(res => {
          this.allMessage(res.data)
          this.btnDisabled = false
        }).catch(res => {
          this.failMessage(res && res.data && res.data.message)
          this.btnDisabled = false
        })
      })
    },
    allMessage (e) {
      if (e.success === true) {
        this.$message({
          message: e.message,
          type: 'success'
        })
      } else {
        this.$message({
          message: e.message,
          type: 'error'
        })
      }
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
.headerUser {
  font-family: PingFangSC-Medium;
  font-size: 16px;
  color: #303133;
  line-height: 16px;
  font-weight: bold;
  padding: 20px 0;
}
.saveBtn {
  background: #4c7ee9;
  border-radius: 4px;
  color: #fff;
}
.config /deep/ .el-input-group--prepend .el-input__inner,
.el-input-group__append {
  text-align: right;
}

.td-cell {
  display: inline-block;
  width: 200px;
  padding-right: 20px;
}
.td-cell .bold {
  font-weight: bold;
}
</style>
