import { Controller, Get, Post, Body, Param, Res, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { CrxDownloaderService, ExtensionInfo } from './crx-downloader.service';

interface ParseRequest {
  input: string;
}

interface DownloadRequest {
  input: string;
}

@Controller('crx')
export class CrxDownloaderController {
  constructor(private readonly crxDownloaderService: CrxDownloaderService) {}

  @Post('parse')
  parseInput(@Body() body: ParseRequest): ExtensionInfo {
    try {
      if (!body.input || !body.input.trim()) {
        throw new HttpException('请输入Chrome扩展ID或Chrome Web Store链接', HttpStatus.BAD_REQUEST);
      }
      const extensionId = this.crxDownloaderService.extractExtensionId(body.input);
      return {
        id: extensionId
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || '解析失败',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post('download')
  async downloadCrx(@Body() body: DownloadRequest, @Res() res: Response) {
    try {
      if (!body.input || !body.input.trim()) {
        throw new HttpException('请输入Chrome扩展ID或Chrome Web Store链接', HttpStatus.BAD_REQUEST);
      }

      const result = await this.crxDownloaderService.downloadCrx(body.input);

      res.setHeader('Content-Type', 'application/x-chrome-extension');
      res.setHeader('Content-Disposition', `attachment; filename="${result.fileName}"`);
      res.setHeader('Content-Length', result.size.toString());
      res.setHeader('X-Extension-Id', result.fileName.replace('.crx', ''));
      res.setHeader('X-File-Size', this.crxDownloaderService.formatSize(result.size));

      res.send(result.buffer);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || '下载失败',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('download/:extensionId')
  async downloadCrxById(@Param('extensionId') extensionId: string, @Res() res: Response) {
    try {
      if (!extensionId || !extensionId.trim()) {
        throw new HttpException('请提供扩展ID', HttpStatus.BAD_REQUEST);
      }

      const result = await this.crxDownloaderService.downloadCrx(extensionId);

      res.setHeader('Content-Type', 'application/x-chrome-extension');
      res.setHeader('Content-Disposition', `attachment; filename="${result.fileName}"`);
      res.setHeader('Content-Length', result.size.toString());
      res.setHeader('X-Extension-Id', result.fileName.replace('.crx', ''));
      res.setHeader('X-File-Size', this.crxDownloaderService.formatSize(result.size));

      res.send(result.buffer);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || '下载失败',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
