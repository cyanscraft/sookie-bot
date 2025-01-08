import sqlite3 from 'sqlite3';

export const DB = new sqlite3.Database('/data/data/com.termux/files/home/Projects/SookieBot/src/database/game_data.db', (err) => {
    if (err) {
        console.error('데이터베이스 연결 오류:', err.message);
    } else {
        
    }
});
