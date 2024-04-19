import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModuloAlumbradoPage } from './modulo-alumbrado.page';

const routes: Routes = [
  {
    path: '',
    component: ModuloAlumbradoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModuloAlumbradoPageRoutingModule {}
