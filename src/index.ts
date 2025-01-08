import { Server } from '@remote-kakao/core';
import logger from './utils/logger'
import { KakaoClient,ShareClient } from 'ka-ling'
import Commands from './command/CommandManager'


const manager = new Commands();
const Kakao = new KakaoClient('seohayeon.kr@gmail.com','tjgkdus0207*')
const KakaoLink = new ShareClient('c56b1c6a9e0023ff404d956096da3656','https://ondojung.mycafe24.com')

const server = new Server();

server.on('message', async (msg) => {
    manager.handleCommand(msg)
});

server.start(3000);
logger.info('SEVER ON PORT 3000')

