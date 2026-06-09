import { Module } from '@nestjs/common';
import { ProgrammingQnaService } from './programming-qna.service';
import { ProgrammingQnaController } from './programming-qna.controller';

@Module({
  controllers: [ProgrammingQnaController],
  providers: [ProgrammingQnaService],
})
export class ProgrammingQnaModule {}
