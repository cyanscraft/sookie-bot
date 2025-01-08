import { Logger } from 'winston';

declare global {
  var logger: Logger; // 글로벌 `logger` 정의
}

export {};