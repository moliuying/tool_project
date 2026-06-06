import { Module } from '@nestjs/common';
import { HttpHeadersService } from './http-headers.service';
import { HttpHeadersController } from './http-headers.controller';

@Module({
  controllers: [HttpHeadersController],
  providers: [HttpHeadersService],
})
export class HttpHeadersModule {}
