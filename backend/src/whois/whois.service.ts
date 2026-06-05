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

interface FieldPattern {
  keys: string[];
  regex?: RegExp;
}

@Injectable()
export class WhoisService {
  private readonly fieldPatterns: Record<string, FieldPattern> = {
    domainName: {
      keys: ['domainName', 'Domain Name', 'domain', 'Domain', 'domain_name'],
      regex: /Domain\s+Name:?\s*([^\s\n]+)/i
    },
    registrar: {
      keys: ['registrar', 'Registrar', 'Registrar Name', 'Sponsoring Registrar'],
      regex: /(?:Registrar|Sponsoring\s+Registrar):?\s*([^\n]+)/i
    },
    registrationDate: {
      keys: ['creationDate', 'Creation Date', 'created', 'Registered on', 'registrationDate', 'Creation Date'],
      regex: /(?:Creation\s+Date|Created|Registered\s+on|Registration\s+Date):?\s*([^\n]+)/i
    },
    expirationDate: {
      keys: ['expirationDate', 'Expiration Date', 'expires', 'Expiry date', 'Registry Expiry Date', 'Expiry'],
      regex: /(?:Expir(?:ation|y)\s+Date|Registry\s+Expiry\s+Date|Expires):?\s*([^\n]+)/i
    },
    updatedDate: {
      keys: ['updatedDate', 'Updated Date', 'modified', 'Last Modified', 'Last Updated'],
      regex: /(?:Updated|Last\s+Modified|Last\s+Updated)\s+Date:?\s*([^\n]+)/i
    },
    registrantName: {
      keys: ['registrantName', 'Registrant Name', 'Registrant', 'Registrant Contact Name'],
      regex: /Registrant\s+Name:?\s*([^\n]+)/i
    },
    registrantOrganization: {
      keys: ['registrantOrganization', 'Registrant Organization', 'Org', 'Registrant Org', 'Registrant Company'],
      regex: /Registrant\s+(?:Organization|Org|Company):?\s*([^\n]+)/i
    },
    registrantEmail: {
      keys: ['registrantEmail', 'Registrant Email', 'Email', 'Registrant Contact Email'],
      regex: /Registrant\s+Email:?\s*([^\s\n]+@[^\s\n]+)/i
    },
    registrantPhone: {
      keys: ['registrantPhone', 'Registrant Phone', 'Phone', 'Registrant Contact Phone'],
      regex: /Registrant\s+Phone:?\s*([^\n]+)/i
    },
    registrantCountry: {
      keys: ['registrantCountry', 'Registrant Country', 'Country'],
      regex: /Registrant\s+Country:?\s*([^\n]+)/i
    },
    adminName: {
      keys: ['adminName', 'Admin Name', 'Administrative Contact Name', 'Administrative Name'],
      regex: /Admin(?:istrative)?\s+(?:Contact\s+)?Name:?\s*([^\n]+)/i
    },
    adminOrganization: {
      keys: ['adminOrganization', 'Admin Organization', 'Administrative Organization'],
      regex: /Admin(?:istrative)?\s+Organization:?\s*([^\n]+)/i
    },
    adminEmail: {
      keys: ['adminEmail', 'Admin Email', 'Administrative Contact Email'],
      regex: /Admin(?:istrative)?\s+Email:?\s*([^\s\n]+@[^\s\n]+)/i
    },
    techName: {
      keys: ['techName', 'Tech Name', 'Technical Contact Name', 'Technical Name'],
      regex: /Tech(?:nical)?\s+(?:Contact\s+)?Name:?\s*([^\n]+)/i
    },
    techOrganization: {
      keys: ['techOrganization', 'Tech Organization', 'Technical Organization'],
      regex: /Tech(?:nical)?\s+Organization:?\s*([^\n]+)/i
    },
    techEmail: {
      keys: ['techEmail', 'Tech Email', 'Technical Contact Email'],
      regex: /Tech(?:nical)?\s+Email:?\s*([^\s\n]+@[^\s\n]+)/i
    }
  };

  async lookup(domain: string): Promise<WhoisResult> {
    try {
      const result = await whois(domain, { follow: 3 });
      return this.parseWhoisResult(result, domain);
    } catch (error) {
      throw new Error(`WHOIS 查询失败: ${error.message}`);
    }
  }

  private parseWhoisResult(raw: any, domain: string): WhoisResult {
    const rawText = this.getRawText(raw);
    
    const result: WhoisResult = {
      domainName: this.extractField(raw, 'domainName', rawText) || domain,
      registrar: this.extractField(raw, 'registrar', rawText),
      registrationDate: this.extractField(raw, 'registrationDate', rawText),
      expirationDate: this.extractField(raw, 'expirationDate', rawText),
      updatedDate: this.extractField(raw, 'updatedDate', rawText),
      nameServers: this.extractNameServers(raw, rawText),
      status: this.extractStatus(raw, rawText),
      registrantName: this.extractField(raw, 'registrantName', rawText),
      registrantOrganization: this.extractField(raw, 'registrantOrganization', rawText),
      registrantEmail: this.extractField(raw, 'registrantEmail', rawText),
      registrantPhone: this.extractField(raw, 'registrantPhone', rawText),
      registrantCountry: this.extractField(raw, 'registrantCountry', rawText),
      adminName: this.extractField(raw, 'adminName', rawText),
      adminOrganization: this.extractField(raw, 'adminOrganization', rawText),
      adminEmail: this.extractField(raw, 'adminEmail', rawText),
      techName: this.extractField(raw, 'techName', rawText),
      techOrganization: this.extractField(raw, 'techOrganization', rawText),
      techEmail: this.extractField(raw, 'techEmail', rawText),
      rawData: rawText,
    };

    return result;
  }

  private getRawText(raw: any): string {
    if (typeof raw === 'string') {
      return raw;
    }
    try {
      return JSON.stringify(raw, null, 2);
    } catch {
      return String(raw);
    }
  }

  private extractField(obj: any, fieldName: string, rawText: string): string {
    const pattern = this.fieldPatterns[fieldName];
    if (!pattern) return '';

    let value = this.extractFromObject(obj, pattern.keys);
    if (value) return value;

    if (pattern.regex) {
      value = this.extractFromText(rawText, pattern.regex);
      if (value) return value;
    }

    return '';
  }

  private extractFromObject(obj: any, keys: string[]): string {
    if (!obj || typeof obj !== 'object') return '';

    for (const key of keys) {
      if (obj[key]) {
        const value = String(obj[key]).trim();
        if (value) return value;
      }
      const lowerKey = key.toLowerCase();
      if (obj[lowerKey]) {
        const value = String(obj[lowerKey]).trim();
        if (value) return value;
      }
    }

    for (const objKey of Object.keys(obj)) {
      for (const key of keys) {
        if (objKey.toLowerCase().includes(key.toLowerCase())) {
          const value = String(obj[objKey]).trim();
          if (value) return value;
        }
      }
    }

    return '';
  }

  private extractFromText(text: string, regex: RegExp): string {
    const match = text.match(regex);
    if (match && match[1]) {
      return match[1].trim();
    }
    return '';
  }

  private extractNameServers(obj: any, rawText: string): string[] {
    const nameServers: Set<string> = new Set();

    const objectKeys = ['nameServers', 'Name Server', 'nameservers', 'Name Servers', 'nserver', 'Nserver', 'NameServer'];
    for (const key of objectKeys) {
      if (obj[key]) {
        if (Array.isArray(obj[key])) {
          obj[key].forEach((ns: string) => {
            const clean = ns.trim().toLowerCase();
            if (clean) nameServers.add(clean);
          });
        } else if (typeof obj[key] === 'string') {
          obj[key].split(/[\s,;]+/).forEach((ns: string) => {
            const clean = ns.trim().toLowerCase();
            if (clean) nameServers.add(clean);
          });
        }
      }
    }

    for (let i = 1; i <= 10; i++) {
      const keys = [`Name Server ${i}`, `NameServer${i}`, `NS${i}`];
      for (const key of keys) {
        if (obj[key]) {
          const clean = String(obj[key]).trim().toLowerCase();
          if (clean) nameServers.add(clean);
        }
      }
    }

    const nsRegex = /(?:Name\s+Server|Nserver|NS\d*):?\s*([a-z0-9.-]+\.[a-z]{2,})/gi;
    let match;
    while ((match = nsRegex.exec(rawText)) !== null) {
      const clean = match[1].trim().toLowerCase();
      if (clean) nameServers.add(clean);
    }

    return Array.from(nameServers);
  }

  private extractStatus(obj: any, rawText: string): string[] {
    const statuses: Set<string> = new Set();

    const objectKeys = ['status', 'Domain Status', 'Status', 'domainStatus', 'Domain status'];
    for (const key of objectKeys) {
      if (obj[key]) {
        if (Array.isArray(obj[key])) {
          obj[key].forEach((s: string) => {
            const clean = this.cleanStatus(s);
            if (clean) statuses.add(clean);
          });
        } else if (typeof obj[key] === 'string') {
          obj[key].split(/[\s,;]+/).forEach((s: string) => {
            const clean = this.cleanStatus(s);
            if (clean) statuses.add(clean);
          });
        }
      }
    }

    const statusRegex = /Domain\s+Status:?\s*([a-z]+)/gi;
    let match;
    while ((match = statusRegex.exec(rawText)) !== null) {
      const clean = this.cleanStatus(match[1]);
      if (clean) statuses.add(clean);
    }

    return Array.from(statuses);
  }

  private cleanStatus(status: string): string {
    const clean = status.trim();
    if (!clean) return '';
    
    const urlRegex = /https?:\/\/[^\s]+/g;
    return clean.replace(urlRegex, '').trim();
  }
}
