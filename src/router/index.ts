import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'

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
  { path: '/publish', name: 'Publish', component: () => import('../views/PublishV1.vue') },
  { path: '/review', name: 'Review', component: () => import('../views/ReviewV1.vue') },
  { path: '/trade/:id', name: 'TradeDetail', component: () => import('../views/TradeDetail.vue') },
  { path: '/profile', name: 'Profile', component: () => import('../views/ProfileV1.vue') },
  { path: '/merchant', name: 'Merchant', component: () => import('../views/MerchantV1.vue') },
  { path: '/pay/:id', name: 'Pay', component: () => import('../views/PayV1.vue') },
  { path: '/search', name: 'Search', component: () => import('../views/SearchV1.vue') },
  {
    path: '/user/settings',
    name: 'settings',
    component: () => import(/* webpackChunkName: "settings" */ '../views/user/SettingsView.vue'),
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
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
