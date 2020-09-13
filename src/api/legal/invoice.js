import request from '@/utils/request'
import qs from 'qs';

// 获取
export function list(data) {
    return request({
        url: `/reminder/billingRecord`,
        method: 'get',
        params:data
    })
}

// 获取
export function getInvoice(id) {
    return request({
        url: `/reminder/billingRecord/invoiceDetail/${id}`,
        method: 'get'
    })
}

// 确认开票
export function editDone(id) {
    return request({
        url: `/reminder/billingRecord/editDone/${id}`,
        method: 'put'
    })
}

// see页面 查看明细 列表
export function detailList(data) {
    return request({
        url: `/reminder/billingRecord/detail/${data.id}`,
        method: 'get',
        params:data.data
    })
}