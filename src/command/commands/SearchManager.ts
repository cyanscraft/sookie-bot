export class SearchManager {
    private userStates: Map<string, { results: any[]; timer: any }>;

    constructor() {
        this.userStates = new Map();
    }

    saveResults(userId: string, results: any[], timeout: number = 180000) {
        this.clearResults(userId);        // 새 상태 저장
        const timer = setTimeout(() => {
            this.clearResults(userId);
            console.log(`유저(${userId})의 검색 결과가 시간 초과로 삭제되었습니다.`);
        }, timeout);
        this.userStates.set(String(userId), { results, timer });
    }

    getResults(userId: string): any[] | undefined {
        const state = this.userStates.get(String(userId));
        return state?.results;
    }

    clearResults(userId: string) {
        const state = this.userStates.get(userId);
        if (state) {
            clearTimeout(state.timer); // 기존 타이머 정리
            this.userStates.delete(userId);
        }
    }
}