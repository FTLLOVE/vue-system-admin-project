import axios from '../service/axios'
import qs from 'querystring'
import { resolve } from 'path';
import { reject } from 'core-js/fn/promise';

/**
 * http请求
 */
export default class httpUtil {

	/**
	 * get请求
	 * @param url
	 * @param params
	 * @returns {Promise<R>}
	 */
	static get(url, params) {
		return new Promise(async (resolve, reject) => {
			try {
				let query = await qs.stringify(params);
				let res = null;
				if (!params) {
					res = await axios.get(url);
				} else {
					res = await axios.get(url + '?' + query);
				}
				resolve(res);
			} catch (error) {
				let errorMsg = `请求报错路径： ${url} \n 请求错误信息: ${error}`;
				console.log(errorMsg)
				reject(error);
			}
		});
	}

	/**
	 * POST请求
	 * @param url
	 * @param params
	 * @returns {Promise<R>}
	 */
	static post(url, params) {
		return new Promise(async (resolve, reject) => {
			try {
				let res = await axios.post(url, params);
				resolve(res);
			} catch (error) {
				let errorMsg = `请求报错路径：${url} \n 请求错误信息: ${error}`;
				reject(error);
			}
		});
	}

	/**
	 * PUT请求
	 * @param {*} url 
	 * @param {*} params 
	 */
	static put(url, params) {
		return new Promise(async (resolve, reject) => {
			try {
				let res = await axios.put(url, params);
				resolve(res)
			} catch (error) {
				reject(error)
			}
		})
	}

	/**
	 * DELETE请求
	 * @param {*} url 
	 * @param {*} params 
	 */
	static delete(url, params) {
		return new Promise(async (resolve, reject) => {
			try {
				let query = await qs.stringify(params);
				let res = null;
				if (!params) {
					res = await axios.delete(url);
				} else {
					res = await axios.delete(url + '?' + query);
				}
				resolve(res);
			} catch (error) {
				reject(error);
			}
		})
	}
}
