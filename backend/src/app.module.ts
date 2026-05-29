import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuModule } from './menu/menu.module';
import { Menu } from './menu/menu.entity';
import * as path from 'path';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: path.join(__dirname, '../data/database.sqlite'),
      entities: [Menu],
      synchronize: true,
      logging: false,
    }),
    MenuModule,
  ],
})
export class AppModule {}
