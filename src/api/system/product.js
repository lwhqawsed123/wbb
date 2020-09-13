import request from '@/utils/request'

// 查询雇主险-产品主列表
export function listProduct(query) {
  return request({
    url: '/system/product/list',
    method: 'get',
    params: query
  })
}

// 查询雇主险-产品主详细
export function getProduct(id) {
  return request({
    url: '/system/product/' + id,
    method: 'get'
  })
}

// 新增雇主险-产品主
export function addProduct(data) {
  return request({
    url: '/system/product',
    method: 'post',
    data: data
  })
}

// 修改雇主险-产品主
export function updateProduct(data) {
  return request({
    url: '/system/product',
    method: 'put',
    data: data
  })
}

// 删除雇主险-产品主
export function delProduct(id) {
  return request({
    url: '/system/product/' + id,
    method: 'delete'
  })
}

// 导出雇主险-产品主
export function exportProduct(query) {
  return request({
    url: '/system/product/export',
    method: 'get',
    params: query
  })
}