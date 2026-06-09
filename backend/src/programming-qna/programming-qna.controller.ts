import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ProgrammingQnaService, ProgrammingAnswer } from './programming-qna.service';
import { AskQuestionDto } from './dto/ask-question.dto';

@Controller('programming-qna')
export class ProgrammingQnaController {
  constructor(private readonly programmingQnaService: ProgrammingQnaService) {}

  @Post('ask')
  async askQuestion(@Body() dto: AskQuestionDto): Promise<ProgrammingAnswer> {
    try {
      return this.programmingQnaService.askQuestion(dto);
    } catch (error: any) {
      throw new HttpException(
        error.message || '编程问题解答失败',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
