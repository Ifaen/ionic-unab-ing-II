import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModuloIncendiosPageRoutingModule } from './modulo-incendios-routing.module';

import { ModuloIncendiosPage } from './modulo-incendios.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModuloIncendiosPageRoutingModule
  ],
  declarations: [ModuloIncendiosPage]
})
export class ModuloIncendiosPageModule {}
