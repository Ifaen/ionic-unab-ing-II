import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RedireccionEnvioPageRoutingModule } from './redireccion-envio-routing.module';

import { RedireccionEnvioPage } from './redireccion-envio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RedireccionEnvioPageRoutingModule
  ],
  declarations: [RedireccionEnvioPage]
})
export class RedireccionEnvioPageModule {}
