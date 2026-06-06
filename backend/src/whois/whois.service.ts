import { Injectable } from '@nestjs/common';
import * as net from 'net';

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

const WHOIS_SERVERS: Record<string, string> = {
  com: 'whois.verisign-grs.com',
  net: 'whois.verisign-grs.com',
  org: 'whois.pir.org',
  info: 'whois.afilias.net',
  biz: 'whois.biz',
  io: 'whois.nic.io',
  co: 'whois.nic.co',
  me: 'whois.nic.me',
  cc: 'whois.nic.cc',
  tv: 'whois.nic.tv',
  cn: 'whois.cnnic.cn',
  'com.cn': 'whois.cnnic.cn',
  'net.cn': 'whois.cnnic.cn',
  'org.cn': 'whois.cnnic.cn',
  top: 'whois.nic.top',
  xyz: 'whois.nic.xyz',
  club: 'whois.nic.club',
  site: 'whois.nic.site',
  online: 'whois.nic.online',
  shop: 'whois.nic.shop',
  store: 'whois.nic.store',
  tech: 'whois.nic.tech',
  dev: 'whois.nic.dev',
  app: 'whois.nic.google',
  page: 'whois.nic.google',
  google: 'whois.nic.google',
  ai: 'whois.nic.ai',
  in: 'whois.inregistry.net',
  ru: 'whois.tcinet.ru',
  jp: 'whois.jprs.jp',
  kr: 'whois.kr',
  de: 'whois.denic.de',
  fr: 'whois.nic.fr',
  uk: 'whois.nic.uk',
  ca: 'whois.cira.ca',
  au: 'whois.auda.org.au',
  br: 'whois.registro.br',
  za: 'whois.co.za',
  sg: 'whois.sgnic.sg',
  hk: 'whois.hkirc.hk',
  tw: 'whois.twnic.net.tw',
  us: 'whois.nic.us',
  ws: 'whois.website.ws',
  name: 'whois.nic.name',
  pro: 'whois.registry.pro',
  aero: 'whois.aero',
  mobi: 'whois.dotmobiregistry.net',
  asia: 'whois.nic.asia',
  tel: 'whois.nic.tel',
  int: 'whois.iana.org',
  edu: 'whois.educause.edu',
  gov: 'whois.dotgov.gov',
  mil: 'whois.nic.mil',
  arpa: 'whois.iana.org',
};

const DEFAULT_WHOIS_SERVER = 'whois.iana.org';

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

  private getWhoisServer(domain: string): string {
    const parts = domain.toLowerCase().split('.');
    for (let i = 0; i < parts.length - 1; i++) {
      const tld = parts.slice(i).join('.');
      const tldKey = tld.replace(/\./g, '_');
      if (WHOIS_SERVERS[tld]) return WHOIS_SERVERS[tld];
      if (WHOIS_SERVERS[tldKey]) return WHOIS_SERVERS[tldKey];
    }
    return DEFAULT_WHOIS_SERVER;
  }

  private queryWhois(server: string, query: string, port = 43): Promise<string> {
    return new Promise((resolve, reject) => {
      const socket = net.connect({ host: server, port }, () => {
        socket.write(query + '\r\n');
      });

      let data = '';
      const timeout = setTimeout(() => {
        socket.destroy();
        reject(new Error(`WHOIS 查询超时 (${server})`));
      }, 30000);

      socket.on('data', (chunk) => {
        data += chunk.toString();
      });

      socket.on('error', (err) => {
        clearTimeout(timeout);
        reject(new Error(`WHOIS 连接错误 (${server}): ${err.message}`));
      });

      socket.on('close', () => {
        clearTimeout(timeout);
        resolve(data);
      });
    });
  }

  private async lookupWithFollow(domain: string, follow = 3): Promise<string> {
    let server = this.getWhoisServer(domain);
    let rawData = '';

    for (let i = 0; i <= follow; i++) {
      try {
        rawData = await this.queryWhois(server, domain);

        const referralMatch = rawData.match(
          /(ReferralServer|Registrar Whois|Whois Server|WHOIS Server|Registrar WHOIS Server):[^\S\n]*((?:r?whois|https?):\/\/)?([0-9A-Za-z\.\-_]*(:\d+)?)/i
        );

        if (!referralMatch || i >= follow) break;

        const nextServer = (referralMatch[3] || '').replace(/^[:\s]+/, '').replace(/^https?[:\/]+/, '');
        if (!nextServer || nextServer === server) break;

        server = nextServer;
      } catch (err) {
        if (i === 0) throw err;
        break;
      }
    }

    return rawData;
  }

  async lookup(domain: string): Promise<WhoisResult> {
    try {
      const rawData = await this.lookupWithFollow(domain, 3);
      return this.parseWhoisResult(rawData, domain);
    } catch (error: any) {
      throw new Error(`WHOIS 查询失败: ${error.message}`);
    }
  }

  private parseWhoisResult(rawData: string, domain: string): WhoisResult {
    const parsed = this.parseRawToObject(rawData);

    const result: WhoisResult = {
      domainName: this.extractField(parsed, 'domainName', rawData) || domain,
      registrar: this.extractField(parsed, 'registrar', rawData),
      registrationDate: this.extractField(parsed, 'registrationDate', rawData),
      expirationDate: this.extractField(parsed, 'expirationDate', rawData),
      updatedDate: this.extractField(parsed, 'updatedDate', rawData),
      nameServers: this.extractNameServers(parsed, rawData),
      status: this.extractStatus(parsed, rawData),
      registrantName: this.extractField(parsed, 'registrantName', rawData),
      registrantOrganization: this.extractField(parsed, 'registrantOrganization', rawData),
      registrantEmail: this.extractField(parsed, 'registrantEmail', rawData),
      registrantPhone: this.extractField(parsed, 'registrantPhone', rawData),
      registrantCountry: this.extractField(parsed, 'registrantCountry', rawData),
      adminName: this.extractField(parsed, 'adminName', rawData),
      adminOrganization: this.extractField(parsed, 'adminOrganization', rawData),
      adminEmail: this.extractField(parsed, 'adminEmail', rawData),
      techName: this.extractField(parsed, 'techName', rawData),
      techOrganization: this.extractField(parsed, 'techOrganization', rawData),
      techEmail: this.extractField(parsed, 'techEmail', rawData),
      rawData,
    };

    return result;
  }

  private parseRawToObject(raw: string): Record<string, string> {
    const obj: Record<string, string> = {};
    if (!raw) return obj;

    const lines = raw.split(/\r?\n/);
    for (const line of lines) {
      const match = line.match(/^([^:]+):\s*(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim();
        if (key && value) {
          if (obj[key]) {
            obj[key] = obj[key] + ', ' + value;
          } else {
            obj[key] = value;
          }
        }
      }
    }
    return obj;
  }

  private extractField(obj: Record<string, string>, fieldName: string, rawText: string): string {
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

  private extractFromObject(obj: Record<string, string>, keys: string[]): string {
    if (!obj || typeof obj !== 'object') return '';

    for (const key of keys) {
      if (obj[key]) {
        const value = String(obj[key]).trim();
        if (value) return value;
      }
      const lowerKey = key.toLowerCase();
      for (const objKey of Object.keys(obj)) {
        if (objKey.toLowerCase() === lowerKey) {
          const value = String(obj[objKey]).trim();
          if (value) return value;
        }
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

  private extractNameServers(obj: Record<string, string>, rawText: string): string[] {
    const nameServers: Set<string> = new Set();

    const objectKeys = ['nameServers', 'Name Server', 'nameservers', 'Name Servers', 'nserver', 'Nserver', 'NameServer'];
    for (const key of objectKeys) {
      if (obj[key]) {
        if (Array.isArray(obj[key])) {
          (obj[key] as any).forEach((ns: string) => {
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

    for (const objKey of Object.keys(obj)) {
      const lower = objKey.toLowerCase();
      if (lower.includes('name server') || lower.includes('nameserver') || lower.includes('nserver')) {
        if (typeof obj[objKey] === 'string') {
          obj[objKey].split(/[\s,;]+/).forEach((ns: string) => {
            const clean = ns.trim().toLowerCase();
            if (clean && clean.includes('.')) nameServers.add(clean);
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

  private extractStatus(obj: Record<string, string>, rawText: string): string[] {
    const statuses: Set<string> = new Set();

    const objectKeys = ['status', 'Domain Status', 'Status', 'domainStatus', 'Domain status'];
    for (const key of objectKeys) {
      if (obj[key]) {
        if (Array.isArray(obj[key])) {
          (obj[key] as any).forEach((s: string) => {
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

    for (const objKey of Object.keys(obj)) {
      if (objKey.toLowerCase().includes('status')) {
        if (typeof obj[objKey] === 'string') {
          obj[objKey].split(/[\s,;]+/).forEach((s: string) => {
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
