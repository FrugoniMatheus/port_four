import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { NovaMetaPageRoutingModule } from './nova-meta-routing.module';
import { NovaMetaPage } from './nova-meta.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    IonicModule,
    NovaMetaPageRoutingModule,
  ],
  declarations: [NovaMetaPage]
})
export class NovaMetaPageModule {}
