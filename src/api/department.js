import httpUtil from '../utils/httpUtil'

/**
 * 获取部门列表
 * @param {*} params 搜索条件
 */
export function fetchDepartmentList(params) {
	return httpUtil.get("/api/department/getDepartmentList", params)
}

/**
 * 获取部门详情
 * @param {*} params 
 */
export function fetchDepartmentDetail(params) {
	return httpUtil.get("/api/department/getDepartmentDetail", params)
}

/**
 * 新增部门
 * @param {*} params 
 */
export function fetchAddDepartment(params) {
	return httpUtil.post("/api/department/addDepartment", params)
}

/**
 * 更新部门
 * @param {*} params 
 */
export function fetchUpdateDepartment(params) {
	return httpUtil.put("/api/department/updateDepartment", params)
}

/**
 * 更新部门状态
 * @param {*} params 
 */
export function fetchUpdateDepartmentStatus(params) {
	return httpUtil.delete("/api/department/updateDepartmentStatus", params)
}
