"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
// 커스텀 포맷 정의
const customFormat = winston_1.format.printf(({ level, message, timestamp }) => {
    const date = new Date(timestamp); // 문자열로 타입 단언
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? '오후' : '오전';
    const formattedTime = `${period} ${String(hours % 12 || 12).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    return `[${formattedTime}] [${level.toUpperCase()}] ${message}`;
});
// 로거 생성
const logger = (0, winston_1.createLogger)({
    level: 'info', // 최소 로그 레벨
    format: winston_1.format.combine(winston_1.format.timestamp(), customFormat),
    transports: [
        new winston_1.transports.Console(),
        new winston_1.transports.File({ filename: 'app.log' }) // 파일에 기록
    ],
});
// 전역 객체에 로거 추가
global.logger = logger;
exports.default = logger;
