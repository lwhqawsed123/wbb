import request from '@/utils/request'
import qs from 'qs';

// 获取
export function questionList(data) {
    return request({
        url: `/reminder/questions?pageNum=${data.pageNum}&pageSize=${data.pageSize}&questionsTitle=${data.questionsTitle}`,
        method: 'get'
    })
}

// 新增
export function questionAdd(data) {
    return request({
        url: '/reminder/questions',
        method: 'post',
        data: data
    })
}

// 修改
export function questionEdit(data) {
    return request({
        url: `/reminder/questions/${data.id}`,
        method: 'put',
        data: data
    })
}

//    删除
export function questionDelete(id) {
    return request({
        url: `/reminder/questions/${id}`,
        method: 'delete',
    })
}