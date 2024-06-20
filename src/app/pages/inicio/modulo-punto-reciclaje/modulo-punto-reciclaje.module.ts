import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { ModuloPuntoReciclajePageRoutingModule } from "./modulo-punto-reciclaje-routing.module";
import { ModuloPuntoReciclajePage } from "./modulo-punto-reciclaje.page";
import { MapaComponent } from "src/app/shared/component/mapa/mapa.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModuloPuntoReciclajePageRoutingModule,
  ],
  declarations: [ModuloPuntoReciclajePage],
  exports: [ModuloPuntoReciclajePage],
})
export class ModuloPuntoReciclajePageModule {}
