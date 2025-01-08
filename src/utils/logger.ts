import { createLogger, format, transports } from 'winston';
import chalk from 'chalk';

// 로그 레벨별 색상 정의
const levelColors: { [key: string]: (msg: string) => string } = {
  info: chalk.blue.inverse,
  warn: chalk.yellow.inverse,
  error: chalk.red.inverse,
  debug: chalk.green.inverse,
};

// 커스텀 포맷 정의
const customFormat = format.printf(({ level, message, timestamp }) => {
  const date = new Date(timestamp as string);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? '오후' : '오전';
  const formattedTime = `${period} ${String(hours % 12 || 12).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

  // 레벨 색상 적용
  const colorizer = levelColors[level] || ((msg: string) => msg);
  const coloredLevel = colorizer(`[${level.toUpperCase()}]`);

  return `${coloredLevel} [${formattedTime}] ${message}`;
});

// 로거 생성
const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    customFormat // 커스텀 포맷 적용
  ),
  transports: [
    new transports.Console(), // 콘솔 출력
    new transports.File({ filename: 'app.log' }), // 파일 저장
  ],
});

export default logger;