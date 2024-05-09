import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModuloAccidenteVehicularPageRoutingModule } from './modulo-accidente-vehicular-routing.module';

import { ModuloAccidenteVehicularPage } from './modulo-accidente-vehicular.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModuloAccidenteVehicularPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ModuloAccidenteVehicularPage]
})
export class ModuloAccidenteVehicularPageModule {}
