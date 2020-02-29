import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    // 初始化全局的一个变量
    userName: '',
    pageTitle: '',
    sessionId: '',
    channelUserExportLoading: false,
    customerExportLoading: false,
    recordExportLoading: false
  },
  mutations: {
    modifyTips (state, userName) {
      state.userName = userName
    },
    modifyTitle (state, pageTitle) {
      state.pageTitle = pageTitle
    },
    modifySessionId (state, sessionId) {
      state.sessionId = sessionId
    },
    channelUserExportLoadingEvent (state, flag) {
      state.channelUserExportLoading = flag
    },
    customerExportLoadingEvent (state, flag) {
      state.customerExportLoading = flag
    },
    recordExportLoadingEvent (state, flag) {
      state.recordExportLoading = flag
    }
  }
})
export default store
