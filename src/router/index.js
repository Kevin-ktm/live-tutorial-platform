import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomePage.vue'),
    },
    {
      path: '/tutorials',
      name: 'tutorials',
      component: () => import('../views/TutorialList.vue'),
    },
    {
      // 重要：使用:id作为参数，确保路由能正确匹配
      path: '/tutorial/:id',
      name: 'tutorial',
      component: () => import('../views/TutorialDetail.vue'),
      props: (route) => ({ id: parseInt(route.params.id) }),
    },
    {
      path: '/categories',
      name: 'categories',
      component: () => import('../views/Categories.vue'),
    },
    {
      path: '/community',
      name: 'community',
      component: () => import('../views/Community.vue'),
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('../views/Search.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/Profile.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/Register.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFound.vue'),
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    // 如果路由中有hash，滚动到对应元素
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    }
    // 如果有保存的位置，则返回保存的位置
    if (savedPosition) {
      return savedPosition
    }
    // 否则滚动到顶部
    return { top: 0 }
  },
})

// 路由守卫：检查用户登录状态
router.beforeEach((to, from, next) => {
  console.log('路由跳转:', from.path, '->', to.path)

  // 需要登录的页面
  const requiresAuth = ['/profile']
  const isAuthRequired = requiresAuth.some((path) => to.path.startsWith(path))

  if (isAuthRequired) {
    // 检查用户是否登录
    const user = localStorage.getItem('user')
    if (!user) {
      // 如果没有登录，跳转到登录页
      ElMessage.warning('请先登录')
      next('/login')
      return
    }
  }

  next()
})

export default router
