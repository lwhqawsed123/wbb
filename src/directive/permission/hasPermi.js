 /**
 * 操作权限处理
 * Copyright (c) 2019 ruoyi
 */
 
import store from '@/store'

export default {
  inserted(el, binding, vnode) {
    //console.log(el, binding,'操作权限处理');
    
    const { value } = binding
    const all_permission = "*:*:*";//代表所有权限
    const permissions = store.getters && store.getters.permissions//从缓存中拿权限
    // console.log(store.getters.permissions,'哈哈哈哈');
    if (value && value instanceof Array && value.length > 0) {
      const permissionFlag = value
      
      const hasPermissions = permissions.some(permission => {
        return all_permission === permission || permissionFlag.includes(permission)
      })
      if (!hasPermissions) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`请设置操作权限标签值`)
    }
  }
}
