import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MisReportesPage } from './mis-reportes.page';

const routes: Routes = [
  {
    path: '',
    component: MisReportesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MisReportesPageRoutingModule {}
