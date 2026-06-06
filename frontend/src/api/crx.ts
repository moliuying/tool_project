import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 120000
})

export interface ExtensionInfo {
  id: string
  name?: string
  version?: string
  size?: string
}

export const crxApi = {
  parse: (input: string) => api.post<ExtensionInfo>('/crx/parse', { input }),

  download: (input: string) => {
    return api.post('/crx/download', { input }, {
      responseType: 'blob'
    })
  },

  downloadById: (extensionId: string) => {
    return api.get(`/crx/download/${extensionId}`, {
      responseType: 'blob'
    })
  }
}
