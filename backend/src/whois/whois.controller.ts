import { Controller, Get, Param, HttpException, HttpStatus } from '@nestjs/common';
import { WhoisService, WhoisResult } from './whois.service';

@Controller('whois')
export class WhoisController {
  constructor(private readonly whoisService: WhoisService) {}

  @Get(':domain')
  async lookup(@Param('domain') domain: string): Promise<WhoisResult> {
    try {
      const cleanDomain = this.cleanDomain(domain);
      if (!this.isValidDomain(cleanDomain)) {
        throw new HttpException('无效的域名格式', HttpStatus.BAD_REQUEST);
      }
      return await this.whoisService.lookup(cleanDomain);
    } catch (error) {
      throw new HttpException(
        error.message || 'WHOIS 查询失败',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  private cleanDomain(domain: string): string {
    let clean = domain.trim().toLowerCase();
    clean = clean.replace(/^https?:\/\//, '');
    clean = clean.replace(/^www\./, '');
    clean = clean.split('/')[0];
    return clean;
  }

  private isValidDomain(domain: string): boolean {
    const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$/;
    return domainRegex.test(domain);
  }
}
