import request from '@/utils/request'
import qs from 'qs';
import { log } from 'util';


// 公众责任险列表-筛选项目列表
export function getProjectList(data) {
  return request({
    url: `/prop/project/list`,
    method: 'get',
    params: data
  })
}

// 公众责任险列表-筛选保单状态
export function getPolicyStatus(data) {
  return request({
    url: `/liability/getPolicyStatus`,
    method: 'get',
    params: data
  })
}

// 公众责任险列表-查询列表
export function publicInsuranceList(data) {
  return request({
    url: `/liability/getInventoryList`,
    method: 'get',
    params: data
  })
}

// 公众责任险列表-更新-保单状态
export function publicUpdatePolicyList(data) {
  return request({
    url: `/liability/liabilityPolicyList`,
    method: 'get',
    params: data
  })
}

// 公众责任险列表-更新-保单状态
export function publicUpdatePolicy(data) {
  return request({
    url: `/liability/updatePolicy`,
    method: 'post',
    data: data
  })
}

// 获取物业公司信息接口
export function getCompanyInfo() {
    return request({
        url: `prop/company/info`,
        method: 'get'
    })
}

// 申报页面获取项目列表
export function getApplyPolicyList(data) {
  return request({
    url: '/liability/list',
    method: 'get',
    params: data
  })
}

//  申报接口
export function applyLiabilityInsure(data, ruleCode) {
    ruleCode = ruleCode || ''
    return request({
        url: '/liability/applyLiabilityInsure?ruleCode=' + ruleCode,
        method: 'post',
        data: data
    })
}

// 投保单页面—获取投保单及清单
export function getInsurancePolicy(data) {
    return request({
        url: '/liability/getInsurancePolicy',
        method: 'get',
        params: data
    })
}

// 投保单页面—获取头部信息
export function getInsurancePolicyHeader(data) {
  return request({
    url: '/liability/getInsPolicy',
    method: 'get',
    params: data
  })
}

// 投保单页面—获取清单列表
export function getInsurancePolicyList(data) {
  return request({
    url: '/liability/getInsInventoryList',
    method: 'get',
    params: data
  })
}

// 投保单页面—资料上传
export function policyImageUpload(data, policyId) {
    return request({
        url: '/liability/upload?policyId=' + policyId,
        method: 'post',
        data: data
    })
}

// 财产一切险-查询财产标的物列表
export function getAllRisksList(data) {
  return request({
    url: '/property/propertyList',
    method: 'get',
    params: data
  })
}

// 财产一切险--申报记录列表
export function getUpdateAllRisksList(data) {
  return request({
    url: '/property/list',
    method: 'get',
    params: data
  })
}

// 财产一切险-申报记录列表-更新保单 or 投保信息提交保存
export function updateAllRisksPolicy(data) {
  return request({
    url: '/property/saveUpdateSubmit',
    method: 'put',
    data: data
  })
}

// 财产一切险-申报提交
export function applyAllRisksInsure(data) {
  return request({
    url: '/property/applyPropertyInsure',
    method: 'post',
    data: data
  })
}

// 财产一切险-申报-获取财产一切险投保单信息
export function getDetailInfoByAllRisks(data) {
  return request({
    url: '/property/getDetailInfo',
    method: 'get',
    params: data
  })
}

