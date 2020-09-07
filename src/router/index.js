import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
	routes: [
		{
			path: '/',
			redirect: '/login'
		},
		{
			path: '/',
			component: () => import('../components/Home.vue'),
			meta: { title: 'home' },
			children: [
				{
					path: 'dashboard',
					component: () => import('../pages/dashboard'),
					meta: { title: '系统首页' }
				},
				{
					path: 'user',
					component: () => import('../pages/user'),
					meta: { title: '用户管理' }
				},
				{
					path: 'role',
					component: () => import('../pages/role'),
					meta: { title: '角色管理' }
				},
			]
		},
		{
			path: '/login',
			component: () => import('../pages/login'),
			meta: { title: '登录' }
		}
	]
})