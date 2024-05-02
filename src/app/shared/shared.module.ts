import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HeaderComponent } from "./component/header/header.component";
import { CustomInputComponent } from "./component/custom-input/custom-input.component";
import { LogoComponent } from "./component/logo/logo.component";
import { IonicModule } from "@ionic/angular";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MapaComponent } from "./component/mapa/mapa.component";
import { TabsComponent } from "./component/tabs/tabs.component";
import { BotonesComponent } from "./component/botones/botones.component";
import { FiltrosComponent } from "./component/filtros/filtros.component";
import { RouterModule } from "@angular/router";

@NgModule({
  declarations: [
    HeaderComponent,
    CustomInputComponent,
    LogoComponent,
    MapaComponent,
    TabsComponent,
    BotonesComponent,
    FiltrosComponent,
  ],
  exports: [
    HeaderComponent,
    CustomInputComponent,
    LogoComponent,
    ReactiveFormsModule,
    MapaComponent,
    TabsComponent,
    BotonesComponent,
    FiltrosComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
  ],
})
export class SharedModule {}
