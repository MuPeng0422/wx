import Vue from 'vue'
import App from './App'
import store from './store'

// 引入全局uView
import uView from 'uview-ui'
Vue.use(uView)

Vue.config.productionTip = false
Vue.prototype.$store = store

App.mpType = 'app'

const app = new Vue({
	store,
    ...App
})

// http拦截器，将此部分放在new Vue()和app.$mount()之间，才能App.vue中正常使用
import httpInterceptor from '@/common/http.httpInterceptor.js'
Vue.use(httpInterceptor, app)

app.$mount()
