import { DB } from '../../database'
import util from '../../utils'
import { SearchManager } from './SearchManager'
import { ShareClient } from 'ka-ling'

const KakaoLink = new ShareClient('0b7ff75f1215e1ce21c482df9c48b848','https://ondojung.mycafe24.com')

type RankType = {
    one:string;
    two:string;
    three:string;
}
const rank:RankType = {
    one:'🌟',
    two:'🌟🌟',
    three:'🌟🌟🌟'
}
const searchManager = new SearchManager()

export default class SkinCommand {
    help:string = '캐릭터 스킨정보를 가져옵니다.';
    invoke: RegExp = /^스킨 (.+)$/;
    handle(event: any): void {
        const match = event.content.match(this.invoke)
        const searchTerm = `%${match[1]}%`
        const query = 'SELECT * FROM characters WHERE name LIKE ? OR effectDescription LIKE ?';
        const userid = util.hashCode(event.sender.getProfileImage())
        
        const showDetailsPattern = /^스킨 (\d+)$/;
        
        if (showDetailsPattern.test(event.content)) {
            const results = searchManager.getResults(String(userid))
            
            if(results){
                const detailMatch = event.content.match(showDetailsPattern)[1]
                const result = results[detailMatch - 1]
                if(!result) return event.reply('일치하는 번호가 없습니다.')
                const rowRank:keyof RankType = result.rank
                KakaoLink.send('데이지',{
                        templateId: 115952,
                        templateArgs: {
                            THU:`https://wandering-river-2012.ondojung.workers.dev/assets_images_modules_character_card_${result.id}.png`,
                            NAME:result.name,
                            RANK:rank[rowRank]
                        },
                    },'custom')
                return;
            }
        }
        
        DB.all(query, [searchTerm,searchTerm], (err:Error, rows:any[]) => {
            if (err) {
                console.error('데이터 검색 오류:', err.message);
            } else {
                if(rows.length == 0) 
                    return event.reply('검색 결과가 없습니다.')
                else if(rows.length > 1){
                    searchManager.saveResults(String(userid), rows)
                    return event.reply(
                        `'${match[1]}'에 대한 검색결과가 ${rows.length}개 발견되었습니다.\n자세한 내용을 보려면 '스킨 [번호]'를 입력하세요.\n\n`+
                        rows.map((e,i)=>`${i+1} | ${e.name}`).join('\n')
                        )
                }else if(rows.length == 1){
                    const row = rows[0]
                    const rowRank:keyof RankType = row.rank
                    KakaoLink.send('데이지',{
                        templateId: 115952,
                        templateArgs: {
                            THU:`https://wandering-river-2012.ondojung.workers.dev/assets_images_modules_character_card_${row.id}.png`,
                            NAME:row.name,
                            RANK:rank[rowRank]
                        },
                    },'custom')
                }
                        
            }
        });
    }
}
