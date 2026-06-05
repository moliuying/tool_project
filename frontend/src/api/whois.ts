import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 30000
})

export interface WhoisResult {
  domainName?: string
  registrar?: string
  registrationDate?: string
  expirationDate?: string
  updatedDate?: string
  nameServers?: string[]
  status?: string[]
  registrantName?: string
  registrantOrganization?: string
  registrantEmail?: string
  registrantPhone?: string
  registrantCountry?: string
  adminName?: string
  adminOrganization?: string
  adminEmail?: string
  techName?: string
  techOrganization?: string
  techEmail?: string
  rawData?: string
}

export const whoisApi = {
  lookup: (domain: string) => api.get<WhoisResult>(`/whois/${encodeURIComponent(domain)}`)
}
