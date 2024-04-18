import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModuloAlumbradoPageRoutingModule } from './modulo-alumbrado-routing.module';

import { ModuloAlumbradoPage } from './modulo-alumbrado.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModuloAlumbradoPageRoutingModule
  ],
  declarations: [ModuloAlumbradoPage]
})
export class ModuloAlumbradoPageModule {}
