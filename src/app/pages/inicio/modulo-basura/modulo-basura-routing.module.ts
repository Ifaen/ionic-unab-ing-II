import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModuloBasuraPage } from './modulo-basura.page';

const routes: Routes = [
  {
    path: '',
    component: ModuloBasuraPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModuloBasuraPageRoutingModule {}
