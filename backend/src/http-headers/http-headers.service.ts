import { Injectable } from '@nestjs/common';
import axios, { AxiosRequestConfig, Method } from 'axios';

export interface HttpHeadersResult {
  url: string;
  method: string;
  status: number;
  statusText: string;
  responseTime: number;
  headers: Record<string, string>;
  redirects?: string[];
  finalUrl?: string;
}

export interface HttpHeadersRequest {
  url: string;
  method?: Method;
  followRedirects?: boolean;
  timeout?: number;
  customHeaders?: Record<string, string>;
}

@Injectable()
export class HttpHeadersService {
  async checkHeaders(request: HttpHeadersRequest): Promise<HttpHeadersResult> {
    const {
      url,
      method = 'GET',
      followRedirects = true,
      timeout = 15000,
      customHeaders = {}
    } = request;

    const cleanUrl = this.normalizeUrl(url);

    const startTime = Date.now();

    const config: AxiosRequestConfig = {
      method,
      url: cleanUrl,
      timeout,
      maxRedirects: followRedirects ? 10 : 0,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; HttpHeadersChecker/1.0)',
        'Accept': '*/*',
        ...customHeaders
      },
      validateStatus: () => true,
      responseType: 'text'
    };

    try {
      const response = await axios(config);
      const responseTime = Date.now() - startTime;

      const normalizedHeaders = this.normalizeHeaders(response.headers);

      const result: HttpHeadersResult = {
        url: cleanUrl,
        method: method.toUpperCase(),
        status: response.status,
        statusText: response.statusText,
        responseTime,
        headers: normalizedHeaders,
        finalUrl: response.request?.res?.responseUrl || cleanUrl
      };

      if (response.request?.res?.redirects?.length > 0) {
        result.redirects = response.request.res.redirects;
      }

      return result;
    } catch (error: any) {
      if (error.response) {
        const responseTime = Date.now() - startTime;
        return {
          url: cleanUrl,
          method: method.toUpperCase(),
          status: error.response.status,
          statusText: error.response.statusText || 'Error',
          responseTime,
          headers: this.normalizeHeaders(error.response.headers || {})
        };
      }
      throw new Error(`请求失败: ${error.message}`);
    }
  }

  private normalizeUrl(url: string): string {
    let clean = url.trim();
    if (!/^https?:\/\//i.test(clean)) {
      clean = 'https://' + clean;
    }
    return clean;
  }

  private normalizeHeaders(headers: Record<string, any>): Record<string, string> {
    const normalized: Record<string, string> = {};
    for (const [key, value] of Object.entries(headers)) {
      normalized[key] = Array.isArray(value) ? value.join(', ') : String(value);
    }
    return normalized;
  }
}
