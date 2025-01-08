"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@remote-kakao/core");
require("./utils/logger");
const prefix = '.';
const server = new core_1.Server();
server.on('message', (msg) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log(msg);
    if (!msg.content.startsWith(prefix))
        return;
    const args = msg.content.split(' ');
    const cmd = (_a = args.shift()) === null || _a === void 0 ? void 0 : _a.slice(prefix.length);
    if (cmd === 'ping') {
    }
}));
server.start(3001);
logger.info('start');
