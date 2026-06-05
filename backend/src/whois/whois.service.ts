import { Injectable } from '@nestjs/common';
import * as whois from 'whois-json';

export interface WhoisResult {
  domainName?: string;
  registrar?: string;
  registrationDate?: string;
  expirationDate?: string;
  updatedDate?: string;
  nameServers?: string[];
  status?: string[];
  registrantName?: string;
  registrantOrganization?: string;
  registrantEmail?: string;
  registrantPhone?: string;
  registrantCountry?: string;
  adminName?: string;
  adminOrganization?: string;
  adminEmail?: string;
  techName?: string;
  techOrganization?: string;
  techEmail?: string;
  rawData?: string;
}

@Injectable()
export class WhoisService {
  async lookup(domain: string): Promise<WhoisResult> {
    try {
      const result = await whois(domain, { follow: 3 });
      return this.parseWhoisResult(result, domain);
    } catch (error) {
      throw new Error(`WHOIS 查询失败: ${error.message}`);
    }
  }

  private parseWhoisResult(raw: any, domain: string): WhoisResult {
    const result: WhoisResult = {
      domainName: this.extractValue(raw, ['domainName', 'Domain Name', 'domain']),
      registrar: this.extractValue(raw, ['registrar', 'Registrar', 'Registrar Name']),
      registrationDate: this.extractValue(raw, ['creationDate', 'Creation Date', 'created', 'Registered on', 'registrationDate']),
      expirationDate: this.extractValue(raw, ['expirationDate', 'Expiration Date', 'expires', 'Expiry date', 'Registry Expiry Date']),
      updatedDate: this.extractValue(raw, ['updatedDate', 'Updated Date', 'modified', 'Last Modified']),
      nameServers: this.extractNameServers(raw),
      status: this.extractStatus(raw),
      registrantName: this.extractValue(raw, ['registrantName', 'Registrant Name', 'Registrant']),
      registrantOrganization: this.extractValue(raw, ['registrantOrganization', 'Registrant Organization', 'Org']),
      registrantEmail: this.extractValue(raw, ['registrantEmail', 'Registrant Email', 'Email']),
      registrantPhone: this.extractValue(raw, ['registrantPhone', 'Registrant Phone', 'Phone']),
      registrantCountry: this.extractValue(raw, ['registrantCountry', 'Registrant Country', 'Country']),
      adminName: this.extractValue(raw, ['adminName', 'Admin Name', 'Administrative Contact Name']),
      adminOrganization: this.extractValue(raw, ['adminOrganization', 'Admin Organization']),
      adminEmail: this.extractValue(raw, ['adminEmail', 'Admin Email']),
      techName: this.extractValue(raw, ['techName', 'Tech Name', 'Technical Contact Name']),
      techOrganization: this.extractValue(raw, ['techOrganization', 'Tech Organization']),
      techEmail: this.extractValue(raw, ['techEmail', 'Tech Email']),
      rawData: typeof raw === 'string' ? raw : JSON.stringify(raw, null, 2),
    };

    if (!result.domainName) {
      result.domainName = domain;
    }

    return result;
  }

  private extractValue(obj: any, keys: string[]): string {
    for (const key of keys) {
      if (obj[key]) {
        return String(obj[key]).trim();
      }
      const lowerKey = key.toLowerCase();
      if (obj[lowerKey]) {
        return String(obj[lowerKey]).trim();
      }
    }
    return '';
  }

  private extractNameServers(obj: any): string[] {
    const keys = ['nameServers', 'Name Server', 'nameservers', 'Name Servers', 'nserver'];
    
    for (const key of keys) {
      if (obj[key]) {
        if (Array.isArray(obj[key])) {
          return obj[key].map((ns: string) => ns.trim()).filter(Boolean);
        } else if (typeof obj[key] === 'string') {
          return obj[key].split(/[\s,]+/).map((ns: string) => ns.trim()).filter(Boolean);
        }
      }
    }
    
    const nameServers: string[] = [];
    for (let i = 1; i <= 10; i++) {
      const key = `Name Server ${i}`;
      if (obj[key]) {
        nameServers.push(String(obj[key]).trim());
      }
    }
    
    return nameServers;
  }

  private extractStatus(obj: any): string[] {
    const keys = ['status', 'Domain Status', 'Status', 'domainStatus'];
    
    for (const key of keys) {
      if (obj[key]) {
        if (Array.isArray(obj[key])) {
          return obj[key].map((s: string) => s.trim()).filter(Boolean);
        } else if (typeof obj[key] === 'string') {
          return obj[key].split(/[\s,]+/).map((s: string) => s.trim()).filter(Boolean);
        }
      }
    }
    
    return [];
  }
}
