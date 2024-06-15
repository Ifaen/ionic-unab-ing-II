import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { MisReportesPageRoutingModule } from "./mis-reportes-routing.module";

import { MisReportesPage } from "./mis-reportes.page";
import { InformationModalComponent } from "src/app/shared/component/information-modal/information-modal.component";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MisReportesPageRoutingModule,
    SharedModule, //TODO: Probando el Modal se debe de importar aqui
  ],
  declarations: [MisReportesPage],
})
export class MisReportesPageModule {}
