import request from '@/utils/request'
import qs from 'qs';

// 获取
export function list(data) {
    return request({
        url: `/reminder/offline/reminderRecord`,
        method: 'get',
        params:data
    })
}

// 修改委托状态
export const examineStatusEdit=(data)=> {
    return request({
        url: `/reminder/offline/editRecordDone/${data.id}`,
        method: 'put',
        params: data.data
    })
}

// list页面 导出excel
export const onlineExport=(data)=> {
    return request({
        url:'/reminder/offline/reminderRecord/export',
        method: 'get',
        params:data
    })
}

// list页面 下载pdf
export const onlineDownloadPDF=(id)=> {
    return request({
        url:`/reminder/offline/PDFs/${id}`,
        method: 'get',
        responseType: 'blob'
    })
}

// 获取公司列表
export const getCompany=()=> {
    return request({
        url:`/prop/company/list`,
        method: 'get'
    })
}

// 获取当前订单欠费业主列表
export function proprList(data) {
    return request({
        url: `/reminder/offline/reminderArrearageProprietor/${data.id}`,
        method: 'get',
        params:data.data
    })
}

// list页面 下载当前订单全部pdf
export const offlineDownloadAllPDF=(id)=> {
    return request({
        url:`/reminder/offline/PDFs/${id}`,
        method: 'get'
    })
}

// =======================
// see查看详细页面
export const offlineExport=(id)=> {
    return request({
        url:`/reminder/offline/reminderArrearageProprietor/export/${id}`,
        method: 'get'
    })
}
// see页面 单独下载pdf
export const offlineDownloadPDF=(id)=> {
    return request({
        url:`/reminder/offline/PDF/${id}`,
        method: 'get'
    })
}

// see页面 欠费业主状态修改成 作废 状态
export const editProprExamineStatus=(data)=> {
    return request({
        url:`/reminder/offline/editProprExamineStatus/${data.id}/${data.proprId}`,
        method: 'put'
    })
}

// 修改业主信息
export const editOwner=(data)=> {
    return request({
        url:`/reminder/offline/editPropr/${data.proprId}`,
        method: 'put',
        data:data
    })
}
