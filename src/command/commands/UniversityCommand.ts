import { DB } from '../../database'
import util from '../../utils'
import { SearchManager } from './SearchManager'
import { ShareClient } from 'ka-ling'

const KakaoLink = new ShareClient('0b7ff75f1215e1ce21c482df9c48b848','https://ondojung.mycafe24.com')

const searchManager = new SearchManager()

export default class UniversityCommand {
    help:string = '대학뱃지를 검색합니다.';
    invoke: RegExp = /^뱃지 (.+)$/;
    handle(event: any): void {
        const match = event.content.match(this.invoke)
        const searchTerm = `%${match[1]}%`
        const query = 'SELECT * FROM university WHERE name LIKE ? OR effect LIKE ?';
        const userid = util.hashCode(event.sender.getProfileImage())
        
        const showDetailsPattern = /^뱃지 (\d+)$/;
        
        if (showDetailsPattern.test(event.content)) {
            const results = searchManager.getResults(String(userid))
            if(results){
                const detailMatch = event.content.match(showDetailsPattern)[1]
                const result = results[detailMatch - 1]
                if(!result) return event.reply('일치하는 번호가 없습니다.')
                
                const effectVal = JSON.parse(result.effect)
                const effectStr  = util.generateEffect(effectVal)
                KakaoLink.send('데이지',{
                        templateId: 116069,
                        templateArgs: {
                            THU:`https://wandering-river-2012.ondojung.workers.dev/university_${result.id}.png`,
                            NAME:result.name,
                            CONTENT:effectStr
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
                        `'${match[1]}'에 대한 검색결과가 ${rows.length}개 발견되었습니다.\n자세한 내용을 보려면 '뱃지 [번호]'를 입력하세요.\n\n`+
                        rows.map((e,i)=>`${i+1} | ${e.name}`).join('\n')
                        )
                }else if(rows.length == 1){
                    const row = rows[0]
                    const effectVal = JSON.parse(row.effect)
                    const effectStr  = util.generateEffect(effectVal)
                    
                    KakaoLink.send('데이지',{
                        templateId: 116069,
                        templateArgs: {
                            THU:`https://wandering-river-2012.ondojung.workers.dev/university_${row.id}.png`,
                            NAME:row.name,
                            CONTENT:effectStr
                        },
                    },'custom')
                }
                        
            }
        });
    }
}
