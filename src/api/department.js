import httpUtil from '../utils/httpUtil'

/**
 * 获取部门列表
 * @param {*} params 搜索条件
 */
export function fetchDepartmentList(params) {
	return httpUtil.get("/api/department/getDepartmentList", params)
}