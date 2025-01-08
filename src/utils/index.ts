const subjectType={
    korean:'국어',
    math:'수학',
    english:'영어',
    tamgoos:'탐구',
    all:'모든'
}

type SubjectKey = keyof typeof subjectType;



export default class Util{
    static hashCode(str:any) {
        let hash = 0;
        if (str.length === 0) return hash;
    
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash |= 0; // 32비트 정수로 변환
        }
        return hash;
    }
    static generateEffect(effect:any){
        console.log(effect)
        switch (effect.type) {
            case "plusStat":
                if (effect.plusStatType === "detail") {
                    return `${subjectType[effect.subjectAbstractType as SubjectKey]} 공부 효율 ${effect.extraStat}% 증가\n스토리모드 ${effect.storyStat}% 증가`;
                } else if (effect.plusStatType === "all") {
                return `모든 공부 효율 ${effect.extraStat}% 증가\n스토리모드 ${effect.storyStat}% 증가`;
                }
            break;
            
            case "goalReward":
                return `이주의 목표 보상 ${((effect.percentPlusReward - 1) * 100).toFixed(1)}% 증가`;
            
            case "exerciseExp":
                return `운동 경험치 +${((effect.percentPlusExp - 1) * 100).toFixed(1)}%`;
                
            case "firstPlusStat":
                return `${subjectType[effect.plusStatType as SubjectKey] || subjectType[effect.subjectAbstractType as SubjectKey]} 초기 능력치 +${effect.stat}`;
            
            case "partTimeJobMoney":
                return `알바 수입 ${((effect.percentPlusMoney - 1) * 100).toFixed(1)}% 증가`;
            
            case "plusSleepHp":
                return `[잠자기특화 장소]에서 잠자기 체력 회복량 ${effect.plusValue} 증가`;
                
            case "partTimeJobExp":
                return `알바 경험치 +${((effect.percentPlusExp - 1) * 100).toFixed(1)}%`;
                
            case "firstPlusMoney":
                return `초기 돈 +${effect.money}`;
            
            default:
                return "알 수 없는 효과";
        }
    }
}