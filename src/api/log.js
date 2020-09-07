import httpUtil from '../utils/httpUtil'


/**
 * 获取日志列表
 * @param {*} params 
 */
export function fetchLogList(params) {
	return httpUtil.get("/api/log/getLogList", params)
}