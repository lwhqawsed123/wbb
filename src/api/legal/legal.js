import request from '@/utils/request'
import qs from 'qs';

// 获取律师函价格
export function chargeList() {
    return request({
        url: '/reminder/client/reminderProduct/list',
        method: 'get'
    })
}

// 获取常见问题
export function questionList(data) {
    return request({
        url: `/reminder/questions?pageNum=${data.pageNum}&pageSize=${data.pageSize}&questionsTitle=${data.questionsTitle}`,
        method: 'get'
    })
}
// 导出excel模板
export function exportEmptyExcel(data) {
    return request({
        url: '/reminder/client/export',
        method: 'get'
    })
}
// execl批量上传业主信息
export function upLoadExcel(data) {
    return request({
        url: '/reminder/client/proprietor/import',
        method: 'post',
        data:data,
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
}

// 申请
export function submitApply(data) {
    return request({
        url: `/reminder/client/reminderclient/apply`,
        method: 'post',
        data:JSON.stringify(data),
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        }
    })
}

// 确认支付
export function applyPay(data) {
    return request({
        url: `/reminder/client/reminderclient/apply/yes`,
        method: 'post',
        data:data
    })
}

// 下载全部pdf
export function getByEntrustPdf(id) {
    return request({
        url: `/reminder/client/getByEntrustPdf?entrustId=${id}`,
        method: 'get',
        responseType: 'blob'
    })
}