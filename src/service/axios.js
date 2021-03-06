import axios from 'axios';
import router from '../router';
import { Loading, Message } from 'element-ui';
// 全局axios请求loading加载
let options = {
	lock: true,
	text: '',
	spinner: 'el-icon-loading',
	background: 'rgba(0, 0, 0, 0.7)'
},
	loadingPage

const BASE_URL = "http://175.24.95.198:8099/"
let headers = {
	Accept: 'application/json;charset=utf-8',
	'Content-Type': 'application/json;charset=utf-8'
}
// axios配置参数
axios.defaults.baseUrl = BASE_URL
axios.defaults.headers = headers
axios.defaults.timeout = 5000

// 请求拦截器
axios.interceptors.request.use(config => {
	let jwtToken = localStorage.getItem("token")
	if (jwtToken) {
		config.headers.token = jwtToken
	}
	if (config.method === 'get') {
		config.params = {
			t: Date.parse(new Date()) / 1000,
			...config.params
		}
	}
	loadingPage = Loading.service(options);
	return config
},
	error => {
		loadingPage.close()
		return Promise.reject(error)
	}
)

//  响应拦截器
axios.interceptors.response.use(response => {
	// code=401，表示无权限
	if (response.data.code === 401) {
		loadingPage.close()
		Message.error(response.data.message)
		router.replace('/login')
		return
	} else {
		loadingPage.close()
		return response.data
	}
},
	error => {
		loadingPage.close()
		if (error.response.data.code === 500) {
			router.push('/login')
		}

	}
)

export default axios
