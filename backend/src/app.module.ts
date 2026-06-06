import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuModule } from './menu/menu.module';
import { Menu } from './menu/menu.entity';
import { HolidayModule } from './holiday/holiday.module';
import { Holiday } from './holiday/holiday.entity';
import { WhoisModule } from './whois/whois.module';
import { HttpHeadersModule } from './http-headers/http-headers.module';
import { CrxDownloaderModule } from './crx-downloader/crx-downloader.module';
import * as path from 'path';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: path.join(__dirname, '../data/database.sqlite'),
      entities: [Menu, Holiday],
      synchronize: true,
      logging: false,
    }),
    MenuModule,
    HolidayModule,
    WhoisModule,
    HttpHeadersModule,
    CrxDownloaderModule,
  ],
})
export class AppModule {}
