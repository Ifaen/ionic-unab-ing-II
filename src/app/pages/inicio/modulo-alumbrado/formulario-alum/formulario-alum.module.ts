import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormularioAlumPageRoutingModule } from './formulario-alum-routing.module';

import { FormularioAlumPage } from './formulario-alum.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormularioAlumPageRoutingModule
  ],
  declarations: [FormularioAlumPage]
})
export class FormularioAlumPageModule {}
