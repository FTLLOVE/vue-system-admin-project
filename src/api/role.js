import httpUtil from '../utils/httpUtil'

/**
 * 获取角色列表
 * @param {*} params 
 */
export function fetchRoleList(params) {
	return httpUtil.get("/api/role/getRoleList")
}

/**
 * 新增角色
 * @param {*} params 
 */
export function fetchAddRole(params) {
	return httpUtil.post("/api/role/addRole")
}

/**
 * 更新角色
 * @param {*} params 
 */
export function fetchUpdateRole(params) {
	return httpUtil.put("/api/role/updateRole", params)
}

/**
 * 获取角色详情
 * @param {*} params 
 */
export function fetchRoleDetail(params) {
	return httpUtil.get("/api/role/getRoleDetail", params)
}

/**
 * 更新角色状态
 * @param {*} params 
 */
export function fetchUpdateRoleStatus(params) {
	return httpUtil.delete("/api/role/updateRoleStatus", params)
}