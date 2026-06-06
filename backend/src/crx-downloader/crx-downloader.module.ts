import { Module } from '@nestjs/common';
import { CrxDownloaderService } from './crx-downloader.service';
import { CrxDownloaderController } from './crx-downloader.controller';

@Module({
  controllers: [CrxDownloaderController],
  providers: [CrxDownloaderService],
})
export class CrxDownloaderModule {}
