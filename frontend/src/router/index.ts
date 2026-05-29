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
        path: '/js-tool',
        name: 'JsTool',
        redirect: '/js-tool/beautify',
        component: () => import('@/views/JsTool.vue'),
        children: [
          {
            path: 'beautify',
            name: 'JsBeautify',
            component: () => import('@/views/JsBeautify.vue')
          }
        ]
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
