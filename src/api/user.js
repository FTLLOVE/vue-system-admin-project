import httpUtil from '../utils/httpUtil'

/**
 * 获取用户列表
 * @param {*} params 搜索条件
 */
export function fetchUserList(params) {
	return httpUtil.get("/api/user/getUserList", params)
}

/**
 * 新增用户
 * @param {*} params 新增条件
 */
export function fetchAddUser(params) {
	return httpUtil.post("/api/user/addUser", params)
}

/**
 * 更新
 * @param {*} params 更新条件
 */
export function fetchUpdateUser(params) {
	return httpUtil.put("/api/user/updateUser", params)
}

/**
 * 重置密码
 * @param {*} params 
 */
export function fetchResetPassword(params) {
	return httpUtil.put("/api/user/resetPassword", params)
}

/**
 * 获取用户详情
 * @param {*} params 
 */
export function fetchUserDetail(params) {
	return httpUtil.get("/api/user/getUserDetail", params)
}

/**
 * 更新用户状态
 * @param {*} params 
 */
export function fetchUserStatus(params) {
	return httpUtil.delete("/api/user/updateUserStatus", params)
}