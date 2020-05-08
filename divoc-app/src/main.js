import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import Login from './views/Login.vue'
import Student from './views/Student.vue'
import Teacher from './views/Teacher.vue'
import Register from './views/Register.vue'
import Host from './views/Host.vue'
import Watcher from './views/Watcher.vue'
import Canvas from './views/Canvas.vue'

Vue.use(VueRouter)

Vue.config.productionTip = false

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Login
    },
    {
      path: '/student',
      component: Student
    },
    {
      path: '/teacher',
      component: Teacher
    },
    {
      path: '/register',
      component: Register
    },
    {
      path: '/host',
      component: Host
    },
    {
      path: '/watcher',
      component: Watcher
    },
    {
      path: '/canvas',
      component: Canvas
    }
  ]
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
