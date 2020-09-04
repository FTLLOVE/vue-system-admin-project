import httpUtil from '../utils/httpUtil'

/**
 * 获取岗位列表
 * @param {*} params 
 */
export function fetchPostList(params) {
	return httpUtil.get("/api/post/getPostList")
}