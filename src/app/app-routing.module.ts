import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BattleGroundComponent } from './battle-ground/battle-ground.component';


const routes: Routes = [
  {path:'', component:BattleGroundComponent, pathMatch:'full'},
  { path: '**', component: BattleGroundComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
