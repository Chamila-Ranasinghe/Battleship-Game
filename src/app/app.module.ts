import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BattleGroundComponent } from './battle-ground/battle-ground.component';

import { RouterModule } from '@angular/router';

import { TransactionHandlerServiceService } from './Services/transaction-handler-service.service';
import { DataAccessServiceService } from './Services/data-access-service.service';
import { ApiClassServiceService } from './Services/api-class-service.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    BattleGroundComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    HttpClientModule,
  ],
  providers: [
    TransactionHandlerServiceService,
    DataAccessServiceService,
    ApiClassServiceService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
