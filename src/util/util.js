import consts from '../util/constant.js'

// 是否为对象
export const isObject = data => {
  if (!data) return false
  return !(data instanceof Date) && typeof data === 'object'
}

// 将对象转为formData形式
export const getFormData = data => {
  let formData = new FormData()
  Object.keys(data).forEach((key) => {
    formData.append(key, data[key])
  })
  return formData
}

// 过滤掉对象中值为空的属性
export const filterObjNull = data => {
  if (!isObject(data)) return data
  let tmpObj = {}
  if (data instanceof Array) {
    tmpObj = []
  }
  for (var okey in data) {
    let item = data[okey]
    if (isObject(item)) {
      tmpObj[okey] = filterObjNull(item)
    } else {
      if (item || typeof item === 'number' || typeof item === 'boolean') {
        if (typeof item === 'string') {
          tmpObj[okey] = item.replace(/^\s+|\s+$/g, '')
        } else {
          tmpObj[okey] = item
        }
      }
    }
  }
  return tmpObj
}

// 去掉前后空格
export const trimSpace = text => {
  return text ? text.repalce(/^\s+|\s+$/g, '') : ''
}

// 递归查找
export const findItem = (data, childName, key, val) => {
  if (!data) { return null }
  let curItem = null;
  (function fn (data) {
    for (let i = 0, ln = data.length; i < ln; i++) {
      let item = data[i]
      if (item[key] === val) {
        curItem = item
        return curItem
      }
      if (item[childName]) {
        fn(item[childName])
      }
    }
    return null
  })(data)
  return curItem
}

// 将对象转为数组
export const objToArr = (data) => {
  if (!data || !isObject(data)) {
    return []
  }
  let arrTmp = []
  Object.keys(data).forEach((key) => {
    arrTmp.push({'key': key, 'val': data[key]})
  })
  return arrTmp
}

export const getImg = (url, defaultImg) => {
  if (!url) return defaultImg || ''
  return consts.apiPrefix + url
}
