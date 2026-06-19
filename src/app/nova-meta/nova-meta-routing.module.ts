import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NovaMetaPage } from './nova-meta.page';

const routes: Routes = [
  {
    path: '',
    component: NovaMetaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NovaMetaPageRoutingModule {}
