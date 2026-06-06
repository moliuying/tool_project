import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

export interface ExtensionInfo {
  id: string;
  name?: string;
  version?: string;
  size?: string;
}

export interface DownloadResult {
  success: boolean;
  fileName: string;
  buffer: Buffer;
  size: number;
}

@Injectable()
export class CrxDownloaderService {
  private readonly CRX_DOWNLOAD_URL = 'https://clients2.google.com/service/update2/crx';
  private readonly CHROME_VERSION = '120.0.0.0';
  private readonly OS = 'mac';
  private readonly ARCH = 'x64';

  extractExtensionId(input: string): string {
    const trimmed = input.trim();

    const idPattern = /^[a-p]{32}$/;
    if (idPattern.test(trimmed)) {
      return trimmed;
    }

    const webstorePattern = /chrome\.google\.com\/webstore\/detail\/[^/]+\/([a-p]{32})/;
    const match1 = trimmed.match(webstorePattern);
    if (match1 && match1[1]) {
      return match1[1];
    }

    const webstoreDetailPattern = /\/detail\/([a-p]{32})/;
    const match2 = trimmed.match(webstoreDetailPattern);
    if (match2 && match2[1]) {
      return match2[1];
    }

    const idExtractionPattern = /([a-p]{32})/;
    const match3 = trimmed.match(idExtractionPattern);
    if (match3 && match3[1]) {
      return match3[1];
    }

    throw new HttpException('无法从输入中解析扩展ID，请输入有效的Chrome扩展ID或Chrome Web Store链接', HttpStatus.BAD_REQUEST);
  }

  isValidExtensionId(id: string): boolean {
    return /^[a-p]{32}$/.test(id);
  }

  async getExtensionInfo(extensionId: string): Promise<ExtensionInfo> {
    const cleanId = this.extractExtensionId(extensionId);
    
    return {
      id: cleanId
    };
  }

  async downloadCrx(extensionId: string): Promise<DownloadResult> {
    const cleanId = this.extractExtensionId(extensionId);

    if (!this.isValidExtensionId(cleanId)) {
      throw new HttpException('无效的扩展ID格式', HttpStatus.BAD_REQUEST);
    }

    const downloadUrl = this.buildDownloadUrl(cleanId);

    try {
      const response = await axios.get(downloadUrl, {
        responseType: 'arraybuffer',
        headers: {
          'User-Agent': `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${this.CHROME_VERSION} Safari/537.36`
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        timeout: 120000,
        maxRedirects: 5,
        validateStatus: (status) => status >= 200 && status < 400
      });

      const buffer = Buffer.from(response.data);

      if (buffer.length < 100) {
        throw new HttpException('下载的文件过小，可能扩展不存在或已被下架', HttpStatus.NOT_FOUND);
      }

      const magic = buffer.toString('utf8', 0, 3);
      if (magic !== 'Cr2') {
        throw new HttpException('下载的文件不是有效的CRX格式', HttpStatus.BAD_REQUEST);
      }

      const fileName = `${cleanId}.crx`;

      return {
        success: true,
        fileName,
        buffer,
        size: buffer.length
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      if (error.response?.status === 404) {
        throw new HttpException('扩展不存在或已被下架', HttpStatus.NOT_FOUND);
      }

      throw new HttpException(
        `CRX 下载失败: ${error.message || '网络错误'}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  private buildDownloadUrl(extensionId: string): string {
    const params = new URLSearchParams({
      response: 'redirect',
      prodversion: this.CHROME_VERSION,
      acceptformat: 'crx2,crx3',
      x: `id=${extensionId}&uc`
    });

    return `${this.CRX_DOWNLOAD_URL}?${params.toString()}`;
  }

  formatSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
