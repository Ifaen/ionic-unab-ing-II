import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormularioAlumPage } from './formulario-alum.page';

const routes: Routes = [
  {
    path: '',
    component: FormularioAlumPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormularioAlumPageRoutingModule {}
