import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/Home.vue')
      },
      {
        path: '/menu',
        name: 'Menu',
        component: () => import('@/views/Menu.vue')
      },
      {
        path: '/system/menu',
        name: 'SystemMenu',
        component: () => import('@/views/Menu.vue')
      },
      {
        path: '/loan-calculator',
        name: 'LoanCalculator',
        component: () => import('@/views/LoanCalculator.vue')
      },
      {
        path: '/random-picker',
        name: 'RandomPicker',
        component: () => import('@/views/RandomPicker.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
