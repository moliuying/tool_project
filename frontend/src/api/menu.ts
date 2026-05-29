import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000
})

export interface Menu {
  id: number
  name: string
  path: string
  icon: string
  parentId: number | null
  sort: number
  component: string
  createdAt: string
  updatedAt: string
  children?: Menu[]
}

export interface CreateMenuDto {
  name: string
  path: string
  icon: string
  parentId?: number | null
  sort?: number
  component: string
}

export interface UpdateMenuDto extends Partial<CreateMenuDto> {
  id: number
}

export const menuApi = {
  getMenuList: () => api.get<Menu[]>('/menu'),
  getMenuById: (id: number) => api.get<Menu>(`/menu/${id}`),
  createMenu: (data: CreateMenuDto) => api.post<Menu>('/menu', data),
  updateMenu: (id: number, data: Partial<CreateMenuDto>) => api.patch<Menu>(`/menu/${id}`, data),
  deleteMenu: (id: number) => api.delete(`/menu/${id}`)
}
