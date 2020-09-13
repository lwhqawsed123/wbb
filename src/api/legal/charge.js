import request from '@/utils/request'
import qs from 'qs';

// 获取律师函价格
export function chargeList() {
    return request({
        url: '/reminder/product',
        method: 'get'
    })
}

// 新增律师函价格
export function chargeAdd(data) {
    return request({
        url: `/reminder/product?id=${data.productId}`,
        method: 'post',
        data: data
    })
}

// 修改律师函价格
export function chargeEdit(data) {
    return request({
        url: `/reminder/product/${data.id}`,
        method: 'put',
        data: data.data
    })
}

//    删除律师函价格
export function chargeDelete(id) {
    return request({
        url: `/reminder/product/${id}`,
        method: 'delete',
    })
}