import { Controller, Post, Body, HttpException, HttpStatus, Get, Query } from '@nestjs/common';
import { HttpHeadersService, HttpHeadersResult, HttpHeadersRequest } from './http-headers.service';
import { Method } from 'axios';

@Controller('http-headers')
export class HttpHeadersController {
  constructor(private readonly httpHeadersService: HttpHeadersService) {}

  @Post('check')
  async checkHeaders(@Body() body: HttpHeadersRequest): Promise<HttpHeadersResult> {
    try {
      if (!body.url || !body.url.trim()) {
        throw new HttpException('请输入目标网址', HttpStatus.BAD_REQUEST);
      }

      const validMethods: Method[] = ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'];
      if (body.method && !validMethods.includes(body.method.toUpperCase() as Method)) {
        throw new HttpException('无效的HTTP请求方法', HttpStatus.BAD_REQUEST);
      }

      return await this.httpHeadersService.checkHeaders(body);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'HTTP头查询失败',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('check')
  async checkHeadersGet(
    @Query('url') url: string,
    @Query('method') method?: string
  ): Promise<HttpHeadersResult> {
    try {
      if (!url || !url.trim()) {
        throw new HttpException('请输入目标网址', HttpStatus.BAD_REQUEST);
      }

      return await this.httpHeadersService.checkHeaders({
        url,
        method: method as Method
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'HTTP头查询失败',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
