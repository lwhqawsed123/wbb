import request from '@/utils/request'
import qs from 'qs';

// 获取
export function onlineList(data) {
    return request({
        url: `/reminder/online`,
        method: 'get',
        params:data
    })
}

// 修改业主信息
export const onlineOwnerEdit=(data)=> {
    return request({
        url: `/reminder/online/editPropr/${data.proprId}`,
        method: 'put',
        data: data.data
    })
}
// 修改委托状态
export const examineStatusEdit=(data)=> {
    return request({
        url: `/reminder/online/editProprExamineStatus/${data.id}/${data.proprId}`,
        method: 'put',
        data: data.data
    })
}
// 批量修改委托状态(一键审核)
export const allExamineStatusEdit=(data)=> {
    return request({
        url: `/reminder/online/batchEditProprExamineStatus`,
        method: 'put',
        data: JSON.stringify(data)
    })
}

//    删除
export function onlineDelete(id) {
    return request({
        url: `/reminder/product/${id}`,
        method: 'delete',
    })
}

// list页面 导出excel
export const onlineExport=(data)=> {
    return request({
        url:'/reminder/online/export',
        method: 'get',
        params:data
    })
}

// list页面 下载pdf
export const onlineDownloadPDF=(id)=> {
    return request({
        url:`/reminder/online/PDF/${id}`,
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