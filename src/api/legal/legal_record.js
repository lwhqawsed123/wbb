import request from '@/utils/request'
import qs from 'qs';

// 获取委托记录
export function recordList(data) {
    return request({
        url: '/reminder/client/reminderRecord/list',
        method: 'get',
        params:data
    })
}

// 获取常见问题
export function questionList(data) {
    return request({
        url: `/reminder/questions?pageNum=${data.pageNum}&pageSize=${data.pageSize}&questionsTitle=${data.questionsTitle}`,
        method: 'get'
    })
}

// 获取委托记录详情
export function recordDetailList(data) {
    return request({
        url: '/reminder/client/reminderRecord/proprietor',
        method: 'get',
        params:data
    })
}

// 获取可开发票列表
export function invoiceList(data) {
    return request({
        url: '/reminder/client/reminderStatus/list',
        method: 'get',
        params:data
    })
}

// 添加发票抬头
export function financeAddInvoice(data) {
    return request({
        url: '/finance/addLawyerInvoice',
        method: 'post',
        params: data
    })
}
// 修改发票抬头
export function financeEditInvoice(data) {
    return request({
        url: '/finance/saveUpdateInvoice',
        method: 'post',
        data: data
    })
}

// 申请开票
export function applyInvoice(data) {
    return request({
        url: '/reminder/client/reminderbilling/add',
        method: 'post',
        data:data
    })
}

// 获取发票记录列表
export function appliedInvoiceList(data) {
    return request({
        url: '/reminder/client/reminderBilling/list',
        method: 'get',
        params:data
    })
}
// 获取发票内(委托订单列表)信息
export function getInvoicelegalListById(data) {
    return request({
        url: `/reminder/client/reminderBilling`,
        method: 'get',
        params:data
    })
}

// 获取发票抬头信息
export function getInvoiceById(id) {
    return request({
        url: `/finance/getInvoiceById?id=${id}`,
        method: 'get'
    })
}
// 下载pdf
export function downloadPDFById(id) {
    return request({
        url: `/reminder/client/getLawyerIdsPdf?lawyerIds=${id}`,
        method: 'get',
        responseType: 'blob'
    })
}

// 在线详情页修改业主信息
export function onlineOwnerEdit(data) {
    return request({
        url: `/reminder/client/updateReminderArrearage`,
        method: 'put',
        data:data
    })
}