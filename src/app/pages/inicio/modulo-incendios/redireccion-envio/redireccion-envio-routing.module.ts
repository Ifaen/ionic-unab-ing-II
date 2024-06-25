import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RedireccionEnvioPage } from './redireccion-envio.page';

const routes: Routes = [
  {
    path: '',
    component: RedireccionEnvioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RedireccionEnvioPageRoutingModule {}
