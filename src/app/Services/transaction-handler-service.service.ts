import { Injectable } from '@angular/core';
import { GameDetailsDto } from 'src/Models/GameDetailsDto';
import { ApiClassServiceService } from './api-class-service.service';
import { DataAccessServiceService } from './data-access-service.service';


@Injectable({
  providedIn: 'root'
})
export class TransactionHandlerServiceService {

  constructor(private dataAccess: DataAccessServiceService,
    private apiClass: ApiClassServiceService) { }

    GetAllMasterShips(callback) {
      this.dataAccess.GET(this.apiClass.Game.battleship, (response) => {
          callback(response);
      }
      );
    }

    CalculatePoints(gameData: GameDetailsDto, callback: Function) {
      console.log(gameData);
      this.dataAccess.POST(this.apiClass.Game.battleship, gameData, (response) => {
          callback(response);
      });
    }
}

