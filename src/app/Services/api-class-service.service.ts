import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiClassServiceService {

  constructor() { }

  private Host = environment.apiUrl;
  private api = this.Host + "api/";
  private Battleship = "BattleShipGameLogic";

  Game = {
    battleship: this.api + this.Battleship
  }
}
