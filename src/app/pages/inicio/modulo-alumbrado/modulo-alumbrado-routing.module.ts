import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModuloAlumbradoPage } from './modulo-alumbrado.page';

const routes: Routes = [
  {
    path: '',
    component: ModuloAlumbradoPage
  },  {
    path: 'formulario-alum',
    loadChildren: () => import('./formulario-alum/formulario-alum.module').then( m => m.FormularioAlumPageModule)
  },
  {
    path: 'contactos',
    loadChildren: () => import('./contactos/contactos.module').then( m => m.ContactosPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModuloAlumbradoPageRoutingModule {}
