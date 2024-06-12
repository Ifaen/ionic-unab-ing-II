import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MisReportesPageRoutingModule } from './mis-reportes-routing.module';

import { MisReportesPage } from './mis-reportes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MisReportesPageRoutingModule
  ],
  declarations: [MisReportesPage]
})
export class MisReportesPageModule {}
