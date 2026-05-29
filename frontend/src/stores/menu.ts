import { defineStore } from 'pinia'
import { ref } from 'vue'
import { menuApi, type Menu } from '@/api/menu'

export const useMenuStore = defineStore('menu', () => {
  const menuList = ref<Menu[]>([])
  const loading = ref(false)

  const fetchMenuList = async () => {
    loading.value = true
    try {
      const { data } = await menuApi.getMenuList()
      menuList.value = data
    } catch (error) {
      console.error('Failed to fetch menu list:', error)
    } finally {
      loading.value = false
    }
  }

  return {
    menuList,
    loading,
    fetchMenuList
  }
})
