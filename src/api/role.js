import httpUtil from '../utils/httpUtil'

/**
 * 获取角色列表
 * @param {*} params 
 */
export function fetchRoleList(params) {
	return httpUtil.get("/api/role/getRoleList")
}