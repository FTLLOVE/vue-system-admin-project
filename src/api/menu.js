import httpUtil from '../utils/httpUtil'

/**
 * 获取菜单列表
 * @param {*} params 
 */
export function fetchMenuList(params) {
	return httpUtil.get("/api/menu/getMenuList", params)
}