import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModuloBasuraPageRoutingModule } from './modulo-basura-routing.module';

import { ModuloBasuraPage } from './modulo-basura.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModuloBasuraPageRoutingModule
  ],
  declarations: [ModuloBasuraPage]
})
export class ModuloBasuraPageModule {}
