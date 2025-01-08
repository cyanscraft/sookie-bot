import { DB } from '../../database'
import util from '../../utils'
import { SearchManager } from './SearchManager'

const searchManager = new SearchManager()
const traitTypeEmoji = {
    normal:'🟣',
    bad:'🔴',
    good:'🟢'
}

type TraitKey = keyof typeof traitTypeEmoji;


export default class ProblemCommand {
    help:string = '특성을 검색합니다.';
    invoke: RegExp = /^특성 (.+)$/;
    handle(event: any): void {
        const match = event.content.match(this.invoke)
        const searchTerm = `%${match[1]}%`
        const query = 'SELECT * FROM traits WHERE name LIKE ? OR description LIKE ? OR rank LIKE ?';
        const userid = util.hashCode(event.sender.getProfileImage())
        
        const showDetailsPattern = /^특성 (\d+)$/;
        
        if (showDetailsPattern.test(event.content)) {
            const results = searchManager.getResults(String(userid))
            if(results){
                const detailMatch = event.content.match(showDetailsPattern)[1]
                const result = results[detailMatch - 1]
                if(!result) return event.reply('일치하는 번호가 없습니다.')
                event.reply(
                        `┌─────────────┐\n`+
                        `│${traitTypeEmoji[result.type as TraitKey]} ${result.rank=='none'?'':`[${result.rank}]`} ${result.name}\n`+
                        `└─────────────┘\n`+
                        `${result.description}`
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
                        `'${match[1]}'에 대한 검색결과가 ${rows.length}개 발견되었습니다.\n자세한 내용을 보려면 '특성 [번호]'를 입력하세요.\n\n`+
                        rows.map((e,i)=>`${i+1} | ${e.name}`).join('\n')
                        )
                }else if(rows.length == 1){
                    const row = rows[0]
                    
                    event.reply(
                        `┌─────────────┐\n`+
                        `│${traitTypeEmoji[row.type as TraitKey]} ${row.rank=='none'?'':`[${row.rank}]`} ${row.name}\n`+
                        `└─────────────┘\n`+
                        `${row.description}`
                    )
                }
                        
            }
        });
    }
}