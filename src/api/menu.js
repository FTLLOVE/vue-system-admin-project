import httpUtil from '../utils/httpUtil'

/**
 * 获取菜单列表
 * @param {*} params
 */
export function fetchMenuList(params) {
	return httpUtil.get("/api/menu/getMenuList", params)
}

/**
 * 新增菜单
 * @param params
 * @returns {Promise<R>}
 */
export function fetchAddMenu(params) {
	return httpUtil.post("/api/menu/addMenu")
}

/**
 * 更新菜单
 * @param params
 * @returns {Promise<unknown>}
 */
export function fetchUpdateMenu(params) {
	return httpUtil.put("/api/menu/updateMenu", params)
}

/**
 * 获取菜单详情
 * @param params
 * @returns {Promise<R>}
 */
export function fetchMenuDetail(params) {
	return httpUtil.get("/api/menu/getMenuDetail", params)
}

/**
 * 更新菜单状态
 * @param params
 * @returns {Promise<unknown>}
 */
export function fetchUpdateMenuStatus(params) {
	return httpUtil.delete("/api/menu/updateMenuStatus", params)
}
