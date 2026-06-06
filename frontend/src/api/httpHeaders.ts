import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 30000
})

export interface HttpHeadersResult {
  url: string
  method: string
  status: number
  statusText: string
  responseTime: number
  headers: Record<string, string>
  body?: string
  bodySize?: number
  bodyTruncated?: boolean
  contentType?: string
  redirects?: string[]
  finalUrl?: string
}

export interface HttpHeadersRequest {
  url: string
  method?: string
  followRedirects?: boolean
  timeout?: number
  customHeaders?: Record<string, string>
}

export const httpHeadersApi = {
  check: (request: HttpHeadersRequest) =>
    api.post<HttpHeadersResult>('/http-headers/check', request)
}
