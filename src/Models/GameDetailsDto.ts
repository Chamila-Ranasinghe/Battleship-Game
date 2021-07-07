export class GameDetailsDto {
    DestroyerCount: number
    Destroyer2Count: number
    BattleShipCount: number
    TotalScore : number
    ActiveUser : string

    constructor() {
        this.DestroyerCount = 0;
        this.Destroyer2Count = 0;
        this.BattleShipCount = 0;
        this.TotalScore = 0;
        this.ActiveUser = "";
    }
}