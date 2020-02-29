import {service, downloadService} from './request'
// 验证码
export const verifyCode = data => { return service({method: 'post', responseType: 'arraybuffer', url: '/code/verifyCode', data, witchCredentials: true, headers: {'Content-Type': 'multipart/form-data'}}) }
// 登录
export const login = data => { return service({method: 'post', url: '/login/userLogin', data, headers: {'Content-Type': 'multipart/form-data'}}) }
// 退出
export const logout = () => { return service({method: 'post', url: '/login/logout', headers: {'Content-Type': 'multipart/form-data'}}) }
// 修改psd
export const modifyPassWord = data => { return service({method: 'post', url: '/login/modifyPassWord', data, headers: {'Content-Type': 'multipart/form-data'}}) }
// 图片上传
export const imgUpload = data => { return service({method: 'post', url: '/upload/imgUpload', data, headers: {'Content-Type': 'multipart/form-data'}}) }
// 首页
export const todayLogCount = () => { return service({method: 'get', url: '/main/todayLogCount'}) }
// 获取系统菜单
export const getUserMenu = () => { return service({method: 'post', url: '/menu/getMenuList', headers: {'Content-Type': 'multipart/form-data'}}) }
// 字典数据
export const getSysDictByParentCode = data => { return service({method: 'post', url: '/sysDict/getSysDictByParentCode', data, headers: {'Content-Type': 'multipart/form-data'}}) }
// 设备
export const listDevice = (data) => { return service({method: 'post', url: '/device/listDevice', data, headers: {'Content-Type': 'multipart/form-data'}}) }
// 设备新增
export const addDevice = data => { return service({method: 'post', url: '/device/addDevice', data, headers: {'Content-Type': 'application/json'}}) }
// 设备详情
export const deviceDetail = data => { return service({method: 'post', url: '/device/toUpdateDevice', data, headers: {'Content-Type': 'multipart/form-data'}}) }
// 设备修改
export const updateDevice = data => { return service({method: 'post', url: '/device/updateDevice', data, headers: {'Content-Type': 'application/json'}}) }
// // 删除
export const deleteDevice = data => { return service({method: 'post', url: '/device/deleteDevice', data, headers: {'Content-Type': 'multipart/form-data'}}) }
// 公司信息
export const getCompanyInfo = data => { return service({method: 'post', url: '/company/getCompanyInfo', data, headers: {'Content-Type': 'application/json'}}) }
// 公司修改
export const saveCompanyInfo = data => { return service({method: 'post', url: '/company/saveCompanyInfo', data, headers: {'Content-Type': 'application/json'}}) }

// 渠道员工-列表
export const listChannelUser = (data) => { return service({method: 'post', url: '/channel/listUser', data, headers: {'Content-Type': 'multipart/form-data'}}) }
// 渠道员工-新增
export const addChannelUser = data => { return service({method: 'post', url: '/channel/addUser', data, headers: {'Content-Type': 'application/json'}}) }
// 渠道员工-详情
export const ChannelUserDetail = data => { return service({method: 'post', url: '/channel/toUpdateUser', data, headers: {'Content-Type': 'multipart/form-data'}}) }
// 渠道员工-修改
export const updateChannelUser = data => { return service({method: 'post', url: '/channel/updateUser', data, headers: {'Content-Type': 'application/json'}}) }
// 渠道员工-导出
export const exportChannelUser = data => { return downloadService({method: 'post', responseType: 'blob', url: '/channel/dataExport', data, headers: {'Content-Type': 'application/json'}}) }

// 客户报备-列表
export const listCustomer = (data) => { return service({method: 'post', url: '/customer/listUser', data, headers: {'Content-Type': 'multipart/form-data'}}) }
// 客户报备-to新增
export const toAddCustomer = data => { return service({method: 'post', url: '/customer/toAddUser', data, headers: {'Content-Type': 'multipart/form-data'}}) }
// 客户报备-新增
export const addCustomer = data => { return service({method: 'post', url: '/customer/addUser', data, headers: {'Content-Type': 'application/json'}}) }
// 客户报备-详情
export const CustomerDetail = data => { return service({method: 'post', url: '/customer/toUpdateUser', data, headers: {'Content-Type': 'multipart/form-data'}}) }
// 客户报备-修改
export const updateCustomer = data => { return service({method: 'post', url: '/customer/updateUser', data, headers: {'Content-Type': 'application/json'}}) }
// 客户报备-删除
export const deleteCustomer = data => { return service({method: 'post', url: '/customer/deleteUser', data, headers: {'Content-Type': 'application/json'}}) }
// 客户报备-导出
export const exportCustomer = data => { return downloadService({method: 'post', responseType: 'blob', url: '/customer/dataExport', data, headers: {'Content-Type': 'application/json'}}) }

// 识别记录、陌生人记录
export const listRecord = (data) => { return service({method: 'post', url: '/record/listRecord', data, headers: {'Content-Type': 'multipart/form-data'}}) }
// 识别记录-导出
export const exportRecord = data => { return downloadService({method: 'post', responseType: 'blob', url: '/record/dataExport', data, headers: {'Content-Type': 'application/json'}}) }
// 图片质量参数配置-detail
export const getPicQuality = () => { return service({method: 'post', url: '/sysAlgorithm/qualityDetail', headers: {'Content-Type': 'multipart/form-data'}}) }
// 图片质量参数配置-保存
export const addPicQuality = data => { return service({method: 'post', url: '/sysAlgorithm/addQuality', data, headers: {'Content-Type': 'application/json'}}) }
// 识别参数配置-detail
export const sysAlgorithmDetail = () => { return service({method: 'post', url: '/sysAlgorithm/sysAlgorithmDetail', headers: {'Content-Type': 'multipart/form-data'}}) }
// 识别参数配置-保存
export const addSysAlgorithm = data => { return service({method: 'post', url: '/sysAlgorithm/addSysAlgorithm', data, headers: {'Content-Type': 'application/json'}}) }
