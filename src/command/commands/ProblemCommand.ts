import { DB } from '../../database'
import util from '../../utils'
import { SearchManager } from './SearchManager'

const searchManager = new SearchManager()

export default class ProblemCommand {
    help:string = '문제와 답을 검색합니다.';
    invoke: RegExp = /^문제 (.+)$/;
    handle(event: any): void {
        const match = event.content.match(this.invoke)
        const searchTerm = `%${match[1]}%`
        const query = 'SELECT * FROM problems WHERE question LIKE ? OR answer LIKE ?';
        const userid = util.hashCode(event.sender.getProfileImage())
        
        const showDetailsPattern = /^문제 (\d+)$/;
        
        if (showDetailsPattern.test(event.content)) {
            const results = searchManager.getResults(String(userid))
            if(results){
                const detailMatch = event.content.match(showDetailsPattern)[1]
                const result = results[detailMatch - 1]
                if(!result) return event.reply('일치하는 번호가 없습니다.')
                const answer = JSON.parse(result.answer).map((e:any)=>
                        `(${e.isAnswer?'⭕️':'❌'}) ${e.text}`
                    )
                event.reply(
                        `Q.${result.question}\n\n`+
                        `${answer.join('\n')}`
                    )
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
                        `'${match[1]}'에 대한 검색결과가 ${rows.length}개 발견되었습니다.\n자세한 내용을 보려면 '문제 [번호]'를 입력하세요.\n\n`+
                        rows.map((e,i)=>`${i+1} | ${e.question}`).join('\n')
                        )
                }else if(rows.length == 1){
                    const row = rows[0]
                    const answer = JSON.parse(row.answer).map((e:any)=>
                        `(${e.isAnswer?'⭕️':'❌'}) ${e.text}`
                    )
                    event.reply(
                        `Q.${row.question}\n\n`+
                        `${answer.join('\n')}`
                    )
                }
                        
            }
        });
    }
}
