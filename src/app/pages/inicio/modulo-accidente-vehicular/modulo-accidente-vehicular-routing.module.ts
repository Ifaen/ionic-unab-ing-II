import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModuloAccidenteVehicularPage } from './modulo-accidente-vehicular.page';

const routes: Routes = [
  {
    path: '',
    component: ModuloAccidenteVehicularPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModuloAccidenteVehicularPageRoutingModule {}
