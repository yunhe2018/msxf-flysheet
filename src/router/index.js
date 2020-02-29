import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

const Error = () => import('@/components/Error')
const Overtime = () => import('@/components/Overtime')
const Login = () => import('@/components/login')
const Layout = () => import('@/components/inc/layout')
const Device = () => import('@/components/device-manage/index')
const StrangerRecord = () => import('@/components/stranger-record-manage/index')
const DiscernRecord = () => import('@/components/discern-record-manage/index')
const ChannelUser = () => import('@/components/staff/channelUser')
const Customer = () => import('@/components/staff/customer')
const Modifypw = () => import('@/components/Sys/modifyPwd')
const CompanyIdea = () => import('@/components/Sys/companyIdea')
const configuration = () => import('@/components/Sys/configuration')
export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        isLogin: false
      }
    },
    {
      path: '/',
      component: Layout,
      redirect: '/user_report',
      meta: {
        isLogin: true
      },
      children: [
        {
          path: 'user_channel',
          name: 'user_channel',
          component: ChannelUser,
          meta: {
            isLogin: true
          }
        },
        {
          path: 'user_report',
          name: 'user_report',
          component: Customer,
          meta: {
            isLogin: true
          }
        },
        {
          path: 'system_password',
          name: 'system_password',
          component: Modifypw,
          meta: {
            isLogin: true
          }
        },
        {
          path: 'system_company',
          name: 'system_company',
          component: CompanyIdea,
          meta: {
            isLogin: true
          }
        },
        {
          path: 'system_algorithm',
          name: 'system_algorithm',
          component: configuration,
          meta: {
            isLogin: true
          }
        },
        {
          path: 'device',
          name: 'device',
          component: Device,
          meta: {
            isLogin: true
          }
        },
        {
          path: 'stranger_record',
          name: 'stranger_record',
          component: StrangerRecord,
          meta: {
            isLogin: true
          }
        },
        {
          path: 'face_record',
          name: 'face_record',
          component: DiscernRecord,
          meta: {
            isLogin: true
          }
        }
      ]
    },
    {
      path: '/error',
      name: 'Error',
      component: Error,
      meta: {
        isLogin: false
      }
    },
    {
      path: '/overtime',
      name: 'Overtime',
      component: Overtime,
      meta: {
        isLogin: false
      }
    }
  ]
})
