import { analyzeAndValidateNgModules } from '@angular/compiler';
import { INT_TYPE } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { GameDetailsDto } from 'src/Models/GameDetailsDto';
import { TransactionHandlerServiceService } from '../Services/transaction-handler-service.service';

@Component({
  selector: 'app-battle-ground',
  templateUrl: './battle-ground.component.html',
  styleUrls: ['./battle-ground.component.css']
})
export class BattleGroundComponent implements OnInit {
  userGrid: any;
  computerGrid: any;
  displayGrid: any;
  ships: any;
  destroyer1: any;
  destroyer2: any;
  battleship: any;
  width: number = 10;
  userSquares: HTMLDivElement[] = [];
  computerSquares: HTMLDivElement[] = [];
  selectedShipNameWithIndex: string = '';
  draggedShip: any;
  draggedShipLength: number;
  isHorizontal: boolean;
  isGameOver: boolean;
  isGameStarted: boolean;
  currentPlayer: string = '';
  chance: string;
  computerShipArrayList: Array<any>[] = [];
  GameData: GameDetailsDto;
  destroyerCount: number = 0
  destroyer2Count: number = 0
  battleshipCount: number = 0
  computerDestroyerCount: number = 0
  computerDestroyer2Count: number = 0
  computerBattleshipCount: number = 0
  takencount: number = 0

  constructor(private renderer: Renderer2,
    private transactionService: TransactionHandlerServiceService) {

    this.isHorizontal = true;
    this.chance = 'Place Your Ships To Start';
    this.isGameOver = false;
    this.isGameStarted = false;
    this.GameData = new GameDetailsDto();
    this.takencount = 0;
  }

  ngOnInit() {

    this.userGrid = document.querySelector('.grid-user');
    this.computerGrid = document.querySelector('.grid-computer');
    this.destroyer1 = document.querySelector('.destroyer-container');
    this.destroyer2 = document.querySelector('.destroyer2-container');
    this.battleship = document.querySelector('.battleship-container');
    this.displayGrid = document.querySelector('.grid-displayShips');
    this.ships = document.querySelectorAll('.ship');


    this.createBoard(this.userGrid, this.userSquares);
    this.createBoard(this.computerGrid, this.computerSquares);
    this.AssignDraggableEventsToDivs();

    this.GetDefaultShips();
  }

  GetDefaultShips() {
    this.transactionService.GetAllMasterShips(responce => {
      if (responce.IsSucessfull) {
        this.computerShipArrayList = responce.Dataset;
        this.generateComputerShips(this.computerShipArrayList[0]);
        this.generateComputerShips(this.computerShipArrayList[1]);
        this.generateComputerShips(this.computerShipArrayList[2]);
      }
      else {
        this.computerShipArrayList = []
      }

    });
  }

  ////create divs for the square 10* 10 length
  createBoard(grid, squareArray) {
    for (let i = 0; i < 100; i++) {
      var divsquares = this.renderer.createElement('div')
      divsquares.dataset.id = i.toString();
      this.renderer.appendChild(grid, divsquares);
      squareArray.push(divsquares);
    }
  }


  generateComputerShips(ships: any) {

    let direction: number;
    //// this is generating a random number for directions it can be 1 or 0
    let randomDirection = Math.floor(Math.random() * ships.directions.length)
    let current = ships.directions[randomDirection]
    if (randomDirection == 0) {
      direction = 1;
    }
    if (randomDirection == 1) {
      direction = 10;
    }

    let randomStart = Math.abs(Math.floor(Math.random() * this.computerSquares.length - (ships.directions[0].length * direction)))

    ////check the box is taken or overlap
    let isTaken = current.some(index => this.computerSquares[randomStart + index].classList.contains('taken'))
    let isAtRightEdge = current.some(index => (randomStart + index) % this.width == this.width - 1)
    let isAtLeftEdge = current.some(index => (randomStart + index) % this.width == 0)
    if (!isTaken && !isAtRightEdge && !isAtLeftEdge) {

      current.forEach(index => this.computerSquares[randomStart + index].classList.add('taken', ships.name));
    }
    else {
      this.generateComputerShips(ships);
    }
  }

  rotateShips() {

    if (this.isHorizontal) {
      this.destroyer1.classList.toggle('destroyer-container-verticle')
      this.destroyer2.classList.toggle('destroyer2-container-verticle')
      this.battleship.classList.toggle('battleship-container-verticle')
      this.isHorizontal = false;
      return;
    }
    if (!this.isHorizontal) {
      this.destroyer1.classList.remove('destroyer-container-verticle')
      this.destroyer2.classList.remove('destroyer2-container-verticle')
      this.battleship.classList.remove('battleship-container-verticle')
      this.isHorizontal = true;
    }

  }

  shipiclicked(e) {
    this.selectedShipNameWithIndex = e.target.id;
  }

  allowDrop(ev) {
    ev.preventDefault();
  }

  AssignDraggableEventsToDivs() {
    this.computerSquares.forEach(square => square.addEventListener('click', this.onUserClick.bind(this)));
    this.userSquares.forEach(square => square.addEventListener('dragstart', this.ondragstart.bind(this)))
    this.userSquares.forEach(square => square.addEventListener('drop', this.ondrop.bind(this)))
  }

  ondragstart(e) {
    this.draggedShip = e.target;
    this.draggedShipLength = e.srcElement["childElementCount"];
  }

  ondrop(event: DragEvent) {

    let shpNameWithLastId = this.draggedShip.lastChild.id
    let shipClass = shpNameWithLastId.slice(0, -2)
    let lastShipIndex = parseInt(shpNameWithLastId.substr(-1))
    ///full lenght after dragging the ship to the grid point
    var currentClikedSquareInUser = parseInt(event.srcElement["dataset"]["id"]);
    let shiplastId = lastShipIndex + currentClikedSquareInUser;
    let selectedShipIndex = parseInt(this.selectedShipNameWithIndex.substr(-1));
    shiplastId = shiplastId - selectedShipIndex

    if (this.isHorizontal) {

      for (let i = 0; i < this.draggedShipLength; i++) {
        this.userSquares[currentClikedSquareInUser - selectedShipIndex + i].classList.add('taken', shipClass);
      }
    }
    else {
      for (let i = 0; i < this.draggedShipLength; i++) {
        this.userSquares[currentClikedSquareInUser - selectedShipIndex + this.width * i].classList.add('taken', shipClass);
      }
    }

    this.displayGrid.removeChild(this.draggedShip);
  }

  startGame() {

    this.isGameOver = false;
    this.isGameStarted = true;
    this.playGame()
  }

  ////Game Logic
  playGame() {
    if (this.isGameOver && !this.isGameStarted) return
    if (this.chance.toString().includes('Computers Go')) {
      setTimeout(() => {
        this.onComputerclick()
      }, 1800);
    }
  }

  onUserClick(event: Event) {

    if (this.isGameOver && !this.isGameStarted) return
    ////check if the ships are placed by the user 
    this.userSquares.forEach(square => {
      if (square.classList.contains('taken'))
        this.takencount++;
    });

    if (this.takencount != 0) {

      var squareId = parseInt(event.srcElement["dataset"]["id"])

      ////check if the user has click already clicked square
      if (!this.computerSquares[squareId].classList.contains('boom')
        && !this.computerSquares[squareId].classList.contains('miss')) {
  
          console.log(this.computerSquares[squareId].classList.contains('boom'))
          console.log(this.computerSquares[squareId].classList.contains('miss'))
        if (this.computerSquares[squareId].classList.contains('destroyer')) {
          this.destroyerCount++;
        }
        else if (this.computerSquares[squareId].classList.contains('destroyer2')) {
          this.destroyer2Count++;
        }
        else if (this.computerSquares[squareId].classList.contains('battleship')) {
          this.battleshipCount++;
        }

        if (this.computerSquares[squareId].classList.contains('taken')) {
          this.computerSquares[squareId].classList.add('boom')
        }
        else {
          this.computerSquares[squareId].classList.add('miss')
        }

        this.checkForWin(this.destroyerCount, this.destroyer2Count, this.battleshipCount, "YOU");
        if (!this.isGameOver) {
          this.chance = 'Computers Go';
          this.playGame();
        }
      }
      else {
        this.chance = 'Your Go';
        this.playGame();
      }
    }
  }

  onComputerclick() {
    ////generate a random square 
    var squareId = Math.floor(Math.abs(Math.random() * this.userSquares.length))

    ////check if the user has click already clicked square
    if (!this.computerSquares[squareId].classList.contains('boom')
      && !this.computerSquares[squareId].classList.contains('miss')) {

      if (this.userSquares[squareId].classList.contains('destroyer')) {
        this.computerDestroyerCount++;
      }
      else if (this.userSquares[squareId].classList.contains('destroyer2')) {
        this.computerDestroyer2Count++;
      }
      else if (this.userSquares[squareId].classList.contains('battleship')) {
        this.computerBattleshipCount++;
      }

      if (this.userSquares[squareId].classList.contains('taken')) {
        this.userSquares[squareId].classList.add('boom')
      }
      else {
        this.userSquares[squareId].classList.add('miss')
      }

      this.checkForWin(this.computerDestroyerCount, this.computerDestroyer2Count, this.computerBattleshipCount,
        "COMPUTER");
      if (!this.isGameOver) {
        this.chance = 'Your Go';
        this.playGame();
      }
    }
    else
    {
      this.chance = 'Computer Go';
        this.playGame();
    }

  }

  checkForWin(destroyerCount: number, destroyer2Count: number, battleshipCount: number, activeUser: string) {
    
    this.GameData.DestroyerCount = destroyerCount;
    this.GameData.Destroyer2Count = destroyer2Count;
    this.GameData.BattleShipCount = battleshipCount;
    this.GameData.ActiveUser = activeUser;

    this.transactionService.CalculatePoints(this.GameData, responce => {
      if (responce.IsSucessfull) {

        this.isGameOver = true;
        this.isGameStarted = false;
        this.chance = responce.Message;
      }
      else {
        setTimeout(() => {
          this.chance = responce.Message;
        }, 1000);

      }

    });

  }


}


