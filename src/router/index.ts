import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useUserStore } from '@/store/modules/user'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/user/LoginView.vue')
  },
  {
    path: '/user/profile',
    name: 'profile',
    component: () => import(/* webpackChunkName: "userProfile" */ '../views/user/ProfileView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/stuff/publish',
    name: 'publish',
    component: () => import(/* webpackChunkName: "publish" */ '../views/stuff/PublishView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/stuff/list',
    name: 'stuffList',
    component: () => import(/* webpackChunkName: "stuffList" */ '../views/stuff/StuffListView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/stuff/barter',
    name: 'barter',
    component: () => import(/* webpackChunkName: "barter" */ '../views/stuff/BarterView.vue')
  },
  {
    path: '/stuff/transfer/:id',
    name: 'transfer',
    component: () => import(/* webpackChunkName: "transfer" */ '../views/stuff/TransferView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/stuff/exchange/:id',
    name: 'exchange',
    component: () => import(/* webpackChunkName: "exchange" */ '../views/stuff/ExchangeView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/stuff/trades',
    name: 'tradeList',
    component: () => import(/* webpackChunkName: "tradeList" */ '../views/stuff/TradeListView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/stuff/trade/:id',
    name: 'tradeDetail',
    component: () => import(/* webpackChunkName: "tradeDetail" */ '../views/stuff/TradeDetailView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/user/settings',
    name: 'settings',
    component: () => import(/* webpackChunkName: "settings" */ '../views/user/SettingsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/user/edit-profile',
    name: 'editProfile',
    component: () => import(/* webpackChunkName: "editProfile" */ '../views/user/EditProfileView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/user/address',
    name: 'addressList',
    component: () => import(/* webpackChunkName: "addressList" */ '../views/user/address/AddressListView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/user/address/new',
    name: 'addressNew',
    component: () => import(/* webpackChunkName: "addressEdit" */ '../views/user/address/AddressEditView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/user/address/edit/:id',
    name: 'addressEdit',
    component: () => import(/* webpackChunkName: "addressEdit" */ '../views/user/address/AddressEditView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/search',
    name: 'search',
    component: () => import(/* webpackChunkName: "search" */ '../views/SearchView.vue')
  },
  {
    path: '/square/item/detail/:id',
    name: 'itemDetail',
    component: () => import(/* webpackChunkName: "itemDetail" */ '../views/square/ItemDetailView.vue')
  },
  {
    path: '/stuff/detail/:id',
    name: 'stuffDetail',
    component: () => import(/* webpackChunkName: "stuffDetail" */ '../views/stuff/StuffDetailView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/notification',
    name: 'Notification',
    component: () => import('@/views/notification/NotificationView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/notification/detail/:id',
    name: 'NotificationDetail',
    component: () => import('@/views/notification/NotificationDetailView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/user/security',
    name: 'security',
    component: () => import(/* webpackChunkName: "security" */ '../views/user/SecurityView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/audit/:id',
    name: 'audit',
    component: () => import(/* webpackChunkName: "audit" */ '../views/audit/AuditView.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  // 检查路由是否需要认证
  if (to.meta.requiresAuth) {
    // 检查用户是否登录（有token且有用户信息）
    if (userStore.token && userStore.userInfo) {
      next()
    } else {
      // 未登录，重定向到登录页
      next({
        path: '/login',
        query: { redirect: to.fullPath } // 保存原路径
      })
    }
  } else {
    // 不需要认证的路由，直接通过
    next()
  }
})

export default router
