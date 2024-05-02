import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModuloIncendiosPage } from './modulo-incendios.page';

const routes: Routes = [
  {
    path: '',
    component: ModuloIncendiosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModuloIncendiosPageRoutingModule {}
