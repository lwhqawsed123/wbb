import request from '@/utils/request'

// 查询 物业公司 列表
export function listRecord(query) {
  return request({
    // url: 'http://a30af57d1802e290.natapp.cc:8282/getByNameProp',
    url: 'https://comp.wubaocn.com/getByNameProp',
    method: 'get',
    params: query
  })
}

// 登录方法
export function login(username, password, code, uuid) {
  const data = {
    username,
    password,
    code,
    uuid
  }
  return request({
    url: '/login',
    method: 'post',
    params: data
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: '/getInfo',
    method: 'get'
  })
}

// 退出方法
export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/captchaImage',
    method: 'get'
  })
}

// 注册方法
export function register(data) {
  return request({
    url: '/prop/company/register',
    method: 'post',
    params:data
  })
}

// 注册短信验证
export function companyPhoneCode(page) {
  return request({
      url: `/prop/company/phoneCode`,
      method: 'get',
      params:page
  })
}

// 忘记密码发送验证码
// /system/user/forgetPasswordGetCode
export function systemUserForgetPasswordGetCode(page) {
  return request({
      url: `/system/user/forgetPasswordGetCode`,
      method: 'get',
      params:page
  })
}
// 忘记密码修改密码
export function systemUserForgetPassword(data) {
  return request({
    url: '/system/user/forgetPassword',
    method: 'post',
    params:data
  })
}