import request from '@/utils/request'
import qs from 'qs';
import { log } from 'util';

// 获取当前用户对应的物业公司信息
export function getPropCompany() {
    return request({
        url: '/prop/company/info',
        method: 'get'
    })
}

// 获取小区列表 (只查询再管数据)
export function getProjectRoleList(page) {
    return request({
        url: `/prop/project/list?is_manage=1`,
        method: 'get',
        params:page
    })
}
// 获取小区列表
export function getProjectRoleListAll(page) {
    return request({
        url: `/prop/project/list`,
        method: 'get',
        params:page
    })
}

// http://localhost:8280/ins/emp/product/list?pageSize=2&pageNum=1
export function getProjectList(page) {
    return request({
        url: `/prop/project/list`,
        method: 'get',
        params: page
    })
}

//   添加项目（小区）
export function projectAdd(data) {
    return request({
        url: '/prop/project/add',
        method: 'post',
        data: data
    })
}

// 获取小区信息
export function getProjectInformation(id) {
    return request({
        url: `/prop/project/${id}`,
        method: 'get'
    })
}

//   修改项目（小区）
export function projectEdit(data) {
    return request({
        url: '/prop/project/edit',
        method: 'put',
        data: data
    })
}
//    删除项目（小区）
export function projectDel(id) {
    return request({
        url: `/prop/project/del/${id}`,
        method: 'delete',
    })
}

//    查询小区
export function projecLookup(name) {
    return request({
        url: `/prop/project/list?name=${name}`,
        method: 'get'
    })
}

// 修改当前用户物业公司信息
export function modifyUserUpdatePwd(data) {
    return request({
        url: '/prop/company/edit',
        method: 'put',
        data: data
    })
}

// 获取Prop 用户列表
export function getUserList(data) {
    return request({
        // url: `/prop/user/list?userName=${prop.name}&propAdmin=${prop.propAdmin}&pageSize=${prop.pageSize}&pageNum=${prop.pageNum}`,
        url:`/prop/user/list`,
        method: 'get',
        params:data
    })
}
// 获取物业能设置的权限
export function getUserRoleList() {
    return request({
        url: `/prop/user/role/list`,
        method: 'get'
    })
}

// 用户管理 添加用户
export function propUserAdd(data) {
    return request({
        url: '/prop/user/add',
        method: 'post',
        data: data
    })
}

// 用户管理 重置密码
export function propUserResetPwd(data) {
    return request({
        url: '/prop/user/resetPwd',
        method: 'put',
        data: data
    })
}
// 用户管理 删除用户
export function propUserDel(id) {
    return request({
        url: `/prop/user/del/${id}`,
        method: 'delete',
    })
}

// 用户管理 修改用户
export function propUserEdit(data) {
    return request({
        url: '/prop/user/edit',
        method: 'put',
        data: data
    })
}

// 发票抬头管理
// 添加发票抬头
export function financeAddInvoice(data) {
    return request({
        url: '/finance/addInvoice',
        method: 'post',
        params: data
    })
}
// 获取发票抬头列表
export function queryInvoiceList(data) {
    return request({
        url: `/finance/queryInvoiceList?title=${data.title}&recipient=${data.recipient}&pageSize=${data.pageSize}&pageNum=${data.pageNum}`,
        method: 'get',
    })
}

// 修改发票抬头
export function saveUpdateInvoice(data) {
    return request({
        url: '/finance/saveUpdateInvoice',
        method: 'put',
        params: data
    })
}

// 删除发票
export function delInvoiceById(id) {
    return request({
        url: `finance/delInvoiceById?ids=${id}`,
        method: 'delete',
    })
}

// 获取发票明细
export function getInvoiceById(id) {
    return request({
        url: `/finance/getInvoiceById?id=${id}`,
        method: 'get',
    })
}

// 充值记录查询
export function queryFillingRecordList(page) {
    return request({
        url: `/finance/queryFillingRecordList?pcName=${page.pcName}&payStatus=${page.payStatus}&pageSize=${page.pageSize}&pageNo=${page.pageNum}`,
        method: 'get',
    })
}

// 充值转移
// 查询项目账户列表
export function queryProjectList(page) {
    return request({
        url: `finance/queryProjectList`,
        method: 'get',
        params:page
    })
}

// 查询项目以及账户明细
export function queryProjectAndAccountDetail(id) {
    return request({
        url: `finance/queryProjectAndAccountDetail?id=${id}`,
        method: 'get',
    })
}


// 充值
export function userRegister(arrData) {
    return request({
        url: `/finance/addAmount`,
        method: 'post',
        data: JSON.stringify(arrData),
    })
}
// 充值凭证
export function queryFillingRecordDetail(data) {
    return request({
        url: `/finance/queryFillingRecordDetail`,
        method: 'get',
        params: data
    })
}

// 金额转移提交
export function transferAmount(data) {
    return request({
        url: `/finance/transferAmount`,
        method: 'post',
        // data: JSON.stringify(data)
        // params:data
        data: qs.stringify(data),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
}

// 查询转账记录
export function queryTransferRecordList(page) {
    return request({
        url: `finance/queryTransferRecordList?outName=${page.outName}&inName=${page.inName}&pageSize=${page.pageSize}&pageNo=${page.pageNum}`,
        method: 'get',
    })
}
// 查询转账记录(获取所以信息)
export function queryTransferRecordList2() {
    return request({
        url: `finance/queryTransferRecordList`,
        method: 'get',
    })
}


// 获取prop 工种
export function propJobsList() {
    return request({
        url: `/prop/jobs/list`,
        method: 'get',
    })
}

// 获取保险产品（rule）
export function insRuleGetProduct(insType) {
    return request({
        url: `/ins/rule/getProduct`,
        method: 'get',
        params: insType,
    })
}

// 雇主险提交方案及用户到保险公司-一键通
export function confirmOne(data) {

    return request({
        url: `/ins/emp/apply/confirm/one`,
        method: 'post',
        data: data
    })
}

// 物业管理 雇主险批改记录
export function insEmpEndorseDetails(page) {
    return request({
        url: `/ins/emp/endorse/details?pageSize=${page.pageSize}&pageNum=${page.pageNum}&name=${page.name}&phone=${page.phone}`,
        method: 'get',
    })
}

// 物业管理 雇主险保单管理详细
export function insEmpApplyDetails(page) {
    return request({
        url: `/ins/emp/apply/details?pageSize=${page.pageSize}&pageNum=${page.pageNum}&name=${page.name}&periodUnit=${page.periodUnit}&insStatus=${page.insStatus}`,
        method: 'get',
    })
}

// 物业管理 雇主险保单管理详细 导出
export function insEmpApplyExport(data) {
    return request({
        url: `/ins/emp/apply/export`,
        method: 'get',
        params: data
    })
}

// 雇主险批增，批减少，批改
export function insEmpEndorse(data) {
    // console.log(data, '请求');

    return request({
        url: `/ins/emp/endorse`,
        method: 'post',
        data: data
    })
}
// 物业管理 雇主险 获取有效期内的保单
export function insEmpApplyGetApplies() {
    return request({
        url: `/ins/emp/apply/getApplies`,
        method: 'get',
    })
}

// 物业管理 雇主险保单申请-下载批量导入用户模板
// export function insEmpApplyExportTemplate() {
//     return request({
//         url: `/ins/emp/apply/export/template`,
//         method: 'get',
//     })
// }

// 物业管理 雇主险保单申请 导入用户
export function insEmpApplyImportData(data) {
    return request({
        url: `/ins/emp/apply/importData`,
        method: 'post',
        headers: {
            "Content-Type": "multipart/form-data"
        },
        data: data
    })
}

// 物业管理 雇主险批单管理详细 导出
export function insEmpEndorseExport(data) {
    return request({
        url: `/ins/emp/endorse/export`,
        method: 'get',
        params: data
    })
}

// 申报家财险
export function houseInsureApplyHouseInsure(data) {
    return request({
        url: `/houseInsure/applyHouseInsure`,
        method: 'post',
        data: JSON.stringify(data),
    })
}

// 家财保障申报记录
export function queryApplyHouseInsureList(data) {
    return request({
        url: `/houseInsure/queryApplyHouseInsureList`,
        method: 'get',
        params: data
    })
}
// 家财 家财险保单申请-下载批量导入用户模板
export function houseInsureExportTemplate() {
    return request({
        url: `/houseInsure/export/template`,
        method: 'get',
    })
}

// 家财 家财险保单申请 导入用户
export function houseInsureImportData(data) {
    return request({
        url: `/houseInsure/importData`,
        method: 'post',
        headers: {
            "Content-Type": "multipart/form-data"
        },
        data: data
    })
}

// 家财 变更申请
export function changeApplyAddressInfo(data) {
    return request({
        url: '/houseInsure/changeApplyAddressInfo',
        method: 'put',
        data: qs.stringify(data),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
}

// 家财险申报记录列表导出Excel
export function exportApplyRecord(data) {
    return request({
        url: `/houseInsure/exportApplyRecord`,
        method: 'get',
        params: data
    })
}

// 查看电子凭证 （保单号）
export function queryHouseInsureCard(data) {
    // console.log(data, '请求');

    return request({
        url: `/houseInsure/queryHouseInsureCard`,
        method: 'get',
        params: data
    })
}

// 我的待办
export function myCenterQueryWaitAuditList(data) {
    return request({
        url: `/myCenter/queryWaitAuditList`,
        method: 'get',
        params: data
    })
}

// 待办详情
export function myCenterQueryWaitAuditDetail(data) {
    return request({
        url: `/myCenter/queryWaitAuditDetail`,
        method: 'get',
        params: data
    })
}
// 充值审核
export function financeAuditFilling(data) {
    return request({
        url: `/finance/auditFilling`,
        method: 'put',
        params: data
    })
}

// 注册审核提交
export function myCenterSaveRegisterAudit(data) {
    return request({
        url: `/myCenter/saveRegisterAudit`,
        method: 'put',
        params: data
    })
}

// 我的申请
export function myCenterQueryMyApplyList(data) {
    return request({
        url: `/myCenter/queryMyApplyList`,
        method: 'get',
        params: data
    })
}

// 物业管理 雇主险 发票申请
export function applyEinvoices(data) {
    return request({
        url: '/ins/emp/apply/einvoices',
        method: 'post',
        data: data
    })
}

// 物业管理 雇主险 获取可以申请发票的保单/批改单
export function einvoicesGetBizs() {
    return request({
        url: `/ins/emp/apply/einvoices/getBizs`,
        method: 'get',
    })
}



// 修改用户状态
export function propUserUpdateUserStatus(data) {
    return request({
        url: '/prop/user/updateUserStatus',
        method: 'put',
        params: data
    })
}


// 平台管理

// 新增灵活用工
export function systemToolAdd(data) {
    return request({
        url: '/system/tool/add',
        method: 'post',
        data: data
    })
}

// 查询总参与总人数
export function intentionGetTotal() {
    return request({
        url: `/intention/getTotal`,
        method: 'get',
    })
}

// 查询灵活用工列表
export function systemTooLlist(page) {
    return request({
        url: `/system/tool/list?type=1`,
        method: 'get',
        params: page
    })
}

// 更新灵活用工
export function systemToolEdit(data) {
    return request({
        url: `/system/tool/edit`,
        method: 'put',
        data: JSON.stringify(data)
    })
}

// 新增参与互助意向
export function intentionAddUnit(data) {
    return request({
        url: '/intention/addUnit',
        method: 'post',
        data: data
    })
}

// 查询参与互助意向列表
export function intentionList(page) {
    return request({
        url: `/intention/list`,
        method: 'get',
        params: page
    })
}

// 信息管理
// 产品列表
export function systemProdTypeGetListByQuery(page) {
    // console.log(page);
    return request({
        url: `/system/prodType/getListByQuery`,
        method: 'get',
        params: page
    })
}
// 删除产品
export function systemProdType(id) {
    return request({
        url: `/system/prodType/${id}`,
        method: 'delete',
    })
}
// 新增产品
export function systemProdTypeAdd(data) {
    return request({
        url: '/system/prodType/add',
        method: 'post',
        data: data
    })
}

// 修改产品
export function systemProdTypeUpdate(data) {
    return request({
        url: '/system/prodType/update',
        method: 'put',
        params: data
    })
}
// 查询产品详情
export function systemProdTypeGte(id) {
    return request({
        url: `/system/prodType/${id}`,
        method: 'get',
    })
}

// 保险机构管理
// 保险公司列表
export function insCompanyList(page) {
    return request({
        url: `/ins/company/list`,
        method: 'get',
        params: page
    })
}

// 新增保险公司
export function insCompany(data) {
    return request({
        url: '/ins/company',
        method: 'post',
        data: data
    })
}

// 获取详情
export function insCompanyGetId(id) {
    return request({
        url: `/ins/company/${id}`,
        method: 'get',
    })
}

// 修改保险公司
export function insCompanyPut(data) {
    return request({
        url: '/ins/company',
        method: 'put',
        data: data
    })
}

// 获取合作产品列表信息
export function insCompanyProductGetList(id) {
    return request({
        url: `/ins/companyProduct/getList/${id}`,
        method: 'get',
    })
}

// 保险条款
export function insCompanyProductAddInsClause(data) {
    return request({
        url: '/ins/companyProduct/addInsClause',
        method: 'post',
        data: data
    })
}

// 合作地域
export function insCooperationRuleGetList(id) {
    return request({
        url: `/ins/cooperationRule/getList/${id}`,
        method: 'get',
    })
}

// 修改合作地域
export function insCooperationRuleUpdateRule(data) {
    return request({
        url: '/ins/cooperationRule/updateRule',
        method: 'put',
        // json 格式
        data: data
    })
}

// 家财豆金额转移
export function financeBeanTransformBean(data) {
    return request({
        url: '/finance/bean/transformBean',
        method: 'post',
        params: data
    })
}

// 家财豆 查询转换记录
export function financeBeanGetTransformList(page) {
    return request({
        url: `/finance/bean/getTransformList`,
        method: 'get',
        params: page
    })
}

// 获取充值列表
export function financeAuditList(page) {
    return request({
        url: `/finance/auditList`,
        method: 'get',
        params: page
    })
}
// 获取当前充值列表
export function financeGetById(id) {
    return request({
        url: `/finance/getById/${id}`,
        method: 'get',
    })
}

// 充值审核提交
export function financeAudit(data) {
    return request({
        url: '/finance/audit',
        method: 'put',
        params: data
    })
}

// 公司信息
// 获取企业性质列表
export function propNatureList() {
    return request({
        url: `/prop/nature/list`,
        method: 'get',
    })
}

// 充值 导出
export function financeExport(data) {
    return request({
        url: `/finance/export`,
        method: 'get',
        params: data
    })
}

// 家财豆列表
export function financeBeanAuditList(page) {
    return request({
        url: `/finance/bean/auditList`,
        method: 'get',
        params: page
    })
}
// 获取当前家财豆列表
export function financeBeanGetById(id) {
    return request({
        url: `/finance/bean/getById/${id}`,
        method: 'get',
    })
}
// 家财豆审核提交
export function financeBeanAudit(data) {
    return request({
        url: '/finance/bean/audit',
        method: 'put',
        params: data
    })
}
// 家财豆 导出
export function financeBeanExport(data) {
    return request({
        url: `/finance/bean/export`,
        method: 'get',
        params: data
    })
}

// 产品类别 上传海报
export function systemProdTypeUploadPoster(data) {
    return request({
        url: '/system/prodType/uploadPoster',
        method: 'post',
        headers: {
            "Content-Type": "multipart/form-data"
        },
        data: data
    })
}

// 物业公司管理
// 物业公司列表
export function propCompanyList(page) {
    return request({
        url: `/prop/company/list`,
        method: 'get',
        params: page
    })
}

// 获取需要审核的公司列表
export function propCompanyWaitList(page) {
    return request({
        url: `/prop/company/waitList`,
        method: 'get',
        params: page
    })
}

// 获取公司信息
export function propCompanyInfo(id) {
    return request({
        url: `/prop/company/info/${id}`,
        method: 'get',
    })
}

// 获取获取小区信息
export function propProjectGetListByCompanyId(id) {
    return request({
        url: `/prop/project/getListByCompanyId/${id}`,
        method: 'get',
    })
}

// 据公司id查询发票 

export function financeInvoiceGetByCompanyId(page) {
    return request({
        url: `/finance/invoice/getByCompanyId/`,
        method: 'get',
        params: page
    })
}

// 禁用公司账户
export function propCompanyUpdateStatusByCompId(data) {
    return request({
        url: '/prop/company/updateStatusByCompId',
        method: 'put',
        params: data
    })
}

// 查询家财豆使用记录列表
export function financeBeanGetUseRecord(page) {
    return request({
        url: `/finance/bean/getUseRecord`,
        method: 'get',
        params: page
    })
}

// 导出家财豆使用记录数据
export function financeBeanExportUseRecord(data) {
    return request({
        url: `/finance/bean/exportUseRecord`,
        method: 'get',
        params: data
    })
}

// 非在线保险产品(保额与保费)
export function insNonOnlineProd(page) {
    return request({
        url: `/ins/nonOnline/prod`,
        method: 'get',
        params:page
    })
}

// 文件上传 （阿里云OSS）
export function filePolicy(insType) {
    return request({
        url: `/file/policy`,
        method: 'get',
    })
}



// 获取公众责任险 保单号

// common/getOrderNo
export function commonGetOrderNo() {
    return request({
        url: `/common/getOrderNo`,
        method: 'get',
    })
}



// 查询线上支付订单结果
export function financeQueryPayOrderResult(arrData) {
    return request({
        url: `/finance/queryPayOrderResult`,
        method: 'post',
        data: JSON.stringify(arrData),
    })
}









// 角色列表
export function sysPropRoleGetListIngoreAdmin() {
    return request({
        url: `/sys/prop/role/getListIngoreAdmin`,
        method: 'get',
    })
}


// 获取省市区级联数据
export function sysRegion() {
    return request({
        url: `/sys/region`,
        method: 'get',
    })
}

// 经办人用户 新增用户
export function sysInsUser(data) {
    return request({
        url: '/sys/ins/user',
        method: 'post',
        data: data
    })
}
// 经办人用户 列表
export function sysInsUserList(page) {
    return request({
        url: `/sys/ins/user/list`,
        method: 'get',
        params: page
    })
}
// 经办人用户 修改用户
export function sysInsUserPut(data) {
    return request({
        url: '/sys/ins/user',
        method: 'put',
        data: data
    })
}


// 雇主定制↓

// 查询可选择的公司列表
export function insEmpCustomRriceApplyInsCompList() {
    return request({
        url: `/ins/emp/custom/priceApply/insCompList`,
        method: 'get',
    })
}

// 提交询价
export function insEmpCustomPriceApply(data) {
    return request({
        url: '/ins/emp/custom/priceApply',
        method: 'post',
        data: data
    })
}

// 查询这个物业公司是否可以报价,支持根据保险公司id查询，如果没有传，则查询这家物业公司今年是否可以报价
export function insEmpCustomPriceApplyAllow(page) {
    return request({
        url: `/ins/emp/custom/priceApply/allow`,
        method: 'get',
        params: page
    })
}
// 获取手机号验证码
export function insEmpCustomPriceApplyPhoneCode(page) {
    return request({
        url: `/ins/emp/custom/priceApply/phoneCode`,
        method: 'get',
        params: page
    })
}

// 保险公司查询详情
export function insEmpCustomPriceApplyGte(id) {
    return request({
        url: `/ins/emp/custom/priceApply/${id}`,
        method: 'get',
    })
}

// 申报

// 查询雇主定制申报详情
export function insEmpCustomApplyId(id) {
    return request({
        url: `/ins/emp/custom/apply/${id}`,
        method: 'get',
    })
}


// 查询可选择的承保公司
export function insEmpCustomApplyCompList() {
    return request({
        url: `/ins/emp/custom/apply/comp/list`,
        method: 'get',
    })
}

// 下载模板
export function insEmpCustomApplyExportTemplate() {
    return request({
        url: `/ins/emp/custom/apply/export/template`,
        method: 'get',
    })
}

// 导入数据
export function insEmpCustomApplyImportData(data) {
    return request({
        url: `/ins/emp/custom/apply/importData`,
        method: 'post',
        headers: {
            "Content-Type": "multipart/form-data"
        },
        data: data
    })
}

// 雇主定制提交申报
export function insEmpCustomApply(data) {
    return request({
        url: '/ins/emp/custom/apply',
        method: 'post',
        data: data
    })
}

// 获取保险公司详情
export function insCompanyId(id) {
    return request({
        url: `/ins/company/${id}`,
        method: 'get',
    })
}

// 雇主定制确认付款
export function insEmpCustomApplyPut(data) {
    return request({
        url: '/ins/emp/custom/apply',
        method: 'put',
        params: data
    })
}

// 获取凭证号
export function insEmpCustomApplyOrderNo() {
    return request({
        url: `/ins/emp/custom/apply/orderNo`,
        method: 'get',
    })
}

// 查询这个日期是否允许被选择
export function insEmpCustomApplyAllowChoiceTime(page) {
    return request({
        url: `/ins/emp/custom/apply/allowChoiceTime`,
        method: 'get',
        params:page
    })
}

// 获取保单管理列表
export function insEmpCustomApplyManageList(page) {
    return request({
        url: `/ins/emp/custom/applyManage/list`,
        method: 'get',
        params:page
    })
}

// 雇主定制新增列表
export function insEmpCustomApplyManageNewList(page) {
    return request({
        url: `/ins/emp/custom/applyManage/newList`,
        method: 'get',
        params:page
    })
}

// 查询雇主定制申报详情
export function insEmpCustomApplyGet(id) {
    return request({
        url: `/ins/emp/custom/apply/${id}`,
        method: 'get',
    })
}

// 根据保单id查询被保人列表
export function insEmpCustomApplyManageDetailList(page) {
    return request({
        url: `/ins/emp/custom/applyManage/detail/list`,
        method: 'get',
        params:page
    })
}

// 根据保单id查询退保列表
export function insEmpCustomApplyManageReturnList(page) {
    return request({
        url: `/ins/emp/custom/applyManage/return/list`,
        method: 'get',
        params:page
    })
}

// 雇主定制新增
export function insEmpCustomApplyManage(data) {
    return request({
        url: '/ins/emp/custom/applyManage',
        method: 'post',
        data: data
    })
}

// 雇主定制新增详情，只返回被保人信息列表
export function insEmpCustomApplyManageNewDetail(id,data) {
    return request({
        url: `/ins/emp/custom/applyManage/new/detail/${id}`,
        method: 'get',
        params:data
    })
}

// 退保
export function insEmpCustomApplyManageReturn(data) {
    return request({
        url: '/ins/emp/custom/applyManage/return',
        method: 'post',
        params: data
    })
}

// 替换列表
export function insEmpCustomApplyManageReplaceList(page) {
    return request({
        url: `/ins/emp/custom/applyManage/replace/list`,
        method: 'get',
        params:page
    })
}

// 提交替换
export function insEmpCustomApplyManageReplace(data) {
    return request({
        url: '/ins/emp/custom/applyManage/replace',
        method: 'post',
        data: data
    })
}

// 续保
export function insEmpCustomApplyManageRenewal(page) {
    return request({
        url: `/ins/emp/custom/applyManage/renewal`,
        method: 'get',
        params:page
    })
}

// 获取日期最大的一条保单
export function insEmpCustomApplyManageGetMaxTimeApply() {
    return request({
        url: `/ins/emp/custom/applyManage/getMaxTimeApply`,
        method: 'get',
    })
}

// 删除续保被保人列表数据
export function insEmpCustomApplyManageRenewalDel(id) {
    return request({
        url: `/ins/emp/custom/applyManage/renewal/${id}`,
        method: 'delete',
    })
}

// 查询续保被保人列表
export function insEmpCustomApplyManageRenewalList(page) {
    return request({
        url: `/ins/emp/custom/applyManage/renewal/list`,
        method: 'get',
        params:page
    })
}

// 新增续保被保人列表
export function insEmpCustomApplyManageRenewalPost(data) {
    return request({
        url: '/ins/emp/custom/applyManage/renewal',
        method: 'post',
        data: data
    })
}

// 雇主定制 批单管理
// 查询批单列表
export function insEmpCustomReviseList(page) {
    return request({
        url: `/ins/emp/custom/revise/list`,
        method: 'get',
        params:page
    })
}

// 查看详情
export function insEmpCustomReviseDetail(id) {
    return request({
        url: `/ins/emp/custom/revise/detail/${id}`,
        method: 'get',
    })
}

// 提交申报
export function insEmpCustomReviseApply(data) {
    return request({
        url: '/ins/emp/custom/revise/apply',
        method: 'put',
        params: data
    })
}

// 查看详情
export function insEmpCustomRevise(id) {
    return request({
        url: `/ins/emp/custom/revise/${id}`,
        method: 'get',
    })
}

// 导出保单管理列表
export function insEmpCustomApplyManageExportEmpCustomApply(data) {
    return request({
        url: `/ins/emp/custom/applyManage/exportEmpCustomApply`,
        method: 'get',
        params: data
    })
}

// 导出保单管理列表查看被保人信息列表
export function insEmpCustomApplyManageExportEmpCustomDetail(data) {
    return request({
        url: `/ins/emp/custom/applyManage/exportEmpCustomDetail`,
        method: 'get',
        params: data
    })
}

// 查询当前时间是否可以询价
export function insEmpCustomPriceApplyAllowPrice() {
    return request({
        url: `/ins/emp/custom/priceApply/allowPrice`,
        method: 'get',
    })
}

// 申报失败申请退款
export function insEmpApplyManageApplyReturnMoney(applyId) {
    return request({
        url: `/ins/emp/apply/manage/applyReturnMoney/${applyId}`,
        method: 'put',
    })
}

// 重新提交退保申请
export function insEmpApplyManageReturnAgain(id) {
    return request({
        url: `/ins/emp/apply/manage/return/again/${id}`,
        method: 'put',
    })
}

// 新增失败申请退款
export function insEmpApplyManageNewApplyReturnMoney(id) {
    return request({
        url: `/ins/emp/apply/manage/new/applyReturnMoney/${id}`,
        method: 'put',
    })
}
// 申报失败重新提交
export function insEmpApplyManageApplyAgain(id) {
    return request({
        url: `/ins/emp/apply/manage/apply/again/${id}`,
        method: 'get',
    })
}

// 新增失败重新提交
export function insEmpApplyManageNewAgain(id) {
    return request({
        url: `/ins/emp/apply/manage/new/again/${id}`,
        method: 'get',
    })
}

// 查询是否允许续保
export function insEmpCustomApplyManageAllowRenewal(){
    return request({
        url:`/ins/emp/custom/applyManage/allowRenewal`,
        method:'get'
    })
}

// 雇主定制提交申报校验身份证是否重复
export function insEmpCustomApplyValidRepeatIdCard(data){
    return request({
        url:`/ins/emp/custom/apply/validRepeatIdCard`,
        method:'post',
        data:data
    })
}

// 雇主定制↑


// 保险公司产品方案
// 获取公众或物业险详情
export function insPlanGet(page) {
    return request({
        url: `/ins/plan`,
        method: 'get',
        params:page
    })
}
// 修改物业或公众险方案
export function insPlanPut(page) {
    return request({
        url: `/ins/plan`,
        method: 'put',
        data:page
    })
}

// 添加物业公众险方案
export function insPlanPost(page) {
    return request({
        url: `/ins/plan`,
        method: 'post',
        data:page
    })
}

// 根据保单id查看保单文件
export function insEmpCustomApplyManageApplyFile(id) {
    return request({
        url: `/ins/emp/custom/applyManage/applyFile/${id}`,
        method: 'get',
    })
}
// 根据查询详情
export function insEmpProduct(id) {
    return request({
        url: `/ins/emp/product/${id}`,
        method: 'get',
    })
}
 


// 雇主险 ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓

// 申报
export function insEmpApply(page) {
    return request({
        url: `/ins/emp/apply`,
        method: 'post',
        data:page
    })
}

// 保单管理列表
export function insEmpApplyManage(page) {
    return request({
        url: `/ins/emp/apply/manage`,
        method: 'get',
        params:page
    })
}

// 保单管理新增列表
export function insEmpApplyManageNew(page) {
    return request({
        url: `/ins/emp/apply/manage/new`,
        method: 'get',
        params:page
    })
}

// 查询当前日期是否可以选择年或月或日
export function insEmpApplyAllowChoice() {
    return request({
        url: `/ins/emp/apply/allowChoice`,
        method: 'get',
    })
}

// 申报详情
export function insEmpApplyId(id) {
    return request({
        url: `/ins/emp/apply/${id}`,
        method: 'get',
    })
}

// 申报新增
export function insEmpApplyNew(page) {
    return request({
        url: `/ins/emp/apply/new`,
        method: 'post',
        data:page
    })
}
// 保单管理新增列表查看列表
export function insEmpApplyManageNewDetail(page) {
    return request({
        url: `/ins/emp/apply/manage/new/detail`,
        method: 'get',
        params:page
    })
}

// 保单管理查看
export function insEmpApplyManageDetail(page) {
    return request({
        url: `/ins/emp/apply/manage/detail`,
        method: 'get',
        params:page
    })
}

// 根据名字搜索允许退保的人
export function insEmpApplyManageReturnAllow(page) {
    return request({
        url: `/ins/emp/apply/manage/return/allow`,
        method: 'get',
        params:page
    })
}

// 查询退保列表
export function insEmpApplyManageReturnList(page) {
    return request({
        url: `/ins/emp/apply/manage/return/list`,
        method: 'get',
        params:page
    })
}
// 提交退保
export function insEmpApplyManageReturn(id) {
    return request({
        url: `/ins/emp/apply/manage/return/${id}`,
        method: 'put',
    })
}

// 导出保单管理查看列表
export function insEmpApplyManageDetailExport(page) {
    return request({
        url: `/ins/emp/apply/manage/detail/export`,
        method: 'get',
        params:page
    })
}
// 导出保单列表
export function insEmpApplyManageExportInsPubDetailApply(page) {
    return request({
        url: `/ins/emp/apply/manage/exportInsPubDetailApply`,
        method: 'get',
        params:page
    })
}

// 下载模板
export function insEmpApplyExportTemplate() {
    return request({
        url: `/ins/emp/apply/dowload/template`,
        method: 'get',
    })
}

// ins/emp/apply/import
export function insEmpApplyImport(data) {
    return request({
        url: `/ins/emp/apply/import`,
        method: 'post',
        headers: {
            "Content-Type": "multipart/form-data"
        },
        data: data
    })
}

// 获取可以选择的天日期
export function insEmpApplyAllowDayTime(page) {
    return request({
        url: `/ins/emp/apply/allow/dayTime`,
        method: 'get',
        params:page
    })
}

// 查询详情，生成保单需要
export function insEmpApplyGetById(id) {
    return request({
        url: `/ins/emp/apply/getById/${id}`,
        method: 'get',
    })
}

// 雇主责任险批改列表
export function insEmpReviseList(page) {
    return request({
        url: `/ins/emp/revise/list`,
        method: 'get',
        params:page
    })
}

// 根据名字搜索允许退保的人
export function insEmpReviseReturnAllow(page) {
    return request({
        url: `/ins/emp/revise/return/allow`,
        method: 'get',
        params:page
    })
}

// 雇主责任险批改申请
export function insEmpRevise(page) {
    return request({
        url: `/ins/emp/revise`,
        method: 'post',
        data:page
    })
}

// 根据批改id查询详情
export function insEmpReviseDetailList(page) {
    return request({
        url: `/ins/emp/revise/detail/list`,
        method: 'get',
        params:page
    })
}

// 批改失败重新提交
export function insEmpReviseAgainCommit(reviseId) {
    return request({
        url: `/ins/emp/revise/again/commit/${reviseId}`,
        method: 'get',
    })
}

// 查询是否允许申请批改
export function insEmpReviseGetAllowRevise(id) {
    return request({
        url: `/ins/emp/revise/getAllowRevise/${id}`,
        method: 'get',
    })
}

// 获取电子凭证所需信息
export function insEmpApplyManageGetCertInfo(id) {
    return request({
        url: `/ins/emp/apply/manage/getCertInfo/${id}`,
        method: 'get',
    })
}

// 获取电子批单所需信息
export function insEmpReviseGetReviseFileInfo(id) {
    return request({
        url: `/ins/emp/revise/getReviseFileInfo/${id}`,
        method: 'get',
    })
}


// 雇主险 ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑



// 营销活动↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
// 新增活动
export function systemActivity(page) {
    return request({
        url: `/system/activity`,
        method: 'post',
        data:page
    })
}
// 查询所有物业
export function systemActivityGetProperty(page) {
    return request({
        url: `/system/activity/getProperty`,
        method: 'get',
        params:page
    })
}

// 查询所有省、市、区
export function systemActivityGetProvinces() {
    return request({
        url: `/system/activity/getProvinces`,
        method: 'get',
    })
}

// 查询活动列表
export function systemActivityList(page) {
    return request({
        url: `/system/activity/list`,
        method: 'get',
        params:page
    })
}

// 获取活动详细信息
export function systemActivityId(id) {
    return request({
        url: `/system/activity/${id}`,
        method: 'get',
    })
}

// 免费赠送
export function systemActivitySetActivity(page) {
    return request({
        url: `/system/activity/setActivity`,
        method: 'post',
        data:page
    })
}

// 根据活动id查询物业接口
export function systemActivityGetCompany(id) {
    return request({
        url: `/system/activity/getCompany/${id}`,
        method: 'get',
    })
}

// 修改活动
export function systemActivityPut(page) {
    return request({
        url: `/system/activity`,
        method: 'put',
        data:page
    })
}


// 营销活动↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

// 流水查看
// 获取保费记录列表
export function systemPremiumRecord(page) {
    return request({
        url: `/system/premium/record`,
        method: 'get',
        params:page
    })
}






// 公众责任险↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
// 提交资料 1
export function insPub(data) {
    return request({
        url: '/ins/pub',
        method: 'post',
        data: data
    })
} 
// 确认付款 1
export function insPubConfirmPay(data) {
    // console.log(data, '请求');

    return request({
        url: '/ins/pub/confirmPay',
        method: 'post',
        data: data
    })
}
// 获取保单管理列表 1
export function getInsPub(data) {
    return request({
        url: `/ins/pub`,
        method: 'get',
        params: data
    })
}
// 导出保单管理列表 1
export function insPubExportInsPubApply(data) {
    return request({
        url: `/ins/pub/exportInsPubApply`,
        method: 'get',
        params: data
    })
}
// 计算保费
// ins/pub/getTotalPremium 1
export function insPubGetTotalPremium(data) {
    return request({
        url: '/ins/pub/getTotalPremium',
        method: 'post',
        data: data
    })
}
// 计算保费get 1
export function insPubGetTotalPremiumGet(id) {
    return request({
        url: `/ins/pub/getTotalPremium/${id}`,
        method: 'get',
    })
}
// 查看保单列表详情列表 1
export function insPubGetInsPubApplyDetailList(data) {
    return request({
        url: `/ins/pub/getInsPubApplyDetailList`,
        method: 'get',
        params: data
    })
}
// 导出保单详情列表 1
export function insPubExportInsPubDetailApply(data) {
    return request({
        url: `/ins/pub/exportInsPubDetailApply`,
        method: 'get',
        params: data
    })
}
// 根据id查看保单接口 1
export function insPubGetNewApplyDate(id) {
    return request({
        url: `/ins/pub/getNewApplyDate/${id}`,
        method: 'get',
    })
}
// 查询新增项目允许的选择的项目 1
export function insPubGetAllowProject(id) {
    return request({
        url: `/ins/pub/getAllowProject/${id}`,
        method: 'get',
    })
}
// 根据保单新增项目 1
export function insPubAddProject(data) {
    return request({
        url: '/ins/pub/addProject',
        method: 'post',
        data: data
    })
}
// 新增保单查看详情 1
export function insPubGetNewApplyList(page) {
    return request({
        url: `/ins/pub/getNewApplyList`,
        method: 'get',
        params: page
    })
}

// 新增保单查看详情 1
export function insPubGetNewApplyDetail(id) {
    return request({
        url: `/ins/pub/getNewApplyDetail/${id}`,
        method: 'get',
    })
}

// 退保列表 1
export function insPubGetReturnApplyList(page) {
    return request({
        url: `/ins/pub/getReturnApplyList`,
        method: 'get',
        params: page
    })
}

// 查看保险的项目详情 1
export function insPubGetApplyDetail(id) {
    return request({
        url: `/ins/pub/getApplyDetail/${id}`,
        method: 'get',
    })
}

// 退保申请 1
export function insPubReturnApply(page) {
    return request({
        url: `/ins/pub/returnApply`,
        method: 'get',
        params: page
    })
}

// 查看退保允许退保的项目 1
export function insPubGetAllowReturn(page) {
    return request({
        url: `/ins/pub/getAllowReturn`,
        method: 'get',
        params: page
    })
}

// 查询退保申请详情 1
export function insPubGetReturnApplyDetail(id) {
    return request({
        url: `/ins/pub/getReturnApplyDetail/${id}`,
        method: 'get',
    })
}

// 查询投保时间是否合法 1
export function insPubCheckDate(page) {
    return request({
        url: `/ins/pub/checkDate`,
        method: 'get',
        params: page
    })
}

// 根据保单id查看保单文件 1
export function insPubApplyFile(id) {
    return request({
        url: `/ins/pub/applyFile/${id}`,
        method: 'get',
    })
}

// 查询是否有待付款 
export function insPubGetWaitPay() {
    return request({
        url: `/ins/pub/getWaitPay`,
        method: 'get',
    })
}
// 续保 1
export function insPubRenewal() {
    return request({
        url: `/ins/pub/renewal`,
        method: 'get',
    })
}
// 查询续保项目列表 1
export function insPubRenewalList(page) {
    return request({
        url: `/ins/pub/renewalList`,
        method: 'get',
        params: page
    })
}

// 删除续保项目 1
export function insPubDelRenewalProject(id) {
    return request({
        url: `/ins/pub/delRenewalProject/${id}`,
        method: 'delete',
    })
}
// 查询退保新增项目允许的选择的项目 1

export function insPubRenewalGetAllowProject() {
    return request({
        url: `/ins/pub/renewal/getAllowProject`,
        method: 'get',
    })
}

// 新增续保项目 1
export function insPubRenewalPost(data) {
    return request({
        url: '/ins/pub/renewal',
        method: 'post',
        data: data
    })
}

// 查询是否允许续保
export function insPubAllowRenewal() {
    return request({
        url: `/ins/pub/allowRenewal`,
        method: 'get',
    })
}
// 公众责任险↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑


// 物业责任险↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
// 提交资料 2
export function insProp(data) {
    return request({
        url: '/ins/prop',
        method: 'post',
        data: data
    })
}
// 确认付款 2
export function insPropConfirmPay(data) {
    // console.log(data, '请求');

    return request({
        url: '/ins/prop/confirmPay',
        method: 'post',
        data: data
    })
}
// 获取保单管理列表 2
export function getInsProp(data) {
    return request({
        url: `/ins/prop`,
        method: 'get',
        params: data
    })
}
// 导出保单管理列表 2
export function insPropExportInsPubApply(data) {
    return request({
        url: `/ins/prop/exportInsPropApply`,
        method: 'get',
        params: data
    })
}
// 计算保费
// ins/prop/getTotalPremium 2
export function insPropGetTotalPremium(data) {
    return request({
        url: '/ins/prop/getTotalPremium',
        method: 'post',
        data: data
    })
}
// 计算保费get 2
export function insPropGetTotalPremiumGet(id) {
    return request({
        url: `/ins/prop/getTotalPremium/${id}`,
        method: 'get',
    })
}
// 查看保单列表详情列表 2
export function insPropGetInsPubApplyDetailList(data) {
    return request({
        url: `/ins/prop/getInsPropApplyDetailList`,
        method: 'get',
        params: data
    })
}
// 导出保单详情列表 2
export function insPropExportInsPubDetailApply(data) {
    return request({
        url: `/ins/prop/exportInsPropDetailApply`,
        method: 'get',
        params: data
    })
}
// 根据id查看保单接口 2
export function insPropGetNewApplyDate(id) {
    return request({
        url: `/ins/prop/getNewApplyDate/${id}`,
        method: 'get',
    })
}
// 查询新增项目允许的选择的项目 2
export function insPropGetAllowProject(id) {
    return request({
        url: `/ins/prop/getAllowProject/${id}`,
        method: 'get',
    })
}
// 根据保单新增项目 2
export function insPropAddProject(data) {
    return request({
        url: '/ins/prop/addProject',
        method: 'post',
        data: data
    })
}
// 新增保单查看详情 2
export function insPropGetNewApplyList(page) {
    return request({
        url: `/ins/prop/getNewApplyList`,
        method: 'get',
        params: page
    })
}

// 新增保单查看详情 2
export function insPropGetNewApplyDetail(id) {
    return request({
        url: `/ins/prop/getNewApplyDetail/${id}`,
        method: 'get',
    })
}

// 退保列表 2
export function insPropGetReturnApplyList(page) {
    return request({
        url: `/ins/prop/getReturnApplyList`,
        method: 'get',
        params: page
    })
}

// 查看保险的项目详情 2
export function insPropGetApplyDetail(id) {
    return request({
        url: `/ins/prop/getApplyDetail/${id}`,
        method: 'get',
    })
}

// 退保申请 2
export function insPropReturnApply(page) {
    return request({
        url: `/ins/prop/returnApply`,
        method: 'get',
        params: page
    })
}

// 查看退保允许退保的项目 2
export function insPropGetAllowReturn(page) {
    return request({
        url: `/ins/prop/getAllowReturn`,
        method: 'get',
        params: page
    })
}

// 查询退保申请详情 2
export function insPropGetReturnApplyDetail(id) {
    return request({
        url: `/ins/prop/getReturnApplyDetail/${id}`,
        method: 'get',
    })
}

// 查询投保时间是否合法 2
export function insPropCheckDate(page) {
    return request({
        url: `/ins/prop/checkDate`,
        method: 'get',
        params: page
    })
}

// 根据保单id查看保单文件 2
export function insPropApplyFile(id) {
    return request({
        url: `/ins/prop/applyFile/${id}`,
        method: 'get',
    })
}

// 查询是否有待付款 
export function insPropGetWaitPay() {
    return request({
        url: `/ins/prop/getWaitPay`,
        method: 'get',
    })
}
// 续保 2
export function insPropRenewal() {
    return request({
        url: `/ins/prop/renewal`,
        method: 'get',
    })
}
// 查询续保项目列表 2
export function insPropRenewalList(page) {
    return request({
        url: `/ins/prop/renewalList`,
        method: 'get',
        params: page
    })
}

// 删除续保项目 2
export function insPropDelRenewalProject(id) {
    return request({
        url: `/ins/prop/delRenewalProject/${id}`,
        method: 'delete',
    })
}
// 查询退保新增项目允许的选择的项目 2

export function insPropRenewalGetAllowProject() {
    return request({
        url: `/ins/prop/renewal/getAllowProject`,
        method: 'get',
    })
}

// 新增续保项目 2
export function insPropRenewalPost(data) {
    return request({
        url: '/ins/prop/renewal',
        method: 'post',
        data: data
    })
}

// 查询是否允许续保
export function insPropAllowRenewal() {
    return request({
        url: `/ins/prop/allowRenewal`,
        method: 'get',
    })
}

// 物业责任险↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑


// 交易记录↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
// 获取流水记录
export function systemPremiumRecordRunningList(data) {
    return request({
        url: `/system/premium/record/runningList`,
        method: 'get',
        params:data
    })
}
// 交易记录↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑



// 查询开启活动图片
export function systemActivityListImg(page) {
    return request({
        url: `/system/activity/list/img`,
        method: 'get',
        params:page
    })
}
