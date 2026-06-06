"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const menu_module_1 = require("./menu/menu.module");
const menu_entity_1 = require("./menu/menu.entity");
const holiday_module_1 = require("./holiday/holiday.module");
const holiday_entity_1 = require("./holiday/holiday.entity");
const whois_module_1 = require("./whois/whois.module");
const http_headers_module_1 = require("./http-headers/http-headers.module");
const crx_downloader_module_1 = require("./crx-downloader/crx-downloader.module");
const path = require("path");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'sqlite',
                database: path.join(__dirname, '../data/database.sqlite'),
                entities: [menu_entity_1.Menu, holiday_entity_1.Holiday],
                synchronize: true,
                logging: false,
            }),
            menu_module_1.MenuModule,
            holiday_module_1.HolidayModule,
            whois_module_1.WhoisModule,
            http_headers_module_1.HttpHeadersModule,
            crx_downloader_module_1.CrxDownloaderModule,
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map