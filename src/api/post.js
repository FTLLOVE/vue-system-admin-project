import httpUtil from '../utils/httpUtil'

/**
 * 获取岗位列表
 * @param {*} params
 */
export function fetchPostList(params) {
	return httpUtil.get("/api/post/getPostList", params)
}

/**
 * 新增岗位
 * @param {*} params
 */
export function fetchAddPost(params) {
	return httpUtil.post("/api/post/addPost", params)
}

/**
 * 获取岗位详情
 * @param {*} params
 */
export function fetchPostDetail(params) {
	return httpUtil.get("/api/post/getPostDetail", params)
}

/**
 * 更新岗位
 * @param {*} params
 */
export function fetchUpdatePost(params) {
	return httpUtil.put("/api/post/updatePost", params)
}

/**
 * 更新岗位状态
 * @param {*} params
 */
export function fetchUpdatePostStatus(params) {
	return httpUtil.delete("/api/post/updatePostStatus", params)
}
