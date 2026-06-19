import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { RegistrarTreinoPageRoutingModule } from './registrar-treino-routing.module';
import { RegistrarTreinoPage } from './registrar-treino.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    IonicModule,
    RegistrarTreinoPageRoutingModule,
  ],
  declarations: [RegistrarTreinoPage]
})
export class RegistrarTreinoPageModule {}
